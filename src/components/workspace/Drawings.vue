<template>
  <div
    class="drawings"
    :draggable="isComponentDrag"
    @dragstart="dragStart($event)"
    @dragend="dragEnd($event)"
    :style="{
      backgroundColor: stores.ts.darkmodeBackgroundColor,
      border: stores.ts.darkmodeBorder,
      height: $route.path.includes('wtab') ? '100%' : 'calc(100% - 0.5rem)',
    }"
  >
    <!-- 리드온리 헤더 -->
    <div
      v-if="isReadonlyWindow"
      class="d-flex align-center justify-center"
      style="height: 2.25rem; min-height: 2.25rem; max-height: 2.25rem"
      :style="{
        color: Util.getColor(stores, 'SECONDARY_TEXT'),
        backgroundColor: Util.getColor(stores, 'SECONDARY'),
        fontWeight: 'bold',
      }"
    >
      {{ Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/READONLY") }}
    </div>

    <!-- 도면 헤더 -->
    <div class="description-header d-flex justify-space-between ma-3">
      <div class="d-flex align-center">
        <!-- 드래그 핸들 -->
        <IconBtn
          v-if="!isReadonlyWindow"
          class="handle mr-2"
          :icon="mdiReorderVertical"
          color="#9E9E9E"
          @mouseenter="isComponentDrag = true"
          @mouseleave="isComponentDrag = false"
        />
        <IconBtn
          v-else
          class="mr-2"
          :icon="mdiReorderVertical"
          color="#9E9E9E"
        />
        <!-- 영역 타이틀 -->
        <div
          class="text-bold-15-black"
          :style="{ color: stores.ts.darkmodeColor }"
        >
          {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/DRAWINGS/TITLE") }}
        </div>
      </div>

      <div class="d-flex">
        <IconBtn
          v-if="!isReadonlyWindow"
          :icon="mdiOpenInNew"
          color="#9E9E9E"
          @click="onClickOpenNewTabBtn"
        />
        <IconBtn :icon="mdiClose" color="#9E9E9E" @click="closeArea" />
      </div>
    </div>

    <Divider
      height="0.0625rem"
      :bdColor="stores.ts.isDarkmode ? '#414141' : '#DFDFDF'"
    />

    <!-- 도면 컨텐츠 -->
    <div
      class="drawings-content d-flex flex-column justify-start align-center"
      :style="{ height: isReadonlyWindow ? 'calc(100% - 3rem)' : '100%' }"
    >
      <!-- 도면이 없을 때 -->
      <div
        class="drawing-no-files d-flex flex-column justify-center align-center"
        v-if="!workspaceStore.caseData.drawings.length"
      >
        <div
          v-if="!isReadonlyWindow"
          class="text-400-18-gray mb-2"
          :style="{ color: stores.ts.darkmodeColor }"
        >
          {{
            Util.getI18NTxt(stores, "I18N/WORKSPACE/DRAWINGS/REQUEST_UPLOAD")
          }}
        </div>
        <div
          v-if="isReadonlyWindow"
          class="text-400-18-gray mb-2"
          :style="{ color: stores.ts.darkmodeColor }"
        >
          {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/DRAWINGS/NO_DATA") }}
        </div>
        <div
          v-if="!isReadonlyWindow"
          class="text-400-14-gray"
          style="color: #616161; padding: 0 2rem"
          :style="{ color: stores.ts.darkmodeColor }"
        >
          {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/DRAWINGS/UPLOAD_GUIDE") }}
        </div>
        <v-btn
          v-if="!isReadonlyWindow"
          class="mt-5 pa-0"
          color="#5c6bc0"
          :style="{
            width: 'max-content',
            color: Util.getColor(stores, 'BUTTON_TEXT'),
            backgroundColor: Util.getColor(stores, 'BUTTON'),
          }"
          flat
          ><label
            style="
              padding: 0 0.5rem;
              width: max-content;
              height: 100%;
              line-height: 2.25rem;
              cursor: pointer;
            "
            for="registDrawings"
          >
            <div class="text-400-14-white">
              {{
                Util.getI18NTxt(
                  stores,
                  "I18N/WORKSPACE/DRAWINGS/UPLOAD_DRAWING_BUTTON"
                )
              }}
            </div></label
          ></v-btn
        >
      </div>
      <!-- 도면이 있을 때 -->
      <div
        v-else
        class="drawings-files d-flex flex-column justify-start align-center"
      >
        <img
          v-if="isSrcImg"
          class="drawings-image"
          ref="drawingImg"
          alt="drawings"
          :src="
            workspaceStore.caseData.drawings[workspaceStore.curDrawingIdx]?.data
          "
          :style="{
            width: 'auto',
            maxHeight: $route.path.includes('wtab') ? '50rem' : '37.5rem',
          }"
        />

        <div
          v-else
          id="drawings-pdf"
          class="drawings-pdf d-flex justify-center align-center"
          :style="{ height: isReadonlyWindow ? '100%' : '' }"
          v-init-pdf
        ></div>
        <div class="drawings-image-name mt-2">
          <div :style="{ color: stores.ts.darkmodeColor }">
            {{
              workspaceStore.caseData.drawings[workspaceStore.curDrawingIdx]
                ?.name
            }}
          </div>
          <IconBtn
            v-if="!isReadonlyWindow"
            :style="{
              width: '1.5rem',
              height: '1.5rem',
              position: 'absolute',
              right: '1rem',
              bottom: isSrcImg ? '2rem' : '4rem',
            }"
            :icon="mdiTrashCan"
            color="#9E9E9E"
            @click="drawingRemoveModal?.show()"
          />
        </div>

        <Draggable
          v-if="isSrcImg"
          v-model="workspaceStore.caseData.drawings"
          class="d-flex flex-wrap my-8 mx-2"
          style="gap: 0.5rem"
          item-key="name"
          :handle="isReadonlyWindow ? '.none' : ''"
          @change="onMovedDrawing"
        >
          <template #item="{ element, index }">
            <div
              class="drawings-idx-btn"
              :key="element.name"
              :style="{
                backgroundColor: drawingIdxBgColor(index),
                color: drawingIdxBtnColor(index),
                border: drawingIdxBorderColor(index),
              }"
              @click="onClickDrawingIdxBtn(index)"
              draggable="true"
            >
              <div style="line-height: 1.9rem">
                {{ index + 1 }}
              </div>
            </div>
          </template>
        </Draggable>
      </div>
      <IComponentSpinner ref="drawingsSpinner" />
    </div>

    <!-- 도면 푸터 -->
    <div
      v-if="
        !isReadonlyWindow &&
        isSrcImg &&
        workspaceStore.caseData.drawings?.length
      "
      class="drawings-footer d-flex flex-column align-center justify-center mx-4"
    >
      <div
        class="mb-2 text-400-14-black"
        :style="{ color: stores.ts.darkmodeColor }"
      >
        {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/DRAWINGS/ADD_IMAGE_GUIDE") }}
      </div>

      <!-- 도면 추가 버튼 -->
      <v-btn
        class="pa-0 px-2"
        :style="{
          width: 'max-content',
          height: '2rem',
          whiteSpace: 'nowrap',
          height: '1.5rem',
          color: Util.getColor(stores, 'BUTTON_TEXT'),
          backgroundColor: Util.getColor(stores, 'BUTTON'),
          borderRadius: '2px',
        }"
        flat
        ><label for="registDrawings"
          ><div
            class="text-400-12-white"
            style="
              width: max-content;
              height: 2rem;
              line-height: 2rem;
              cursor: pointer;
            "
          >
            {{
              Util.getI18NTxt(
                stores,
                "I18N/WORKSPACE/DRAWINGS/ADD_DRAWING_BUTTON"
              )
            }}
          </div></label
        ></v-btn
      >
    </div>

    <!-- 도면 등록 인풋 -->
    <input
      ref="registDrawings"
      id="registDrawings"
      type="file"
      :accept="acceptFileTypes"
      multiple
      :style="{ display: 'none', height: '84px' }"
    />
    <teleport to="#modal-area">
      <!-- 도면 삭제 모달 -->
      <Modal
        ref="drawingRemoveModal"
        :title="
          Util.getI18NTxt(stores, 'I18N/WORKSPACE/DRAWINGS/DELETE_IMAGE_HEADER')
        "
        buttonType="NY"
        :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CANCEL')"
        :yesTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/DELETE')"
        :yesFunc="onClickDeleteBtn"
      >
      </Modal>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import IconBtn from "@/components/common/IconBtn.vue";
import Modal from "@/components/common/modal/Modal.vue";
import Divider from "@/components/Divider.vue";
import Draggable from "vuedraggable";
import {
  mdiClose,
  mdiOpenInNew,
  mdiReorderVertical,
  mdiTrashCan,
} from "@mdi/js";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Directive,
} from "vue";
import type { ModalType } from "@/types/modal";
import * as Util from "@/assets/javascripts/ipedit_util";
import PDFObject from "pdfobject";
import "tiff.js";
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { useRouter } from "vue-router";
import type { DrawingData } from "@/types/case";
import { tldexie } from "@/assets/javascripts/dexie";
import {
  SINGLE_DRAWING_SIZE_LIMIT,
  ALL_DRAWINGS_SIZE_LIMIT,
} from "@/assets/javascripts/common";
import { storeToRefs } from "pinia";
import type { IIComponentSpinner } from "@/types/component";
import IComponentSpinner from "@/components/IComponentSpinner.vue";

