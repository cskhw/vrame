<template>
  <div
    class="editor ipedit-draft-tinymce-oxide"
    style="height: 100%"
    :style="{}"
    ref="editor"
  >
    <Editor
      id="ex-editor"
      class="ipac-editor"
      :init="{
        selector: '.ipac-editor',
        plugins:
          'paste wordcount spellchecker image charmap searchreplace table image lists hr fullscreen preview',
        external_plugins: {
          tiny_mce_wiris: `/wiris/mathtype-tinymce5/plugin.min.js`,
        },
        menubar: false,
        toolbar: `undo redo | searchreplace bold italic underline strikethrough subscript superscript removeformat`,
        toolbar_mode: 'sliding',
        draggable_modal: true,
        paste_data_images: true,
        content_style: `
        ::-webkit-scrollbar {
          width: 6px;
          cursor: pointer;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #c8c9cf;
          border-radius: 10px;
          background-clip: padding-box;
        }      
        ::-webkit-scrollbar-track {
          border-radius: 10px;
          background: transparent !important;
        }
        html{
          overflow: overlay;
        }
        body { 
          margin: 1rem;
          font-family: '${
            appStore.lang === 'KO'
              ? '맑은 고딕'
              : appStore.lang === 'JA'
              ? 'Meiryo'
              : appStore.lang === 'EN'
              ? 'Times New Roman'
              : 'sans-serif'
          }'; font-size: 16px;
          text-indent: 2rem;
          line-height: 1.8;
        }
        p { margin: 0; text-align: justify;} 
        .autocomplete { color:magenta; font-weight:bold} 
        .antecedent { background-color:red}}        
        `,
        visualchars_default_state: true,
        elementpath: false,
        branding: false,
        resize: false,
        skin: false,
        content_css: '/tinymce/content.min.css',
        setup: editorSetup,
      }"
      :style="{
        ...style,
      }"
    >
    </Editor>
    <!-- 자동완성 패널 -->
    <div
      ref="autoBox"
      :id="'auto-box-' + id"
      class="auto-box"
      v-show="isPanelOn"
      :style="{
        left: autoBoxLeft + 'px',
        top: autoBoxTop + 'px',
        backgroundColor: stores.ts.isDarkmode
          ? 'white'
          : stores.ts.darkmodePalette.backgroundColor,
      }"
    >
      <div
        class="auto-box-item"
        :style="{
          '--background-color':
            panelSelected == index
              ? stores.ts.isDarkmode
                ? '#EEEEEE'
                : '#2d2d2d'
              : '',
          '--background-color-hover': stores.ts.isDarkmode
            ? '#EEEEEE'
            : '#2d2d2d',
        }"
        v-for="(item, index) in popupList"
        :key="index"
        @click="changeToAutocompleteText(item)"
      >
        <button
          style="text-align: start; white-space: normal; width: 12.5rem"
          :style="{
            color: stores.ts.isDarkmode
              ? 'black'
              : stores.ts.darkmodePalette.color,
          }"
          v-html="item?.autocompleteText"
        ></button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import tinymce from "tinymce/tinymce";
import { ref, watch, onMounted } from "vue";
import "tinymce/tinymce";
import "tinymce/icons/default/icons.min.js";
import "tinymce/plugins/charmap";
import "tinymce/plugins/image";
import "tinymce/plugins/lists";
import "tinymce/plugins/paste";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/spellchecker";
import "tinymce/plugins/table";
import "tinymce/plugins/hr";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/preview";
import "tinymce/plugins/fullscreen";
import "tinymce/themes/mobile";
import "tinymce/themes/silver";
import type { Editor as EditorType, RawEditorSettings } from "tinymce/tinymce";

import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import Editor from "@tinymce/tinymce-vue";
import * as Util from "@/assets/javascripts/ipedit_util";
import * as ClaimHandler from "@/assets/javascripts/ipedit_claim_handler";
import type { ClaimData, ElementData } from "@/types/case";

import { storeToRefs } from "pinia";

const props = defineProps<{
  init?: RawEditorSettings;
  id?: string;
  data?: string;
  style?: object;
  inline?: boolean;
  useAutocomplete?: boolean;
  claimEditor?: boolean;
  disabled?: boolean;
  elementList?: ElementData[];
}>();

console.log(props.elementList);

function editorSetup(editor: EditorType) {
  // 아래쪽에 정의한 자동완성용 셋업 실행
  _tinyConfig.value(editor);
}

const appStore = useAppStore();
const userStore = useUserStore();
const modalStore = useModalStore();
const i18nStore = useI18NStore();
const themeStore = useThemeStore();
const workspaceStore = useWorkspaceStore();

const stores = {
  as: appStore,
  us: userStore,
  ms: modalStore,
  is: i18nStore,
  ts: themeStore,
  ws: workspaceStore,
};

// 에디터 핸들링용 변수들
/****************************************
 * 자동완성 핸들링용
 ***************************************/
// 자동완성 및 핸들링을 위한 selection 및 range
let editorSelection = null;
let editorRange: Range | null = null;

// 자동완성을 위한 keyword
let editorKeyword: string | undefined = "";
// 자동완성리스트

let candidateElementList: Array<string | ElementData[]> = [];

// 문장의 처음 단어인지 여부(FORMAT/USPTO인 경우 첫글자 대문자 변경을 위해 사용)
let isFirstWordInSentence = false;

// 자동완성 type.
let autocompleteType = "";
// 선행사.
let editorAntecedent = "";
// 포맷 코드
let format_code_path = "";

console.log(appStore.lang);
setupInitialData(appStore.lang);

function setupInitialData(lang: string) {
  let fontName = "";

  if (lang === "KO") {
    autocompleteType = "TYPE1";
    editorAntecedent = "상기";
    format_code_path = "FORMAT/KIPO";
    fontName = "맑은 고딕";
  } else if (lang === "JA") {
    autocompleteType = "TYPE3";
    editorAntecedent = "前記";
    format_code_path = "FORMAT/JPO";
    fontName = "Meiryo";
  } else if (lang === "EN") {
    autocompleteType = "TYPE4";
    editorAntecedent = "the";
    format_code_path = "FORMAT/USPTO";
    fontName = "Times New Roman";
  } else {
    autocompleteType = "TYPE1";
    editorAntecedent = "the";
    format_code_path = "FORMAT/USPTO";
    fontName = "sans-serif";
  }

  // 현재 열려있는 모든 에디터에 폰트 패밀리 스타일 부여
  if (tinymce.activeEditor)
    tinymce.activeEditor.contentWindow.document.body.style.fontFamily =
      fontName;
}

