<template>
  <DragModal
    ref="EditElementModal"
    buttonType="NY"
    :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CANCEL')"
    :yesTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/SAVE')"
    :deleteTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/DELETE')"
    :noFunc="() => (workspaceStore.elementEditorModal.isOpen = false)"
    :yesFunc="updateElementDataSpinner"
    :deleteFunc="deleteElementDataSpinner"
    :left="workspaceStore.elementEditorModal.left"
    :top="workspaceStore.elementEditorModal.top"
    deleteBtn
  >
    <!-- 명칭 번호 입력 -->
    <div class="edit-element-modal d-flex">
      <div class="mr-2" :style="{ width: '100%' }">
        <div class="mb-2 text-400-12-gray" style="color: #7c7f90">
          {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/NAME") }}
        </div>
        <div
          id="modal-element-name-toolbar"
          style="position: absolute; top: -2.5rem"
        />
        <Editor
          inline
          id="modal-element-name"
          :data="editTarget?.name"
          :init="{
            ...workspaceStore.tinymceInlineConfig,
            placeholder: Util.getI18NTxt(
              stores,
              'I18N/WORKSPACE/ELEMENTS_LIST/NAME'
            ),
            fixed_toolbar_container: '#modal-element-name-toolbar',
            setup: handleNameEnter,
          }"
          :style="[
            inlineEditorStyle,
            {
              minWidth: '5rem',
              maxWidth: '24.625rem',
              padding: '0.625rem 0.625rem 0.625rem 0.625rem',
            },
          ]"
        />
      </div>
      <div>
        <div class="mb-2 text-400-12-gray" style="color: #7c7f90">
          {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/NUMBER") }}
        </div>
        <div
          id="modal-element-number-toolbar"
          style="position: absolute; top: -2.5rem; flex-wrap: nowrap"
        />
        <Editor
          inline
          id="modal-element-number"
          :data="editTarget?.number"
          :init="{
            ...workspaceStore.tinymceInlineConfig,
            placeholder: Util.getI18NTxt(
              stores,
              'I18N/WORKSPACE/ELEMENTS_LIST/NUMBER'
            ),
            fixed_toolbar_container: '#modal-element-number-toolbar',
            setup: handleNumberEnter,
            callback: setupFocus,
          }"
          :style="[
            inlineEditorStyle,
            { width: '5rem', padding: '0.625rem 0.625rem 0.625rem 0.625rem' },
          ]"
          :disabled="isNumberDisabled"
        />
      </div>
      <IComponentSpinner
        ref="modalSpinner"
        :container-style="{ width: 'calc(100% - 2rem)' }"
      />
    </div>
  </DragModal>
</template>

<script setup lang="ts">
import * as ElementHandler from "@/assets/javascripts/ipedit_element_handler";
import * as Util from "@/assets/javascripts/ipedit_util";
import DragModal from "@/components/common/modal/DragModal.vue";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { inlineEditorStyle } from "@/styles";
import Editor from "@/components/workspace/Editor.vue";
import { onMounted, ref, onBeforeUnmount } from "vue";
import type { ElementData } from "@/types/case";
import tinymce, { Editor as EditorType } from "tinymce/tinymce";
import type { ModalType } from "@/types/modal";
import { tldexie } from "@/assets/javascripts/dexie";
import type { IIComponentSpinner } from "@/types/component.js";
import IComponentSpinner from "@/components/IComponentSpinner.vue";

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

const EditElementModal = ref<ModalType>();
const modalSpinner = ref<IIComponentSpinner>();

const editTarget = ref<ElementData>();

const isNumberDisabled = ref(false);

// 입력 데이터 초기화
function resetInputData() {
  tinymce.get("modal-element-name")?.setContent("");
  tinymce.get("modal-element-number")?.setContent("");
  tinymce.get("modal-element-name")?.focus();
}