const props = defineProps<{
  modelValue?: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = ref(props.modelValue);

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

const router = useRouter();

// 엘리먼트
const drawingRemoveModal = ref<ModalType>();
const registDrawings = ref<HTMLInputElement>(document.createElement("input"));
// 전체 로딩 스피너
const drawingsSpinner = ref<IIComponentSpinner>();

// 컴포넌트 마운트 확인
const isMounted = ref(false);

// pdf File 객체
const pdfFile = ref<File>();

// PDFObject 조건 확인
const isSrcImg = ref(true);
const isPdfObjectMounted = ref(false);
const pdfUploadedNow = ref(false);

// 스토어 초기화 확인
const { initializeWorkspace, initializeDrawingArea, refreshDrawings } =
  storeToRefs(workspaceStore);

// 레이아웃
const isComponentDrag = ref(false);

// readonly 모드인지 여부
const isReadonlyWindow = ref(false);
// readonly 모드로 동작해야 하는 경우 셋팅: 새창, trash, archive
if (
  router.currentRoute.value.path.indexOf("wtab") > 0 ||
  workspaceStore.caseMasterData.case_status_code_path ===
    "DR_CASE_STATUS/S77" ||
  workspaceStore.caseMasterData.case_status_code_path === "DR_CASE_STATUS/S99"
) {
  //데이터 편집이 불가능하도록 isReadonlyWindow false 처리
  isReadonlyWindow.value = true;
}

function closeArea() {
  if (!isReadonlyWindow.value) {
    workspaceStore.controlAreaShow("drawing");
    workspaceStore.initializeToolbar = true;
  } else {
    window.close();
  }
}

// 새탭 열기 버튼 클릭 시
function onClickOpenNewTabBtn() {
  localStorage.setItem("tabFrom", "drawings");

  window.open(
    "wtab",
    "drawings",
    `width=${Math.ceil(window.screen.availWidth / 2)}, height=${
      window.screen.availHeight
    }, menubar=no, status=no, toolbar=no, location=no`
  );
}

// 파일 업로드 변수
const acceptImageTypes = ["jpg", "png", "tif", "tiff", "pdf"];
const acceptPdfAndImageTypes = ".pdf, .jpg, .png, .tif, .tiff";
const acceptFileTypes = ref(acceptPdfAndImageTypes);

function onClickDrawingIdxBtn(idx: number) {
  // 현재 도면 인덱스를 클릭한 아이템의 인덱스로 변경
  workspaceStore.curDrawingIdx = idx;
}

async function saveDrawings() {
  // tldexie 저장
  await tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "drawings",
    JSON.stringify(workspaceStore.caseData.drawings)
  );
}