// font 크기
let fontSize = "16px";

// 자동완성 패널 ON/OFF 상태
let isPanelOn = ref(false);
// 자동완성 패널용 리스트
const popupList = ref<ElementData[]>([]);
// 자동완성 패널에서 선택된 아이템의 index
const panelSelected = ref(0);

// 현재 발생된 keyDownEvent 이벤트 저장용
let keyDownEvent: KeyboardEvent | undefined = undefined;

const autoBoxTop = ref(0);
const autoBoxLeft = ref(0);
const autoBox = ref<HTMLElement>();
const autoBoxMaxHeight = 196;

const editor = ref<HTMLElement>();

// tinymce 에디터의 이벤트 설정
const _tinyConfig = ref();
_tinyConfig.value = (editor: EditorType) => {
  // console.log("editor", editor);
  // TODO: if 최적화
  editor.on("keydown", function (e) {
    // console.log(e);
    keyDownEvent = e;

    // 패널이 떠 있을 때 들어오는 이벤트 핸들링
    if (isPanelOn.value) {
      // 엔터 또는 탭인 경우, 자동완성 태그로 치환
      if (e.key == "Enter" || e.key == "Tab") {
        e.preventDefault();
        e.stopPropagation();
        changeToAutocompleteText(popupList.value[panelSelected.value]);
        return false;
      }
      // 화살표 아래이면 리스트에서 아래 이동
      else if (e.key == "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        if (panelSelected.value < popupList.value.length - 1)
          panelSelected.value++;
        // 패널에서 선택된 엘리먼트가 보이도록 만듬
        const selectedEl: HTMLElement = autoBox.value?.children[
          panelSelected.value
        ] as HTMLElement;
        // 자식이 오토박스 보이는 부분의 맨 아래에 있지 않으면
        const autoBoxTop = autoBox.value?.getBoundingClientRect().top;
        const selectedElTop =
          autoBox.value?.children[panelSelected.value].getBoundingClientRect()
            .top;
        if (autoBoxTop !== undefined && selectedElTop !== undefined)
          if (
            autoBoxTop + autoBoxMaxHeight - selectedEl.clientHeight <
            selectedElTop
          ) {
            autoBox.value?.scrollTo({
              top:
                selectedEl.offsetTop +
                selectedEl.clientHeight -
                autoBoxMaxHeight,
              left: 0,
            });
          }
        return false;
      }
      // 화살표 위면 리스트에서 위로 이동
      else if (e.key == "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        if (panelSelected.value > 0) panelSelected.value--;
        // 패널에서 선택된 엘리먼트가 보이도록 만듬
        const selectedEl: HTMLElement = autoBox.value?.children[
          panelSelected.value
        ] as HTMLElement;
        const autoBoxTop = autoBox.value?.getBoundingClientRect().top;
        const selectedElTop =
          autoBox.value?.children[panelSelected.value].getBoundingClientRect()
            .top;
        // 현재 선택된 자식이 오토박스 보이는 부분의 맨 위 자식보다 아래에 있으면
        if (autoBoxTop !== undefined && selectedElTop !== undefined)
          if (autoBoxTop > selectedElTop) {
            autoBox.value?.scrollTo({
              top: selectedEl.offsetTop,
              left: 0,
            });
          }
        return false;
      }
      // ESC, 화살표 좌우, 탭이면 빠져나가기
      else if (
        e.key == "Escape" ||
        e.key == "ArrowLeft" ||
        e.key == "ArrowRight"
      ) {
        isPanelOn.value = false;
      }
    }
    // 패널이 떠 있지 않은 경우(일반적인 타이핑) 이벤트 핸들링
    else {
      // ctrl + S 로 저장
      if (e.code == "KeyS" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        e.stopPropagation();
        // console.log("저장이다");
        // 저장액션 수행
        return false;
      }

      // tab 키 눌렀을 때 간격 추가
      if (e.key == "Tab") {
        editorSelection = tinymce.activeEditor.selection;
        editorRange = editorSelection.getRng();

        // 표 안에서 tab이 눌러졌을 때에는 그냥 원래 동작하도록 함
        if (
          editorRange.endContainer.parentElement?.nodeName === "TD" ||
          editorRange.endContainer.parentElement?.parentElement?.nodeName ===
            "TD"
        )
          return;

        e.preventDefault();
        e.stopPropagation();
        // console.log("Tab이다");
        // 인라인 에디터에서는 Tab으로 8칸 스페이스 넣는거 동작 안시킴
        if (!props.inline)
          tinymce.activeEditor.insertContent(
            "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          );
        return false;
      }

      // enter 처리
      if (e.key == "Enter") {
        editorSelection = tinymce.activeEditor.selection;
        editorRange = editorSelection.getRng();

        /*****************
         * 자동완성 태그 바로 앞에서 엔터쳤을 때 줄이 바뀜과 동시에 포커스 날라가는 것 잡기
         *****************/
        // nextElementSibling이 존재 & 자동완성 태그(autocomplete)일 때만 문제가 됨
        if (
          Util.checkValidity(
            (editorRange.endContainer as Element).nextElementSibling
          )
        ) {
          if (
            (editorRange.endContainer as Element).nextElementSibling
              ?.classList[0] == "autocomplete"
          ) {
            // <p> 태그의 맨 처음에 자동완성 태그가 있는 경우 경우 그냥 빠져 나감(일반적인 엔터 동작)
            if (
              (editorRange.endContainer as Element).previousElementSibling ==
                null &&
              editorSelection.getNode().firstChild?.textContent?.trim()
                .length == 0
            ) {
              return;
            }

            // 자동완성 태그 앞에 일반 텍스트가 있는 경우(editorSelection.getNode().firstChild.textContent.trim().length > 0)
            if (
              (editorRange.endContainer as Element).previousElementSibling ==
                null &&
              editorSelection.getNode().firstChild?.textContent?.trim()
                ?.length > 0
            ) {
              if (editorRange.endContainer.previousSibling === null) {
                // 해당 text에서 커서의 위치 셋팅
                const currentOffset = editorRange.endOffset;
                // 커서가 맨 앞에 있는 경우에만 아래 실행
                if (currentOffset === 0) {
                  tinymce.activeEditor.insertContent("</p><p>");
                  tinymce.activeEditor.execCommand("ForwardDelete");
                  return;
                }
              }
            }

            /************* 아래처럼 했을 때, 동작 자체는 정상적으로 되나, ctrl+z를 눌렀을 때, 두 단계가 각각 되돌려 지기 때문에 보기 싫음.  */
            /************* focus 나 setCursorPosition 등으로 해결이 된다면 더 좋을 듯  */
            // 기본 엔터 이벤트 막고 강제로 </p><p> 삽입해서 줄바꿈 구현
            e.preventDefault();
            e.stopPropagation();
            tinymce.activeEditor.insertContent("</p><p>");
            // TinyMCE가 자동으로 삽입해주는 <p> 태그의 삭제를 위해 backspace 동작
            tinymce.activeEditor.execCommand("ForwardDelete");
          }
        }
      }
    }

    // FORMAT/USPTO인 경우에 문장의 첫글자 대문자 변경 처리. Enter, Space, 구두점(Period) 입력될 때 변경 처리 함.
    // shift키가 눌려있을 때에는 자동 변경 처리 안함 --> 사용자 매뉴얼에 들어가야 함
    if (
      appStore.lang == "EN" &&
      (e.key == "Enter" || e.code == "Space" || e.code == "Period") &&
      e.shiftKey == false
    ) {
      editorRange = tinymce.activeEditor.selection.getRng();

      let originalTxt = "";
      let replaceTxt = "";

      // 문단의 처음인지 체크
      isFirstWordInSentence = checkFirstWordInSentence(editorRange);

      if (isFirstWordInSentence) {
        // 구두점으로 나눠서 배열 생성
        let sentenceArray = editorRange.endContainer?.textContent
          ?.slice(0, editorRange.endOffset)
          .split(".");

        // 문단의 처음이거나 구두점 없는 경우
        if (sentenceArray?.length == 1) {
          let wordArray = sentenceArray[0].split(" ");
          originalTxt = wordArray[0].replace("\uFEFF", "");
        }
        // 구두점 앞에 다른 텍스트 있는 경우
        else if (sentenceArray && sentenceArray.length > 1) {
          let wordArray = sentenceArray[sentenceArray.length - 1].split(" ");
          originalTxt = wordArray[1].replace("\uFEFF", "");
        }

        replaceTxt = Util.makeFirstCharacterUpperCase(originalTxt);
      }

      if (replaceTxt != "") {
        editorRange.setStart(
          editorRange.endContainer,
          editorRange.endOffset - replaceTxt.length
        );
        editorRange.setEnd(editorRange.endContainer, editorRange.endOffset);
        editorRange.deleteContents();

        tinymce.activeEditor.insertContent(replaceTxt);
      }
    }
  });

  // Input 이벤트로 처리
  editor.on("input", function (e) {
    // console.log("Input Event", Util.getTimeStamp(), e);

    // 자동완성 패널이 떠야 하는지 체크한 후 패널 띄움
    checkAutocomplete(e);
    // 패널이 뜰 땐 항상 스크롤, 인덱스를 0으로 설정해야함
    autoBox.value?.scrollTo(0, 0);
    panelSelected.value = 0;

    // FORMAT/KIPO 케이스면 자동완성 태그 입력 후에 입력되는 조사 자동 변경시켜 줌
    if (appStore.lang == "KO") {
      autoChangeJosa();
    }
  });

  /*
  //********** 매우 중요 **************
  //**** FORMAT/JPO일 때, 일어의 변환 기능을 이용하고자 할 때에는 키보드 이벤트가 필요하므로 아래와 같이 명세서 양식에 따라 타는 이벤트를 나눠놔야 함
  //**** 2022.03.08. 현 시점에서 굳이 변환 기능을 이용하지 않고도 일어 자동완성이 잘 되므로, 모두 input 이벤트에 걸리게 해 둠

  if (workspaceStore.caseMasterData.format_code_path == "FORMAT/JPO") {
    editor.on("keyup", function (e) {
      checkAutocomplete(e);
    });
  }
  else
  {
    editor.on("input", function (e) {
      checkAutocomplete(e);
    });
  }
*/
};

// 엘리멘트의 show가 바뀔 때 panelSelected의 값을 0으로 변경함
watch(isPanelOn, () => {
  panelSelected.value = 0;
});

// 설명: 자동완성 패널이 떠야 하는지 체크한 후 패널 띄움
// Arguement: e -> input 이벤트
// Return: -
const checkAutocomplete = (e: InputEvent) => {
  // console.log(e);

  // 자동완성 패널이 닫힌 상태에서 backspace나 delete 칠 때(e.data가 null), 자동완성 기능이 동작하지 않도록 막음
  // 자동완성 패널이 떠 있는 상태에서는 backspace 쳐도 동작함
  // e가 inputEvent 일 때만 유효함. keyup 이벤트일 때는 다른 식으로 구현해야 함
  if (!e.data && isPanelOn.value == false) {
    // console.log("input 이벤트의 데이터가 null이다");
    return;
  }

  //********** 매우 중요 **************
  //**** FORMAT/JPO일 때, 일어의 변환 기능을 이용하고자 할 때에는 아래와 같이 키 값을 체크해서 핸들링 해야 함
  //**** 2022.03.08. 현 시점에서 굳이 변환 기능을 이용하지 않고도 일어 자동완성이 잘 되므로, 모두 input 이벤트에 걸리게 해 둠
  // FORMAT/JPO용 에디터인데, 변환하는 이벤트가 아니면 자동완성 안하고 바로 빠져나감
  // if (workspaceStore.caseMasterData.format_code_path == "FORMAT/JPO" && !(e.key == "Process" && (e.code == "Enter" || e.code == "NumpadEnter")))
  // return;

  // 초기화
  editorKeyword = "";
  candidateElementList = [];
  let tempEditorKeyword = "";

  // 키워드 추출
  editorKeyword = extractSearchKeyword();
  tempEditorKeyword = editorKeyword as string;
  // 에디터에서 &nbsp;가 공백으로 따라올라오는 경우가 있어서 왼쪽 트림해줌
  editorKeyword = editorKeyword?.trimStart();
  // console.log("keyword", "|" + editorKeyword + "|", editorKeyword?.length);

  // 키워드 추출용 텍스트가 있으면, 자동완성 리스트 생성. 없으면 그냥 빠져나감
  if (editorKeyword != "")
    candidateElementList = generateCandidateElementList(editorKeyword) as Array<
      string | ElementData[]
    >;
  else {
    isPanelOn.value = false;
    return;
  }
  // console.log("자동완성 키워드", candidateElementList[0]);
  // console.log("자동완성 배열", candidateElementList[1]);

  // 자동완성 리스트로 추출된 개수가 1개 이상인 경우에는 자동완성 패널 띄우는 과정 진행
  if (candidateElementList.length > 0 && candidateElementList[1].length > 0) {
    // 치환시킬 자동완성 키워드 설정(FORMAT/KIPO, FORMAT/USPTO인 경우에는 위의 keyword와 동일하고 FORMAT/JPO인 경우에는 다를 수 있음<-띄어쓰기가 없으므로)
    editorKeyword = candidateElementList[0] as string;
    // JPO인 경우에는 반각으로 전각을 자동완성시키는 경우도 있어서 원문의 텍스트로 다시 가공해줌
    if (workspaceStore.caseMasterData.format_code_path === "FORMAT/JPO") {
      editorKeyword = tempEditorKeyword.slice(0 - editorKeyword.length);
    }
    // 패널용 리스트에 할당
    popupList.value = candidateElementList[1] as ElementData[];

    // USTPO이 경우에는 패널 열기 전에 현재 자동완성시키는 위치가 문장의 처음인지 확인해서 셋팅해줌 (자동완성 태그 집어 넣을 때 체크하면 selection이 잘못 잡히는 경우가 있음)
    // isFirstWordInSentence는 자동완성 태그 집어넣을 때 활용함
    if (appStore.lang == "EN") {
      isFirstWordInSentence = checkFirstWordInSentence(
        tinymce.activeEditor.selection.getRng()
      );
    }

    // 패널이 새로 뜰 때에는 항상 인덱스를 0으로
    panelSelected.value = 0;

    // 패널 열기
    isPanelOn.value = true;

    /*************** 여기에서 자동완성 패널 팝업 위치 잡는 함수 실행되어야 함     */
    try {
      // 1. 에디터 가져오기
      // 2. 핸들링
      // 에디터 Range 커서 위치 가져옴

      const rects = editorRange?.getClientRects();

      // 높이 계산 하기 위해서 tinymce 헤더 가져옴
      let tinymceHeader =
        tinymce.activeEditor.editorContainer.getElementsByClassName(
          "tox-editor-header"
        )[0];

      let tinymceHeaderHeight = tinymceHeader.clientHeight;

      let editorX = editor.value?.getBoundingClientRect().left as number;
      let editorY = editor.value?.getBoundingClientRect().top as number;

      // 현재 에디터 커서의 위치

      // if(rectsItem !== null && rectsItem !== undefined){
      let _left = 0;
      let _top = 0;
      if (rects?.item(0) !== null && rects?.item(0) !== undefined) {
        // 인라인 에디터가 아닐 때
        _left = rects?.item(0)?.x as number;
        _top =
          (rects?.item(0)?.y as number) +
          tinymceHeaderHeight +
          parseInt(fontSize.substring(0, 2)) +
          10;
        // 인라인일 때 값 조정
        if (props.inline) {
          _left -= editorX - 5;
          _top -= editorY + 45;
        }
      }

      // 윈도우 너비, 높이
      let windowWidth = window.innerWidth;
      let windowHeight = window.innerHeight;

      // 자동완성 패널 너비, 높이

      let autoBoxWidth = 240;
      // console.log(autoBox.value?.children?.length);

      // clientHeight 값이 안나옴 -> 랜더링 되고나서 리스트가 바뀌는 것 같음
      // let autoBoxHeight = autoBox.value?.clientHeight;

      let elLength = candidateElementList[1].length;
      let autoBoxHeight = elLength
        ? elLength * 28 + 16 > autoBoxMaxHeight
          ? autoBoxMaxHeight
          : elLength * 28 + 16
        : 0;

      // 너비 = width, 높이 = height
      // 예외값 처리
      // 커서 + 패널 높이가 페이지 높이보다 클 때

      if (windowHeight !== undefined && windowWidth !== undefined) {
        // 우측, 바닥 패딩 보정값
        let currectionPx = 10;
        // 오토박스가 윈도우 너비 넘는 조건
        let _isAutoBoxOverflowEditorWidth =
          windowWidth < _left + autoBoxWidth + editorX + currectionPx;
        // 오토박스가 윈도우 높이 넘는 조건
        let _isAutoBoxOverflowHeight =
          windowHeight < _top + autoBoxHeight + editorY + currectionPx;
        const _handleAutoBoxWidth = () => {
          // 오토박스가 윈도우 바닥을 넘어가면
          if (_isAutoBoxOverflowEditorWidth) {
            // 오토박스가 윈도우 우측을 넘어가면
            autoBoxLeft.value = _left - autoBoxWidth;
          } else {
            // 안넘어가면
            autoBoxLeft.value = _left;
          }
        };
        if (_isAutoBoxOverflowHeight) {
          autoBoxTop.value =
            _top -
            autoBoxHeight +
            (parseInt(fontSize.substring(0, 2))
              ? parseInt(fontSize.substring(0, 2)) - 15
              : 0) -
            parseInt(fontSize.substring(0, 2)) -
            10;
          _handleAutoBoxWidth();
          // 오토박스가 윈도우 바닥보다 위에있으면
        } else {
          autoBoxTop.value =
            _top +
            (parseInt(fontSize.substring(0, 2))
              ? parseInt(fontSize.substring(0, 2)) - 15
              : 0);
          _handleAutoBoxWidth();
        }
      }

      // left.value = rects.item(0).x;
      // top.value = tinyHeaderHeight.value + rects.item(0).y;
    } catch (e) {
      // console.log(e);
    }
  }
  // 자동완성 리스트로 추출된 것이 없으면 패널 닫기
  else {
    isPanelOn.value = false;
  }

  return;
};

// 설명: 키워드 추출하는 함수
// Arguement: -
// Return: 추출된 키워드 String
const extractSearchKeyword = () => {
  // 현재 활성화되어 있는 에디터에서 selection 및 range 가져옴
  editorSelection = tinymce.activeEditor.selection;
  editorRange = editorSelection.getRng();

  // range가 존재하지 않으면 빈 값("") 리턴
  if (editorRange) {
    // 커서가 있는 node의 text를 가져옴
    const textContent = editorRange.endContainer.textContent;
    // 해당 text에서 커서의 위치 셋팅
    const currentOffset = editorRange.endOffset;

    //한글, 영어 등 " "로 구분이 되는 경우에는 마지막 단어를 키워드로 리턴함
    //일어 등 띄어쓰기가 없으면 통으로 다 keyword로 리턴됨
    let textArray = textContent?.slice(0, currentOffset).split(" ") as string[];

    if (textArray.length > 0) return textArray[textArray.length - 1];
  } else return "";
};

// 설명: 대응되는 구성요소 리스트 추출
// Arguement: keyword -> 추출된 키워드
// Return: [사용된 키워드, 키워드를 포함하는 구성요소가 있는 항목 리스트]
const generateCandidateElementList = (keyword: string | undefined) => {
  let searchResultList: ElementData[] = [];

  // FORMAT/KIPO, FORMAT/USPTO 등에서는 전달받은 keyword를 바로 사용
  // console.log(workspaceStore.caseMasterData.format_code_path);
  if (appStore.lang == "KO" || appStore.lang == "EN") {
    // 구성요소 리스트 돌면서, 각 아이템의 명칭 및 번호랑 keyword랑 비교해서, 포함되어 있으면 결과에 포함
    // console.log(workspaceStore.caseData.elements.list);
    props.elementList?.forEach((item: ElementData) => {
      if (
        item.name.includes(keyword as string) ||
        item.number.includes(keyword as string)
      ) {
        // 패널에 뿌려질 자동완성 텍스트
        const tempAutocompleteText = Util.makeAutocompleteTxt(
          item,
          format_code_path,
          autocompleteType,
          false // keyDownEvent.isShift 가 쓰여야 할수도 있음
        );

        // 자동완성 패널에 3줄 이상 뜨는 경우에는 ... 처리함.
        // 언어/자동완성 패널 크기에 따라 다르게 설정되어야 함
        if (Util.isKIPO(stores))
          item.autocompleteText = Util.cutString(tempAutocompleteText, 120);
        else item.autocompleteText = Util.cutString(tempAutocompleteText, 90);

        searchResultList.push(item);
      }
    });
  }
  // FORMAT/JPO인 경우 keyword를 추출함. 나중에 CNIPA(중국) 추가되면 FORMAT/JPO처럼 분기 태워야할 수 있음.
  else if (appStore.lang == "JA") {
    // 키워드를 한글자씩 쪼개서 배열에 넣음
    let keywordArray = keyword?.split("");
    // 한글자씩 더해가면서 검색할 임시 키워드
    let tempKeyword = "";
    // 뒤에서부터 한글자씩 더해가면서, 구성요소 리스트에 존재하는지 찾음
    for (let i = (keywordArray as string[]).length - 1; i >= 0; i--) {
      // 임시 키워드
      tempKeyword = (keywordArray as string[])[i] + tempKeyword;
      // 임시 결과 배열
      const tempList: ElementData[] = [];
      // 구성요소 리스트 돌면서, 각 아이템의 명칭 및 번호랑 임시 키워드랑 비교해서, 포함되어 있으면 임시 결과에 포함
      props.elementList?.forEach((item) => {
        // 반각 숫자를 전각으로도 바꾸거나, 전각을 반각으로 바꾸거나, 히라가나를 카타카나로 바꿔서도  더 검색
        if (
          item.name.includes(tempKeyword) ||
          item.number.includes(tempKeyword) ||
          item.name.includes(Util.toJPFullWidth(tempKeyword)) ||
          item.number.includes(Util.toJPFullWidth(tempKeyword)) ||
          item.name.includes(Util.toJPHalfWidth(tempKeyword)) ||
          item.number.includes(Util.toJPHalfWidth(tempKeyword)) ||
          item.name.includes(hira2kata(tempKeyword)) ||
          item.number.includes(hira2kata(tempKeyword))
        ) {
          // 패널에 뿌려질 자동완성 텍스트
          const tempAutocompleteText = Util.makeAutocompleteTxt(
            item,
            format_code_path,
            autocompleteType,
            false // keyDownEvent.isShift 가 쓰여야 할수도 있음
          );

          // 자동완성 패널에 3줄 이상 뜨는 경우에는 ... 처리함.
          // 언어/자동완성 패널 크기에 따라 다르게 설정되어야 함
          item.autocompleteText = Util.cutString(tempAutocompleteText, 130);

          tempList.push(item);
        }
      });
      // console.log("tempKeyword", tempKeyword, "검색결과", tempList.length);

      // 임시 키워드의 검색값이 0이면 임시 키워드가 포함된 구성요소가 없다는 것이므로 끝냄
      if (tempList.length == 0) break;
      else {
        // 임시 키워드의 검색값이 0이 아니면 구성요소 리스트에 있다는 것이므로, 결과 리스트를 셋팅해 줌
        keyword = tempKeyword;
        searchResultList = tempList;
      }
    }
  }

  // 도면부호 있는 구성요소와 없는 구성요소로 나눔
  const tempList1 = searchResultList.filter(
    (element) => Util.removePTag(element.number).trim().length > 0
  );
  const tempList2 = searchResultList.filter(
    (element) => Util.removePTag(element.number).trim().length === 0
  );

  // 도면부호 있는 구성요소는 도면부호 기준으로 리스트 정렬해 줌
  tempList1.sort(function (a, b) {
    let x = a.number.toLowerCase();
    let y = b.number.toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });

  // 도면부호 없는거랑 있는거 합쳐 줌
  const returnResult = tempList1.concat(tempList2);

  return [keyword, returnResult];

  // // 도면부호 기준으로 리스트 정렬해 줌
  // searchResultList.sort(function (a, b) {
  //   let x = a.number.toLowerCase();
  //   let y = b.number.toLowerCase();
  //   if (x < y) {
  //     return -1;
  //   }
  //   if (x > y) {
  //     return 1;
  //   }
  //   return 0;
  // });

  // return [keyword, searchResultList];
};

// 설명: 자동완성 텍스트로 치환하기
// Arguement: item -> 선택된 구성요소
// Return: 키워드를 포함하는 구성요소가 있는 항목 리스트
const changeToAutocompleteText = (item: ElementData) => {
  // 자동완성 패널 닫기
  isPanelOn.value = false;

  // Util.logger("자동완성 태그 입력 시작");

  // 자동완성 태그에 사용할 tagID. 고유해야 하므로 랜덤값을 추가해줌
  const tagID =
    item.elementId +
    "-" +
    Util.getTimeStamp() +
    "-" +
    Math.random().toString(36).substr(2, 11);

  // 선행사 에러 체크 실시
  let antecedentError = checkAntecedentError(item, tagID);

  console.log(antecedentError);

  console.log(item, antecedentError);

  // 로직 2: 키워드의 길이만큼 Dele4te해 줌 -> 에디터 내에서의 동작은 로직 1과 동일하나 속도가 느림 -> 로직 1로 사용
  // for (let i = 0; i < editorKeyword.length; i++) {
  //   tinymce.activeEditor.execCommand("Delete");
  // }

  // 자동완성 태그 삽입 --> 아래의 두 방식(execCommand랑 insertContent) 중에 아주 미세하게 insertContent 쪽이 빠른 것 같음. -> 일단 insertContent 사용
  // tinymce.activeEditor.execCommand(
  //   "mceInsertContent",
  //   false,
  //   EditorHandler.autocompleteTag(item, workspaceStore.caseMasterData.format_code_path, autocompleteType, tagID, item.elementId, autocompleteHighlight)
  // );
  // if (!antecedentError)
  //   tinymce.activeEditor.insertContent("<span style=\"background:blue\">" + editorAntecedent + "</span>&nbsp;");

  // console.log(EditorHandler.autocompleteTag(item, workspaceStore.caseMasterData.format_code_path, autocompleteType, tagID, item.elementId, autocompleteHighlight, keyDownEvent));

  // 자동완성할 항목이 구성요소임
  if (item.itemType == "E") {
    tinymce.activeEditor.insertContent(
      Util.makeAutocompleteTag(
        item,
        format_code_path,
        autocompleteType,
        tagID,
        keyDownEvent?.shiftKey as boolean,
        isFirstWordInSentence
      )
    );

    // 방금 삽입한 자동완성 태그
    let targetElement = tinymce.activeEditor
      .getDoc()
      .getElementById(tagID) as Element;

    // 로직 1: 방금 삽입한 자동완성 태그의 앞쪽 노드가 존재하면 계속 수행 -> 위의 로직 2보다 속도가 빠름.
    while (targetElement.previousSibling) {
      // 삽입된 태그의 앞 Node
      let prevNode = targetElement.previousSibling;

      // 공백문자 (&#XFEFF 문자)가 있으면 잘못된 노드이므로 패스
      if (prevNode.textContent?.includes("\uFEFF")) {
        continue;
      }
      // 삽입된 태그의 앞 Node에 자동완성 키워드가 존재하는 경우
      else if (prevNode.textContent?.includes(editorKeyword as string)) {
        // 선행사 에러가 있는 경우
        if (!antecedentError) {
          // FORMAT/USPTO(영어)인 경우,  the 에서 T가 대문자가 되는 경우가 있어서, 원래 있는 텍스트를 그대로 셋팅해줌
          if (appStore.lang == "EN") {
            let tempArray = prevNode.textContent.split(" ");
            editorAntecedent = tempArray[tempArray.length - 2];
          }

          // 선행사 element 생성
          const sangi = document.createElement("span");
          // sangi.className = "autocomplete";
          sangi.className = "antecedent";
          sangi.textContent = editorAntecedent;
          sangi.contentEditable = "false";

          // 선행사 element 삽입
          targetElement.previousSibling.parentNode?.insertBefore(
            sangi,
            targetElement
          );

          // FORMAT/JPO가 아닌 경우에는 선행사 다음에 띄어쓰기가 있으므로, 띄어쓰기 삽입하고, 키워드에 선행사를 합쳐줌(선행사와 키워드를 함께 삭제하기 위함)
          if (appStore.lang != "JA") {
            const space = document.createTextNode(" ");
            targetElement.previousSibling.parentNode?.insertBefore(
              space,
              targetElement
            );
            editorKeyword = editorAntecedent + " " + editorKeyword;
          } else {
            // FORMAT/JPO인 경우에는 선행사와 키워드를 그대로 합침
            editorKeyword = editorAntecedent + editorKeyword;
          }
        }

        // 방금 삽입한 자동완성 태그의 앞쪽 노드의 텍스트에서 자동완성 키워드(또는 선행사가 결합된 것)를 찾아서 삭제한 후 치환시킴
        const prevTextContent = prevNode.textContent;
        prevNode.textContent = prevTextContent.substr(
          0,
          prevTextContent.length - (editorKeyword as string).length
        );
        targetElement = targetElement.previousElementSibling as Element;
        break;
      }
      // 키워드랑 일치하는 것 없음
      else {
        continue;
      }
    }
  }
  // 자동완성할 항목이 관용어구임
  else {
    for (let i = 0; i < (editorKeyword as string).length; i++) {
      tinymce.activeEditor.execCommand("Delete");
    }
    tinymce.activeEditor.insertContent(item.name);
  }

  // Util.logger("자동완성 태그 입력 끝");
};

// 설명: 선행사 에러 있는지 여부 체크하기
// Arguement: item -> 체크 대상 구성요소, tagID -> 태그 생성용 ID
// Return: true -> 문제 없음. false -> 선행사 에러 있음
const checkAntecedentError = (item: ElementData, tagID: string) => {
  editorSelection = tinymce.activeEditor.selection;
  editorRange = editorSelection.getRng();

  let textContent = editorRange.endContainer.textContent;
  let currentOffset = editorRange.endOffset;

  // 현재의 range에서 커서 위치의 앞에 있는 text만 추출
  textContent = textContent.substr(0, editorRange.endOffset);

  // 치환할 키워드로 잘라줌
  let textArray = textContent
    .slice(0, currentOffset)
    .split(editorKeyword as string);

  // 자동완성 키워드 앞의 text (영어인 경우에는 소문자화)
  let checkTarget = textArray[textArray.length - 2].trim().toLowerCase();
  // 자동완성 키워드 전의 텍스트의 길이가 선행사의 길이보다 길고, 마지막 단어가 체크용 선행사인 경우 체크 진행 (영어인 경우에는 소문자화해서 비교)
  if (
    checkTarget.length >= editorAntecedent.length &&
    checkTarget.slice(0 - editorAntecedent.length) ==
      editorAntecedent.toLowerCase()
  ) {
    // 현재 위치 앞의 html source를 가져오기 위해 임시 태그 삽입
    tinymce.activeEditor.insertContent('<span id="' + tagID + '"></span>');
    let targetElement = tinymce.activeEditor.getDoc().getElementById(tagID);
    let contentHtml = tinymce.activeEditor.getContent();
    // 임시 태그 앞의 html 추출
    let prevContentHtml = contentHtml.slice(0, contentHtml.lastIndexOf(tagID));
    // 임시 태그 제거
    targetElement?.remove();

    /************** 위쪽의 로직에서 insert하고 remove하는데 에디터 내의 콘텐츠 양이 많으면 텍스트 양이 많으면 시간이 조금 걸림 */
    /************** 콘텐츠의 양이 10만자가 넘어 갔을 때 1/30프레임 이상으로 시간이 걸리기도 해서 고민이 조금 필요함 */

    console.log(prevContentHtml);

    // 정규식으로 텍스트 포함 여부를 찾는 것이 더 빠르다고 함 --> 20만자 수준에서는 의미있는 차이가 있는 것 같지는 않음
    // 구성요소 명칭과 elementId를 정규식 변수로 생성
    const regexName = new RegExp(item.name.toLowerCase());
    const regexID = new RegExp(item.elementId.toLowerCase());

    // 대소문자가 다른 경우 비교를 위해, 모두 소문자로 전환한 다음에 체크 -> 시간에 영향 거의 없음
    // 영어일 때, 단복수 차이가 있을 수 있으므로, id로 체크 -> 이걸로도 못잡는 건 포기 (로직을 더 추가할 수는 있음. 예: 단복수 변환해서 체크)
    if (
      regexName.test(prevContentHtml.toLowerCase()) ||
      regexID.test(prevContentHtml.toLowerCase())
    ) {
      // console.log("앞에서 사용됨 -> 정상 선행사");
      return true;
    } else {
      // console.log("앞에서 사용되지 않음 -> 선행사 오류");
      return false;
    }
  } else {
    // 선행사가 안쓰였으므로 문제 없음
    return true;
  }
};

// 설명: 부모 청구항의 텍스트에서 구성요소 사용되었는지 체크하기
// Arguement: claimList-> 클레임 리스트, currentClaimNumber-> 작업중인 청구항 번호, editingParentArray->현재 설정된 부모 청구항 배열, item -> 체크 대상 구성요소,
// Return: true -> 문제 없음. false -> 선행사 에러 있음
const checkElementInParentClaims = (
  claimList: ClaimData[],
  currentClaimNumber: number,
  editingParentArray: number[],
  item: ElementData
) => {
  // 정규식으로 텍스트 포함 여부를 찾는 것이 더 빠르다고 함 --> 20만자 수준에서는 의미있는 차이가 있는 것 같지는 않음
  // 구성요소 명칭과 elementId를 정규식 변수로 생성
  const regexName = new RegExp(item.name.toLowerCase());
  const regexID = new RegExp(item.elementId.toLowerCase());

  // 선행사 체크를 위한 택스트 조합
  let claimContentText = "";
  let parentClaimSet = ClaimHandler.getParentClaimSet(
    claimList,
    currentClaimNumber,
    editingParentArray
  );

  // console.log(parentClaimSet);

  // 각각의 부모 청구항 조합에 대해 체크함
  for (let i = 0; i < parentClaimSet.length; i++) {
    claimContentText = "";
    // 부모 청구항 조합에 따라 청구항 내용 집합체 생성
    parentClaimSet[i].forEach((claimNumber: number) => {
      claimContentText =
        claimContentText +
        claimList[claimNumber - 1].body +
        "|" +
        claimList[claimNumber - 1].category +
        "|";
    });

    // console.log(claimContentText, regexName);

    // console.log(regexName.test(claimContentText.toLowerCase()));
    // console.log(regexID.test(claimContentText.toLowerCase()));

    let checkResult = false;

    // 대소문자가 다른 경우 비교를 위해, 모두 소문자로 전환한 다음에 체크 -> 시간에 영향 거의 없음
    // 영어일 때, 단복수 차이가 있을 수 있으므로, id로 체크 -> 이걸로도 못잡는 건 포기 (로직을 더 추가할 수는 있음. 예: 단복수 변환해서 체크)
    if (
      regexName.test(claimContentText.toLowerCase()) ||
      regexID.test(claimContentText.toLowerCase())
    ) {
      // console.log("앞에서 사용됨 -> 정상 선행사");
      checkResult = true;
    } else {
      // console.log("앞에서 사용되지 않음 -> 선행사 오류");
      checkResult = false;
    }

    // false 결과가 나오면 더 볼것도 없이 바로 false 리턴
    if (checkResult == false) return false;
  }

  return true;
};

// 설명:            문장의 처음인지 판단
// Arguement:       range -> range 객체
// Return:          true -> 문장의 처음이다. false -> 문장의 처음이 아니다.
const checkFirstWordInSentence = (range: Range) => {
  // 구두점으로 나눠서 배열 생성
  let sentenceArray = range.endContainer.textContent
    ?.slice(0, range.endOffset)
    .split(".");

  // 문단의 처음이거나 구두점 없는 경우
  if (sentenceArray?.length == 1) {
    let wordArray = sentenceArray[0].split(" ");
    if (wordArray.length == 1) {
      // 구성요소 자동완성 또는 선행사 자동완성(="autocomplete") 바로 뒤면 문장의 처음으로 취급 안함
      if (
        !(
          (range.endContainer as Element).previousElementSibling != null &&
          (range.endContainer as Element).previousElementSibling
            ?.classList[0] == "autocomplete"
        )
      ) {
        return true;
      }
    }
  }
  // 구두점 앞에 다른 텍스트 있는 경우
  else if (sentenceArray && sentenceArray.length > 1) {
    let wordArray = sentenceArray[sentenceArray.length - 1].split(" ");
    // 구두점 다음에 스페이스 & 첫단어가 있는 경우에는 배열 길이가 2임
    if (wordArray.length == 2) {
      // 구두점 뒤에 스페이스 2개까지는 trim으로 ""으로 바꿀 수 있음. 3개부터는 &nbsp;가 개입되는 듯. 스페이스 3개 이상 넣는 건 대응 포기
      if (wordArray[0].trim() == "") {
        return true;
      }
    }
  }

  return false;
};

// 설명:            authChangeJosa
// Arguement:       -
// Return:          true -> 문장의 처음이다. false -> 문장의 처음이 아니다.
const autoChangeJosa = () => {
  /****************************************************************************************/
  /*********************** 맥북에서 입력하는 경우에 대한 테스트 필요하다!!! ******************/
  /****************************************************************************************/

  // Util.logger("조사 체크 시작");

  // console.log(e);
  editorSelection = tinymce.activeEditor.selection;
  editorRange = editorSelection.getRng();

  let textContent = "";

  // range가 존재하지 않으면 끝냄
  if (editorRange) {
    // 커서가 있는 node의 text를 가져옴
    textContent = editorRange.endContainer.textContent as string;
    textContent = textContent.substr(0, editorRange.endOffset);
  } else return;

  // 조사 체크 할지 판단하는 기준. 마지막 글자가 , : ; 스페이스인 경우 -> 공백이 &nbsp;와 그냥 ' '이 다르게 인식되는 듯
  const triggers = ",:;  ";
  if (textContent) {
    // 앞에 자동완성 태그가 있고, 가장 긴 조사(4글자)가 쓰였을 때보다 작고, 마지막 글자가 triggers 안에 포함되어 있으면 조사 체크 진행
    // 자동완성 태그 바로 뒤에 공백문자(&#XFEFF 문자)가 생성되었다 사라지므로, 이를 고려하여 조사 체크하는 최대값을 6으로 잡음(공백1자 + 조사4자 + 스페이스 등 1자)
    // Util.logger(textContent);
    if (
      Util.checkValidity(
        (editorRange.endContainer as Element).previousElementSibling
      ) &&
      Util.checkValidity(
        (editorRange.endContainer as Element).previousElementSibling?.classList
      )
    ) {
      // 조사 체크의
      const trigger = textContent.substr(-1);
      if (
        (editorRange.endContainer as Element).previousElementSibling
          ?.classList[0] == "autocomplete" &&
        textContent.length < 7 &&
        triggers.includes(trigger)
      ) {
        let checkTarget = textContent.replace("\uFEFF", "");
        checkTarget = checkTarget.substr(0, checkTarget.length - 1);

        // 조사 변경 대상인 조사인지 체크
        // ipedit_util에서 jongJosa + notJongJosa
        const josaAll = [
          "은",
          "는",
          "을",
          "를",
          "이",
          "가",
          "과",
          "와",
          "으로",
          "로",
          "으로서",
          "로서",
          "으로써",
          "로써",
          "으로부터",
          "로부터",
          "으로는",
          "로는",
        ];

        // 조사가 체크 대상에 포함되는 경우에만 조사 자동 변경 수행
        if (josaAll.includes(checkTarget)) {
          // 구성요소의 명칭은 class에서 3번째 위치함. 구성요소 명칭에 맞는 조사 가져옴
          // console.log(editorRange.endContainer.previousElementSibling.getAttribute("data-name"));
          const checkResult = Util.setJosa(
            (
              editorRange.endContainer as Element
            ).previousElementSibling?.getAttribute("data-name") as string,
            checkTarget
          );
          // 지금 쓴 조사가 정상 조사랑 다르면 자동 변경 수행. 같으면 빠져 나감
          if (checkTarget != checkResult) {
            // 공백문자 제거 후, 잘못된 조사도 제거해서 셋팅 --> 신 로직으로 대체함
            // textContent = textContent.replace(checkTarget, "").replace("\uFEFF", "");
            // range.endContainer.textContent = textContent;

            // // 트리거 문자 없애는 백스페이스 동작 --> 신 로직으로 대체함
            // tinymce.activeEditor.execCommand(
            //   "ForwardDelete"
            // );

            // 신 로직(테스트 필요)
            editorRange.endContainer.textContent = textContent
              .replace("\uFEFF", "")
              .replace(trigger, "");
            for (let i = 0; i < checkTarget.length; i++) {
              tinymce.activeEditor.execCommand("ForwardDelete");
            }

            // 정상 조사와 트리거 문자 추가
            tinymce.activeEditor.insertContent(checkResult + trigger);
          } else return;
        } else {
          // Util.logger("조사체크 안함", checkTarget)
        }
      }
    }
  }

  // Util.logger("조사 체크 끝");
};

/**Tinymce 다크모드 구현부
 * Tinymce editor의 메뉴가 #app과 같은 범위에 있어 body에 클래스를 삽입함
 */
const editorNormalClass = "ipedit-draft-tinymce-oxide";
const editorDarkmodeClass = "ipedit-draft-tinymce-oxide-dark";

// isDarkmode 변수가 변할 때
themeStore.$subscribe((_, state) => {
  if (state.isDarkmode) {
    // 다크모드일 때 일반 클래스 삭제하고 다크모드 클래스 넣음
    document.body.classList.remove(editorNormalClass);
    document.body.classList.add(editorDarkmodeClass);
    tinymce.editors.forEach((activeEditor) => {
      const tinymceActive = activeEditor.getBody();
      tinymceActive.classList.add("inner-dark");
    });
  } else {
    // 다크모드가 아닐 때 다크모드 클래스 삭제하고 일반모드 넣음
    document.body.classList.remove(editorDarkmodeClass);
    document.body.classList.add(editorNormalClass);
    tinymce.editors.forEach((activeEditor) => {
      const tinymceActive = activeEditor.getBody();
      tinymceActive.classList.remove("inner-dark");
    });
  }
});

onMounted(() => {
  // tinymce skin 다크모드 핸들링 클래스 넣음
  document.body.classList.add(editorNormalClass);
});

const { lang } = storeToRefs(appStore);

watch(lang, () => {
  setupInitialData(lang.value);
});

// 히라가나인지 체크
function is_hira(c) {
  return (c >= 12353 && c <= 12435) || c == 12445 || c == 12446;
}
// 히라가나 -> 카타카나
function hira2kata(src: string) {
  var str = new String();
  var len = src.length;
  for (var i = 0; i < len; i++) {
    var c = src.charCodeAt(i);
    if (is_hira(c)) {
      str += String.fromCharCode(c + 96);
    } else {
      str += src.charAt(i);
    }
  }
  return str;
}
</script>

<style lang="scss">
.editor {
  width: 100%;
  position: relative;
  .auto-box {
    overflow: hidden;
    overflow-y: overlay;
    z-index: 999999999999999999999;
    padding: 0 0;

    position: absolute;
    width: 15rem;
    max-height: 12.25rem;

    border-radius: 0.25rem;
    color: white;

    font-size: 0.875rem;
    white-space: nowrap;

    &-item {
      padding: 0.375rem 1rem;
      line-height: 1rem;

      cursor: pointer;
      background-color: var(--background-color);
      &:hover {
        background-color: var(--background-color-hover);
      }
    }
  }
}
</style>