// 삭제 클릭
async function deleteElementData() {
  console.log(editTarget.value);
  if (editTarget.value?.inputOrder === 0) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/ELEMENTS_LIST/DELETE_TITLE_ALERT"
      ),
      true
    );
    return;
  }

  // 구성요소 삭제 메소드 실행
  const deleteResult = ElementHandler.deleteElement(
    workspaceStore.caseData.elements,
    editTarget.value as ElementData
  );

  if (deleteResult === 500) {
    Util.openAlertModal(
      stores,
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/UNKNOWN_ERROR")
    );
  } else {
    // tldexie 저장
    const updateResult = await tldexie.updateLayeredData(
      workspaceStore.active_save_slot,
      "elements",
      JSON.stringify(workspaceStore.caseData.elements)
    );

    if (updateResult) {
      workspaceStore.showSnackbar(
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/DELETE_SUCCESSED").replace(
          "$DATA$",
          Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/TITLE")
        ),
        "info"
      );

      // 구성요소 변경 상태 업데이트
      workspaceStore.setTargetElement(editTarget.value as ElementData);
      workspaceStore.isElementDeleted = true;

      workspaceStore.targetElementID = "";

      workspaceStore.elementEditorModal.hide();
    } else {
      workspaceStore.showSnackbar(
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/DELETE_FAILED").replace(
          "$DATA$",
          Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/TITLE")
        ),
        "error"
      );
    }
  }
}

const deleteElementDataSpinner = () =>
  modalSpinner.value?.setSpinner(deleteElementData, "translucent")();

// Tr로부터 높이를 구해서 Tr의 스타일에 적용함
function setTdHeightFromTr(el: HTMLElement) {
  // 구성요소 테이블 행 업데이트 될 때 양쪽 높이 맞춰주기
  let leftChildren: HTMLElement = el.children[0] as HTMLElement;
  let rightChildren: HTMLElement = el.children[1] as HTMLElement;
  let style = window.getComputedStyle(el);
  leftChildren.style.height = "";
  rightChildren.style.height = "";
  leftChildren.style.height = style.height;
  rightChildren.style.height = style.height;
  leftChildren.style.padding = "0.5rem";
  rightChildren.style.padding = "0.5rem";
}

// 저장 클릭
async function updateElementData() {
  // WIRIS 입력 고려해서 에디터 비어있는지 판단
  const isNameEmpty = Util.isInlineEditorEmpty(
    tinymce.get("modal-element-name")
  );
  const isNumberEmpty = Util.isInlineEditorEmpty(
    tinymce.get("modal-element-number")
  );

  if (isNameEmpty) {
    document.getElementById("modal-element-name")?.focus();
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/NAME_ALERT"),
      true
    );
    return;
  }

  if (isNameEmpty && isNumberEmpty) {
    resetInputData();
    return;
  }

  // console.log(editTarget.value?.number);
  // 도면부호를 000으로 변경한 경우
  if (editTarget.value?.inputOrder !== 0) {
    if (
      tinymce
        .get("modal-element-number")
        .getContent({ format: "text" })
        .trim() === "000" ||
      tinymce
        .get("modal-element-number")
        .getContent({ format: "text" })
        .trim() === "０００"
    ) {
      document.getElementById("modal-element-name")?.focus();
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/000_ALERT"),
        true
      );
      return;
    }
  }

  // 데이터 복구용 임시 구성요소
  const backupElements = JSON.parse(
    JSON.stringify(workspaceStore.caseData.elements)
  );

  const elementName = tinymce
    .get("modal-element-name")
    .getContent()
    .replace(/((\&nbsp\;)|\s)+\<\/p\>/gi, "</p>");
  const elementNumber = tinymce
    .get("modal-element-number")
    .getContent()
    .replace(/((\&nbsp\;)|\s)+\<\/p\>/gi, "</p>");

  // 수정 전 데이터랑 동일하면 return;
  if (
    editTarget.value?.name === elementName &&
    editTarget.value?.number === elementNumber
  ) {
    workspaceStore.elementEditorModal.hide();
    return;
  }

  // 구성요소 수정 메소드 실행
  const editResult = ElementHandler.editElement(
    workspaceStore.caseData.elements,
    editTarget.value as ElementData,
    elementName,
    elementNumber
  );

  if (editResult === 501) {
    document.getElementById("modal-element-name")?.focus();
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/ELEMENTS_LIST/SAME_ELEMENT_ALERT"
      ),
      true
    );
    setupNameFocus();
  } else if (editResult === 500) {
    document.getElementById("modal-element-name")?.focus(); // 원상태로 복구
    workspaceStore.caseData.elements = backupElements;
    Util.openAlertModal(
      stores,
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/UNKNOWN_ERROR")
    );
  } else {
    // 스토어 배열에 등록 성공

    // tldexie 저장
    const updateResult = await tldexie.updateLayeredData(
      workspaceStore.active_save_slot,
      "elements",
      JSON.stringify(workspaceStore.caseData.elements)
    );

    if (updateResult) {
      // console.log(editTarget.value?.inputOrder);

      workspaceStore.showSnackbar(
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/UPDATE_SUCCESSED").replace(
          "$DATA$",
          Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/TITLE")
        ),
        "info"
      );

      // 발명의 명칭에 대응되는 것 수정하면 발명의 명칭도 변경시켜줌
      if (editTarget.value?.inputOrder === 0) {
        // 데이터 복구용 임시 구성요소
        const backupTitle = JSON.parse(
          JSON.stringify(workspaceStore.caseData.invention_title)
        );

        workspaceStore.caseData.invention_title.data = elementName;

        // tldexie 저장
        await tldexie.updateLayeredData(
          workspaceStore.active_save_slot,
          "invention_title",
          JSON.stringify(workspaceStore.caseData.invention_title)
        );
      }

      workspaceStore.setTargetElement(editTarget.value as ElementData);
      workspaceStore.setIsElementUpdated(true);
      resetInputData();
      setTdHeightFromTr(stores.ws.tempElement);

      workspaceStore.elementEditorModal.hide();
    } else {
      workspaceStore.showSnackbar(
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/UPDATE_FAILED").replace(
          "$DATA$",
          Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/TITLE")
        ),
        "error"
      );
    }
  }
}