const saveDrawingsSpinner = () =>
  drawingsSpinner.value?.setSpinner(saveDrawings, "translucent")();

// 이미지 삭제 버튼
function onClickDeleteBtn() {
  // 현재 인덱스가 1보다 크거나 같을 땐 이전 이미지 보여주고
  // 현재 이미지 없애고 idx--
  if (workspaceStore.curDrawingIdx >= 1) {
    workspaceStore.caseData.drawings.splice(workspaceStore.curDrawingIdx, 1);
    workspaceStore.curDrawingIdx--;
  } else {
    // 현재 인덱스가 0이고
    // drawingsImages 길이가 1보다 클 때 이후 이미지가 존재
    // 이후 이미지 보여주고 이미지 삭제
    if (workspaceStore.caseData.drawings.length > 1) {
      workspaceStore.caseData.drawings.splice(workspaceStore.curDrawingIdx, 1);
      // drawingImages 길이가 1, 0일 때
    } else {
      // drawingImages 길이가 0일 때 이후 이미지 없음
      workspaceStore.caseData.drawings.splice(workspaceStore.curDrawingIdx, 1);
      acceptFileTypes.value = acceptPdfAndImageTypes;
      isSrcImg.value = true;
    }
  }
  // 같은 파일 다시 올릴 수 있게 업로드 인풋 값 초기화
  registDrawings.value.value = "";
  saveDrawingsSpinner();
  drawingRemoveModal.value?.hide();
}

