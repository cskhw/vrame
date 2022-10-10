<template>
  <div
    id="structure"
    ref="structure"
    class="structure d-flex flex-column"
    style="min-width: 17.5rem"
    :draggable="isComponentDrag"
    @dragstart="dragStart($event)"
    @dragend="dragEnd($event)"
    :style="{
      backgroundColor: themeStore.darkmodeBackgroundColor,
      border: themeStore.darkmodeBorder,
      height: $route.path.includes('wtab') ? '100%' : 'calc(100% - 0.5rem)',
    }"
  >
    <div class="structure-header d-flex justify-space-between ma-3">
      <div class="d-flex align-center">
        <IconBtn
          class="handle mr-2"
          :icon="mdiReorderVertical"
          color="#9E9E9E"
          @mouseenter="isComponentDrag = true"
          @mouseleave="isComponentDrag = false"
        />
        <div
          class="text-bold-15-black"
          :style="{ color: stores.ts.darkmodeColor }"
        >
          {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/STRUCTURE/TITLE") }}
        </div>
      </div>
      <div class="d-flex">
        <div class="d-flex">
          <IconBtn :icon="mdiClose" color="#9E9E9E" @click="closeArea" />
        </div>
      </div>
    </div>
    <Divider
      height="0.0625rem"
      :bdColor="stores.ts.isDarkmode ? '#414141' : '#DFDFDF'"
    />
    <div class="structure-content text-400-14-black pa-3" style="height: 100%">
      <!-- 구조창 -->
      <!-- 트리 노드 호버 배경 테마 코드 코드마스터에 넣으면 배경 넣기 -->
      <!-- '--color-hover-background': !themeStore.isDarkmode
            ? Util.getColor(stores, 'TINTED')
            : Util.getColor(stores, 'TINTED_DARK'), -->
      <tree
        :config="treeConfig"
        :nodes="treeNodes"
        @node-focus="(e) => onClickTree(e)"
        :style="{
          '--color': themeStore.darkmodeColor,
          '--background-color-hover': treeHoverColor,
        }"
      >
      </tree>
      <IComponentSpinner ref="structureSpinner" />
    </div>
    <Divider
      height="0.0625rem"
      :bdColor="stores.ts.isDarkmode ? '#414141' : '#DFDFDF'"
    />
    <!-- 구성요소 footer -->
    <div
      v-if="!isReadonlyWindow"
      class="structure-footer ml-3 d-flex justify-start align-center"
      style="overflow: hidden"
    >
      <div
        class="ml-2 text-400-12-gray"
        :style="{ color: stores.ts.isDarkmode ? '#BDBDBD' : '' }"
      >
        {{
          (Util.isKIPO(stores) &&
            (Util.isApplication(stores) || Util.isPCT(stores))) ||
          (Util.isJPO(stores) && Util.isApplication(stores))
            ? Util.getI18NTxt(stores, "I18N/WORKSPACE/STRUCTURE/GUIDE1")
            : Util.getI18NTxt(stores, "I18N/WORKSPACE/STRUCTURE/GUIDE2")
        }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as Util from "@/assets/javascripts/ipedit_util";
import IconBtn from "@/components/common/IconBtn.vue";
import Divider from "@/components/Divider.vue";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { mdiClose, mdiReorderVertical } from "@mdi/js";
import { computed, onMounted, ref, watch } from "vue";
import Tree from "vue3-treeview";
import "vue3-treeview/dist/style.css";
import tinymce from "tinymce/tinymce";
import type { INode } from "vue3-treeview/dist/structure/INode";
import type { IIComponentSpinner } from "@/types/component";
import IComponentSpinner from "@/components/IComponentSpinner.vue";

const treeHoverColor = computed(() =>
  themeStore.isDarkmode
    ? Util.getColor(stores, "TINTED_DARK")
    : Util.getColor(stores, "TINTED")
);

function onClickTree(e: INode) {
  // 에디터에서 p태그들을 가져온 후에 쿼리 텍스트 생성
  const editorDom = tinymce.get("detailed-description").contentDocument;
  const editorBody = editorDom.body;
  const ps = editorBody.querySelectorAll("p");

  let queryTxt = "";
  if (
    (Util.isKIPO(stores) &&
      (Util.isApplication(stores) || Util.isPCT(stores))) ||
    (Util.isJPO(stores) && Util.isApplication(stores))
  )
    queryTxt = "【" + e.text + "】";
  else queryTxt = e.text as string;

  console.log(queryTxt);

  // p태그들에서 클릭한 노드와 같은 텍스트를 가진 노드를 찾아서 스크롤해줌
  for (let i = 0; i < ps.length; i++) {
    if (ps[i].textContent?.trim() === queryTxt.trim()) {
      const target = ps[i];
      const editorHTML = editorDom.querySelector("html");
      const targetOffsetTop = (target as HTMLElement).offsetTop;
      editorHTML?.scrollTo({ top: targetOffsetTop, behavior: "smooth" });
    }
  }
}

const props = defineProps<{
  modelValue?: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = ref(props.modelValue);

const isMounted = ref(false);

// 스토어
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

// 레이아웃
const isComponentDrag = ref(false);
const structureSpinner = ref<IIComponentSpinner>();

const treeConfig = ref({
  roots: [],
  openedIcon: {
    type: "shape",
    stroke: "black",
    strokeWidth: 3,
    viewBox: "0 0 24 24",
    draw: "M 2 12 L 22 12",
  },
  closedIcon: {
    type: "shape",
    stroke: "black",
    strokeWidth: 3,
    viewBox: "0 0 24 24",
    draw: `M 12 2 L 12 22 M 2 12 L 22 12`,
  },
  keyboardNavigation: false,
  dragAndDrop: false,
  checkboxes: false,
  editable: false,
  disabled: false,
  padding: 25,
});

const treeNodes = ref({});

const treeShow = ref(false);

// readonly 모드인지 여부
const isReadonlyWindow = ref(false);
// readonly 모드로 동작해야 하는 경우 셋팅: 새창, trash, archive
if (
  workspaceStore.caseMasterData.case_status_code_path ===
    "DR_CASE_STATUS/S77" ||
  workspaceStore.caseMasterData.case_status_code_path === "DR_CASE_STATUS/S99"
) {
  //데이터 편집이 불가능하도록 isReadonlyWindow false 처리
  isReadonlyWindow.value = true;
}

function closeArea() {
  workspaceStore.controlAreaShow("structure");
  workspaceStore.initializeToolbar = true;
}

function dragStart(e: DragEvent) {
  // props에 watch 붙어 있는게 정상 작동 안해서 강제로 드래그 시작 시 false됨
  modelValue.value = false;
  workspaceStore.areaDragStart(e);
}

function dragEnd(e: DragEvent) {
  workspaceStore.areaDragEnd(e);
  modelValue.value = true;
}

function initialSetupStructureData() {
  // console.log("initialize structure area");
  // treeShow.value = false;

  treeConfig.value.roots = [];
  treeNodes.value = {};

  let tempTreeNodes = {};

  // KIPO 명세서, KIPO PCT, JPO 명세서인 경우
  if (
    (Util.isKIPO(stores) &&
      (Util.isApplication(stores) || Util.isPCT(stores))) ||
    (Util.isJPO(stores) && Util.isApplication(stores))
  ) {
    let descriptionText = JSON.stringify(
      workspaceStore.caseData.detailed_description.data
    );

    descriptionText = Util.removeNewLine(descriptionText);

    // console.log(descriptionText);

    let titleLeft = "【";
    let titleRight = "】";

    const depth1Title = [
      "발명의 설명",
      "명세서",
      "청구범위",
      "청구의 범위",
      "요약서",
      "도면",
      "明細書",
      "特許請求の範囲",
      "要約",
    ];
    const depth2Title = [
      "발명의 명칭",
      "発明の名称",
      "기술분야",
      "技術分野",
      "발명의 배경이 되는 기술",
      "배경기술",
      "背景技術",
      "선행기술문헌",
      "先行技術文献",
      "발명의 내용",
      "発明の概要",
      "발명의 상세한 설명",
      "도면의 간단한 설명",
      "図面の簡単な説明",
      "발명을 실시하기 위한 구체적인 내용",
      "発明を実施するための形態",
      "발명의 실시를 위한 형태",
      "산업상 이용가능성",
      "서열목록 프리텍스트",
      "부호의 설명",
      "符号の説明",
    ];
    const pArray = descriptionText.split("</p>");

    let idx = 0;
    let depth1ParentIdx = 0;
    let depth2ParentIdx = 0;

    for (let i = 0; i < pArray.length; i++) {
      let textContent = Util.removeAllTag(pArray[i]);
      if (i === 0) textContent = textContent.replace('"', "");
      textContent = textContent.trim();
      // console.log(textContent);
      if (
        textContent.length > 0 &&
        textContent[0] === titleLeft &&
        textContent[textContent.length - 1] === titleRight
      ) {
        textContent = textContent
          .replace(titleLeft, "")
          .replace(titleRight, "");

        // console.log("structure ---------------> ", textContent);

        // 1depth 제목들
        if (
          depth1Title.includes(textContent) ||
          (textContent[0] === "図" && textContent[1] !== "面")
        ) {
          tempTreeNodes["id" + idx] = {
            text: textContent,
            children: [],
            state: {
              opened: true,
            },
          };
          depth1ParentIdx = idx;
          treeConfig.value.roots.push("id" + idx);
        }
        // 2depth 정해진 제목들
        else if (depth2Title.includes(textContent)) {
          tempTreeNodes["id" + idx] = {
            text: textContent,
            children: [],
            state: {
              opened: true,
            },
          };

          tempTreeNodes["id" + depth1ParentIdx].children.push("id" + idx);
          depth2ParentIdx = idx;
        }
        // 2depth 안정해진 제목들 & 3depth 이하 제목들
        else {
          tempTreeNodes["id" + idx] = {
            text: textContent,
            children: [],
            state: {
              opened: true,
            },
          };
          // 3depth인 경우
          if (depth2ParentIdx > depth1ParentIdx) {
            tempTreeNodes["id" + depth2ParentIdx].children.push("id" + idx);
          } else {
            tempTreeNodes["id" + depth1ParentIdx].children.push("id" + idx);
          }
        }

        idx++;
      }
    }
  }
  // 나머지 케이스인 경우
  else {
    let descriptionText = JSON.parse(
      JSON.stringify(workspaceStore.caseData.detailed_description.data)
    );

    descriptionText = Util.removeNewLine(descriptionText);

    const pArray = descriptionText.split("</p>");

    for (let i = 0; i < pArray?.length; i++) {
      let textContent = pArray[i];
      if (i === 0) textContent = textContent.replace('"', "");
      const strongArray = textContent.match(
        /\<p.*\>\<strong\>.*\<\/strong\>$/gi
      );

      // console.log(strongArray);

      if (strongArray?.length > 0) {
        textContent = strongArray[0].trim();
        tempTreeNodes["id" + i] = {
          text: Util.replaceAll(Util.removeAllTag(textContent), "&nbsp;", " "),
          children: [],
          state: {
            opened: true,
          },
        };
        treeConfig.value.roots.push("id" + i);
      }
    }

    // TODO: 테이블 내의 데이터 처리

    // // 테이블 내용은 목차 구성에서 제외함
    // tempContents = tempContents.replace(/\<table.*\<\/table\>/gi, "");

    // const strongArray = tempContents.split("</strong>");

    // for (let i = 0; i < strongArray.length; i++) {
    //   console.log(strongArray[i].split("<strong>"));
    //   // const strongText = strongArray[i].substring(
    //   //   strongArray[i].indexOf("<strong>")
    //   // );

    //   // console.log(strongText);
    // }
  }

  // console.log(treeConfig);
  // console.log(tempTreeNodes);

  treeNodes.value = tempTreeNodes;

  // treeShow.value = true;
}

const initialSetupStructureDataSpinner = () =>
  structureSpinner.value?.setSpinner(
    initialSetupStructureData,
    "translucent"
  )();

watch(workspaceStore, () => {
  if (workspaceStore.initializeStructureArea) {
    // 데이터 초기화
    initialSetupStructureDataSpinner();

    workspaceStore.initializeStructureArea = false;
  }
});

onMounted(() => {
  console.log("structure mounted");

  if (!workspaceStore.initializeStructureArea) initialSetupStructureData();

  isMounted.value = true;
});

// props가 바뀔 때(부모에서 값이 바뀔 때)
watch(props, () => {
  modelValue.value = props.modelValue;
});

// modelValue가 바뀔 때(컴포넌트 내부에서 값이 바뀔 때)
watch(modelValue, () => {
  emit("update:modelValue", modelValue.value);
});
</script>

<style lang="scss" scoped>
@import "@/styles/draft/text";

::v-deep(.tox .tox-editor-header) {
  z-index: 0 !important;
}

.structure {
  position: relative;
  width: 100%;
  background-color: white;
  ::v-deep(.input-wrapper) {
    color: var(--color);
  }
  ::v-deep(.icon-wrapper svg path) {
    stroke: var(--color);
  }
  ::v-deep(.node-wrapper) {
    &:hover {
      background-color: var(--background-color-hover);
    }
  }
  .structure-header {
    height: 1.5rem;
  }

  .structure-content {
    height: 100%;
    overflow: overlay;
  }

  .structure-magition-options {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    position: absolute;
    top: 2.25rem;
    z-index: 2;
    box-shadow: 0rem 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
    border-radius: 0.25rem;
    width: 12.1875rem;
    height: 7.5rem;
    background-color: white;
    li {
      display: flex;
      align-content: center;
      justify-content: center;

      height: 2.25rem;

      text-align: center;
      line-height: 2.25rem;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
.structure-footer {
  // position: absolute;
  bottom: 0.3125rem;

  width: 95%;
  height: 2rem;
}
</style>