const updateElementDataSpinner = () =>
  modalSpinner.value?.setSpinner(updateElementData, "translucent")();

// 구성요소 명칭 입력창 엔터 핸들링
const handleNameEnter = (editor: EditorType) => {
  editor.on("keydown", function (e: KeyboardEvent) {
    if (e.keyCode === 229) return;

    if (e.key == "Enter" && (e.code == "Enter" || e.code == "NumpadEnter")) {
      e.preventDefault();
      e.stopPropagation();
      setupNumberFocus();
    }
  });
};

// 구성요소 번호 입력창 엔터 핸들링
const handleNumberEnter = (editor: EditorType) => {
  editor.on("keydown", function (e: KeyboardEvent) {
    // console.log(e);
    if (e.keyCode === 229) return;

    if (e.key == "Enter" && (e.code == "Enter" || e.code == "NumpadEnter")) {
      e.preventDefault();
      e.stopPropagation();
      updateElementData();
    }
  });
};

const setupFocus = (editor: EditorType) => {
  tinymce.get("modal-element-name").focus();
  tinymce
    .get("modal-element-name")
    .selection.select(tinymce.get("modal-element-name").getBody(), true);
  tinymce.get("modal-element-name").selection.collapse(false);
};

function setupNameFocus() {
  tinymce.get("modal-element-name").focus();
  tinymce
    .get("modal-element-name")
    .selection.select(tinymce.get("modal-element-name").getBody(), true);
  tinymce.get("modal-element-name").selection.collapse(false);
}

function setupNumberFocus() {
  tinymce.get("modal-element-number").focus();
  tinymce
    .get("modal-element-number")
    .selection.select(tinymce.get("modal-element-number").getBody(), true);
  tinymce.get("modal-element-number").selection.collapse(false);
}

onMounted(() => {
  EditElementModal.value?.show();

  // 수정 대상 설정
  const filterResult = workspaceStore.caseData.elements.list.filter(function (
    data: ElementData
  ) {
    return data.elementId == workspaceStore.targetElementID;
  });

  editTarget.value = filterResult[0];

  // console.log(editTarget.value);

  if (editTarget.value?.inputOrder === 0) isNumberDisabled.value = true;
  else isNumberDisabled.value = false;
});

onMounted(() => {
  // console.log(editTarget.value);
});

onBeforeUnmount(() => {
  // workspace에 포커스를 강제로 주기 위함
  document.getElementById("hidden-input")?.focus();
});
</script>

<style lang="scss" scoped>
.edit-element-modal {
  min-width: 20rem;
  height: max-content;
  font-size: 0.875rem;
  max-width: 30rem;
  overflow: hidden;
}
::v-deep(.tox-toolbar__group) {
  flex-wrap: nowrap !important;
}
.modal-wrapper {
  z-index: 2;
}
</style>