// 도면 드래그 버튼 스타일
const drawingIdxBgColor = computed(() => (index: number) => {
  if (workspaceStore.curDrawingIdx === index) {
    if (themeStore.isDarkmode) return Util.getColor(stores, "PRIMARY_DARK");
    else return themeStore.workspacePrimary;
  } else {
    if (themeStore.isDarkmode) return themeStore.darkmodeBackgroundColor;
    return "white";
  }
});

const drawingIdxBtnColor = computed(() => (index: number) => {
  if (workspaceStore.curDrawingIdx === index) {
    if (themeStore.isDarkmode) return Util.getColor(stores, "BUTTON_TEXT");
    else return Util.getColor(stores, "BUTTON_TEXT");
  } else {
    if (themeStore.isDarkmode) return "#BDBDBD";
    return "#616161";
  }
});

const drawingIdxBorderColor = computed(() => (index: number) => {
  if (workspaceStore.curDrawingIdx === index) return "1px solid transparent";
  else if (themeStore.isDarkmode) return stores.ts.darkmodeBorder;
  else return "1px solid #DFDFDF";
});

// 드래그 후에 현재 인덱스에 온 이미지를 보여줌
const onMovedDrawing = () => {
  workspaceStore.caseData.drawings.forEach((_: any, idx: number) => {
    workspaceStore.caseData.drawings[idx].order = idx;
  });
  saveDrawingsSpinner();
};

// Pdfobject 세팅
function setPdfobject() {
  if (pdfFile.value) {
    // 상태 변경
    isSrcImg.value = false;

    // 파일 URL 생성
    const url = URL.createObjectURL(pdfFile.value);

    let pdfOptions: PDFObject.Options = {
      // 뷰어를 강제로 pdfjs로 설정할 것인가
      forcePDFJS: true,
      // 뷰어 URL
      PDFJS_URL: "/pdfjs/build/minified/web/viewer.html",
      // ADOBE에서 지원하는 PDF 오픈 파라미터
      pdfOpenParams: {
        // (accepted values: none, thumbs, bookmarks, attachments)
        pagemode: "none",
      },
    };

    // 임베딩
    console.log(document.getElementById("drawings-pdf"));
    PDFObject.embed(url, "#drawings-pdf", pdfOptions);
  }
}

function getDataURLFromTifBuffer(buffer: ArrayBuffer) {
  let tiff = new window.Tiff({ buffer: buffer });
  let canvas = tiff.toCanvas();
  canvas.style.width = "100%";
  canvas.style.height = "100%;";
  return canvas.toDataURL();
}

function getType(fileName: string) {
  const tmp = fileName.split(".");
  const fileType = tmp.length >= 2 ? tmp.at(-1) : undefined;
  return fileType ? fileType.toLocaleLowerCase() : "undefined";
}

async function uploadFiles(event: any) {
  // 상태 초기화
  const originFileNames: string[] = workspaceStore.caseData.drawings.map(
    (data: DrawingData) => {
      return data.name;
    }
  );

  let singleFileSizeError = false;
  let nowAllowedFileTypeError = false;
  let fileNameDuplicatoinError = false;
  isSrcImg.value = true;
  pdfUploadedNow.value = false;

  const prevLength = workspaceStore.caseData.drawings.length;

  // 복수 파일 읽기
  const files: Promise<DrawingData>[] = [...event.target.files].map(
    async (file: File, index: number) => {
      const reader = new FileReader();
      const fileName: string = file.name;
      const fileType: string = getType(fileName);

      if (file.size > SINGLE_DRAWING_SIZE_LIMIT) {
        singleFileSizeError = true;
        throw new Error(
          `${file.name}.${file.type} is over ${SINGLE_DRAWING_SIZE_LIMIT} MB`
        );
      }

      if (!acceptImageTypes.includes(fileType)) {
        nowAllowedFileTypeError = true;
        throw new Error(`${file.name} is not acceptable`);
      }

      if (originFileNames.includes(file.name)) {
        fileNameDuplicatoinError = true;
        throw new Error(`${file.name} is duplicated`);
      }

      if (fileType === "pdf") pdfFile.value = file;

      return new Promise((resolve) => {
        // onload  정의
        reader.onload = () => {
          if (reader.result) {
            resolve({
              // 현재 order는 기존 도면 갯수 + 현재 인덱스
              order: index + prevLength,
              name: file.name,
              type: file.type,
              size: file.size,
              data: file.type.includes("tif")
                ? getDataURLFromTifBuffer(reader.result as ArrayBuffer)
                : reader.result,
            });
          } else {
            console.log(`${file.name} is not acceptable`);
          }
        };

        // 파일 읽기
        if (file.type.includes("tif")) {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsDataURL(file);
        }
      });
    }
  );

  // 업로드 진행
  try {
    const results = await Promise.all(files);

    // sum-up
    const prevSize = workspaceStore.caseData.drawings.reduce(
      (prev: number, curr: DrawingData) => prev + curr.size,
      0
    );
    const totalSize =
      prevSize +
      results.reduce((prev, curr) => {
        return prev + curr.size;
      }, 0);
    const totalLength = prevLength + results.length;
    const prevPdfs = workspaceStore.caseData.drawings.reduce(
      (prev: number, curr: DrawingData) => {
        return getType(curr.name) === "pdf" ? prev + 1 : prev;
      },
      0
    );
    const currPdfs = results.reduce((prev: number, curr: DrawingData) => {
      return getType(curr.name) === "pdf" ? prev + 1 : prev;
    }, 0);
    const totalPdfs = prevPdfs + currPdfs;

    // console.log(results);
    // console.log(totalSize);
    // console.log(totalLength);
    // console.log(prevPdfs, currPdfs, totalPdfs);

    // 파일 총 용량 초과 (20MB)
    if (totalSize > ALL_DRAWINGS_SIZE_LIMIT) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(
          stores,
          "I18N/WORKSPACE/DRAWINGS/TOTAL_FILE_SIZE_ERROR"
        ),
        true
      );
      return;
    }

    // PDF 파일이 2개 이상 등록
    if (totalPdfs > 1) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(stores, "I18N/WORKSPACE/DRAWINGS/PDF_FILE_COUNT_ERROR"),
        true
      );
      return;
    }

    // PDF랑 다른 이미지 파일이랑 섞어서 업로드
    if (totalPdfs === 1) {
      if (totalLength - totalPdfs > 0) {
        Util.openInfoModal(
          stores,
          Util.getI18NTxt(
            stores,
            "I18N/WORKSPACE/DRAWINGS/FILE_TYPE_MIX_ERROR"
          ),
          true
        );
        return;
      } else {
        pdfUploadedNow.value = true;
      }
    }

    // 모든 조건이 맞으면 데이터 이동
    for (const data of results) {
      workspaceStore.caseData.drawings.push(data);
    }
    console.log("after uploading: ", workspaceStore.caseData.drawings);

    // 저장
    await tldexie.updateLayeredData(
      workspaceStore.active_save_slot,
      "drawings",
      JSON.stringify(workspaceStore.caseData.drawings)
    );

    if (pdfUploadedNow.value) checkPDF();
  } catch (e) {
    console.error(e);

    // 파일 하나 용량 초과 (5MB)
    if (singleFileSizeError) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(stores, "I18N/WORKSPACE/DRAWINGS/EACH_FILE_SIZE_ERROR"),
        true
      );
      throw e;
    }

    // 허용되지 않는 파일 형식
    if (nowAllowedFileTypeError) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(
          stores,
          "I18N/WORKSPACE/DRAWINGS/NOT_ALLOWED_FILE_TYPE_ERROR"
        ),
        true
      );
      throw e;
    }

    // 동일 파일 존재
    if (fileNameDuplicatoinError) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(stores, "I18N/WORKSPACE/DRAWINGS/SAME_FILE_ERROR"),
        true
      );
      throw e;
    }
  }
}

const uploadFilesSpinner = (e: any) =>
  drawingsSpinner.value?.setSpinner(uploadFiles, "opacity")(e);

// 아래는 workspace 드래그 레이아웃 관련 함수
function dragStart(e: DragEvent) {
  // props에 watch 붙어 있는게 정상 작동 안해서 강제로 드래그 시작 시 true됨
  modelValue.value = false;
  workspaceStore.areaDragStart(e);
}

// workspace에서 드래그가 끝날 때
function dragEnd(e: DragEvent) {
  workspaceStore.areaDragEnd(e);
  modelValue.value = true;
}

// props가 바뀔 때(부모에서 값이 바뀔 때)
watch(props, () => {
  modelValue.value = props.modelValue;
});

// modelValue가 바뀔 때(컴포넌트 내부에서 값이 바뀔 때)
watch(modelValue, () => {
  emit("update:modelValue", modelValue.value);
});

async function setDrawing() {
  // 케이스 데이터에 도면이 있으면 pdf 혹은 이미지를 로딩
  const drawings = workspaceStore.caseData.drawings;
  const drawing: DrawingData = drawings[0];

  if (drawings.length) {
    if (drawing.type.includes("pdf")) {
      // 이전 업로드 때 pdf라면 파일이 1개일 수 밖에 없으므로 첫 번째 파일 가져옴
      pdfFile.value = await Util.urlToFile(
        drawing.data as string,
        drawing.name,
        drawing.type
      );
      setPdfobject();
      return;
    }
  }

  isSrcImg.value = true;
}

function checkPDF() {
  const drawings = workspaceStore.caseData.drawings;
  const drawing: DrawingData = drawings[0];

  if (drawings.length && drawing.type.includes("pdf")) isSrcImg.value = false;
  else isSrcImg.value = true;
}

const vInitPdf: Directive = {
  mounted() {
    isPdfObjectMounted.value = true;
  },
};

onMounted(() => {
  // 새창이 아닐 때 리더 함수 및 이벤트 부착
  if (!isReadonlyWindow.value)
    registDrawings.value?.addEventListener("change", uploadFilesSpinner);

  isMounted.value = true;
});
onBeforeUnmount(() => {
  if (!isReadonlyWindow.value)
    registDrawings.value?.removeEventListener("change", uploadFilesSpinner);
});

// 스토어 초기화 완료
watch(initializeDrawingArea, () => {
  if (initializeDrawingArea.value) checkPDF();
});

// PDFObject 처음 랜더링 시
watch([isPdfObjectMounted, initializeDrawingArea], async () => {
  if (isPdfObjectMounted.value && initializeDrawingArea.value) {
    await setDrawing();
    isPdfObjectMounted.value = false;
    initializeDrawingArea.value = false;
  }
});

// PDF 업로드시, PDFObject 업데이트
watch([pdfUploadedNow, isPdfObjectMounted], async () => {
  if (pdfUploadedNow.value && isPdfObjectMounted.value) {
    await setDrawing();
    pdfUploadedNow.value = false;
    isPdfObjectMounted.value = false;
  }
});

// Drawings, PDFObject 새로 고침 시
watch([initializeWorkspace, isMounted, isPdfObjectMounted], async () => {
  checkPDF();

  if (
    !initializeWorkspace.value &&
    isMounted.value &&
    isPdfObjectMounted.value
  ) {
    await setDrawing();
    isMounted.value = false;
    isPdfObjectMounted.value = false;
  }
});

// PDFObject 강제 업데이트 시
watch(refreshDrawings, async () => {
  if (refreshDrawings.value) {
    await setDrawing();
    refreshDrawings.value = false;
  }
});
</script>

<style lang="scss" scoped>
@import "@/styles/draft/text";
.drawings {
  position: relative;
  background-color: white;
  overflow: hidden;
  border: 1px solid #dfdfdf;
  .description-header {
    height: 1.5rem;
  }

  .drawings-content {
    position: relative;
    width: 100%;
    padding-bottom: 1rem;
    overflow: overlay;
    .drawing-no-files {
      width: 100%;
      height: 100%;
    }
    .drawings-files {
      width: 100%;
      height: 100%;
    }
    .drawings-image-name {
      width: 100%;
      position: relative;
      text-align: center;
    }
    .drawings-image {
      width: 95%;
      background-color: #eeeeee;
      box-shadow: (0px 2px 5px rgba(0, 0, 0, 0.15));
    }
    .drawings-pdf {
      width: 100%;
      height: 100%;
      background-color: #eeeeee;
      box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }
    .drawings-idx-btn {
      width: 2rem;
      height: 2rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
      text-align: center;
      line-height: 2rem;
      cursor: pointer;
      &:hover {
        opacity: 0.6;
      }
    }
  }

  .drawings-footer {
    padding: 0.5rem;
    position: absolute;
    width: calc(100% - 2rem);
    bottom: 0.875rem;
    height: max-content;
    border: 1px dashed #dfdfdf;
    border-radius: 0.25rem;
  }
}
</style>
