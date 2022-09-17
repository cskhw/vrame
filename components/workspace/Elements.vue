<template>
  <div
    class="elements d-flex flex-column"
    ref="elementsRef"
    :style="{
      backgroundColor: stores.ts.isDarkmode ? '#1e1e1e' : '',
      border: stores.ts.isDarkmode ? '0.0625rem solid #414141' : '',
      height: $route.path.includes('wtab') ? '100%' : 'calc(100% - 0.5rem)',
    }"
    style="min-width: 17.5rem"
    :draggable="isComponentDrag"
    @dragstart="dragStart($event)"
    @dragend="dragEnd($event)"
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

    <!-- 구성요소 헤더 -->
    <div class="elements-header d-flex justify-space-between ma-3">
      <div class="d-flex align-center">
        <!-- 드래그 핸들 -->
        <IconBtn
          class="handle mr-2"
          :icon="mdiReorderVertical"
          color="#9E9E9E"
          @mouseenter="isComponentDrag = true"
          @mouseleave="isComponentDrag = false"
        />
        <!-- 영역 타이틀 -->
        <div
          class="text-bold-15-black"
          :style="{ color: stores.ts.isDarkmode ? 'white' : '' }"
        >
          {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/TITLE") }}
        </div>
      </div>
      <IconBtn :icon="mdiClose" color="#9E9E9E" @click="closeArea" />
    </div>
    <Divider
      height="0.0625rem"
      :bdColor="stores.ts.isDarkmode ? '#414141' : '#DFDFDF'"
    />
    <div
      class="elements-body"
      :style="{ height: isReadonlyWindow ? '100%' : 'calc(100% - 5rem)' }"
    >
      <div
        v-if="!isReadonlyWindow"
        class="d-flex align-center justify-space-between mx-3 mt-1"
      >
        <div
          class="text-400-14-gray mt-1 mb-1"
          :style="{ color: stores.ts.isDarkmode ? '#bdbdbd' : '#616161' }"
        >
          {{
            Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/ADD_ELEMENT")
          }}
        </div>
        <input
          v-show="false"
          ref="excelUploadInput"
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          @change="uploadExcelFile"
        />
        <IconBtn
          color="#1D6F42"
          :icon="mdiMicrosoftExcel"
          @click="onClickExcelUploadBtn"
        />
      </div>
      <!-- 명칭 번호 입력 -->
      <div v-if="!isReadonlyWindow" class="d-flex px-3">
        <div class="mr-2" style="width: 75%">
          <Editor
            inline
            id="element-name"
            :init="{
              ...workspaceStore.tinymceInlineConfig,
              placeholder: Util.getI18NTxt(
                stores,
                'I18N/WORKSPACE/ELEMENTS_LIST/NAME'
              ),
              setup: handleNameEnter,
            }"
            :style="[
              inlineEditorStyle,
              {
                width: '100%',
                padding: '0.625rem',
              },
            ]"
          />
        </div>
        <div style="width: 25%">
          <Editor
            inline
            id="element-number"
            :init="{
              ...workspaceStore.tinymceInlineConfig,
              placeholder: Util.getI18NTxt(
                stores,
                'I18N/WORKSPACE/ELEMENTS_LIST/NUMBER'
              ),
              setup: handleNumberEnter,
            }"
            :style="[
              inlineEditorStyle,
              {
                width: '100%',
                padding: '0.625rem',
              },
            ]"
          />
        </div>
      </div>

      <!-- 점검하기 영역 -->
      <div
        v-if="!isReadonlyWindow"
        class="d-flex align-center justify-space-between mx-3 mt-2"
      >
        <div
          v-if="Util.isApplication(stores) || Util.isPCT(stores)"
          class="d-flex align-center"
        >
          <div
            class="text-400-14-gray"
            :style="{ color: stores.ts.isDarkmode ? '#bdbdbd' : '#616161' }"
          >
            {{
              Util.getI18NTxt(
                stores,
                "I18N/WORKSPACE/ELEMENTS_LIST/CHECK_COUNT"
              )
            }}
          </div>
          <Switch
            :toggleColor="checkElementSwitchToogleColor"
            :body-color="checkElementSwitchBodyColor"
            v-model="checkElement"
            class="mx-2"
          />
        </div>
        <div v-else></div>
        <div>
          <v-btn
            class="mr-2"
            flat
            border="none"
            :style="{
              width: '3.75rem',
              height: '2.25rem',
              color: resetBtnColor,
              fontWeight: '400',
              backgroundColor: stores.ts.isDarkmode ? '#1e1e1e' : '',
            }"
            @click="resetInputData"
            >{{ Util.getI18NTxt(stores, "I18N/BUTTON/RESET") }}</v-btn
          >
          <v-btn
            color="#5c6bc0"
            flat
            :style="{
              color: Util.getColor(stores, 'BUTTON_TEXT'),
              backgroundColor: Util.getColor(stores, 'BUTTON'),
              width: '3.75rem',
              height: '2.25rem',
              fontWeight: '400',
            }"
            @click="saveElementDataSpinner"
            >{{ Util.getI18NTxt(stores, "I18N/BUTTON/ADD") }}</v-btn
          >
        </div>
      </div>
      <!-- 구성요소 리스트 영역 -->
      <div
        id="element-table"
        class="element-table mx-3 mt-3"
        :style="{
          height: isReadonlyWindow ? 'calc(100% - 1.5rem)' : '',
        }"
      >
        <!-- 테이블 헤더 -->
        <div class="element-table-head d-flex" style="width: 100%">
          <!-- 명칭 영역 -->
          <div
            class="th d-flex"
            style="border-right: 0; width: 75%; height: 2.25rem"
            :style="{
              backgroundColor: stores.ts.isDarkmode ? '#2d2d2d' : '',
              border: stores.ts.isDarkmode ? '0.0625rem solid #414141' : '',
            }"
          >
            <!-- 명칭 컬럼 -->
            <div class="d-flex" style="width: 75%">
              <div
                class="mx-1 text-bold-14-gray"
                style="line-height: 1.125rem"
                :style="{ color: stores.ts.isDarkmode ? '#bdbdbd' : '#616161' }"
              >
                {{
                  Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/NAME")
                }}
              </div>
              <div class="d-flex flex-column justify-center">
                <SvgBtn
                  width="10"
                  height="10"
                  viewBox="0 0 8 8"
                  :color="sortColors.nameSortAscColor"
                  @click="sortElementListSpinner('name', 'ASC')"
                >
                  <SortAsc />
                </SvgBtn>

                <SvgBtn
                  width="10"
                  height="10"
                  viewBox="0 0 8 8"
                  :color="sortColors.nameSortDescColor"
                  @click="sortElementListSpinner('name', 'DESC')"
                >
                  <SortDesc />
                </SvgBtn>
              </div>
            </div>
            <!-- 시간순 정렬 컬럼  -->
            <div class="d-flex justify-end" style="width: 25%">
              <div>
                <IconBtn
                  :icon="inputOrderBtnIcon"
                  :color="sortColors.inputOrderSortColor"
                  @click="
                    sortElementListSpinner(
                      'inputOrder',
                      sortColors.inputOrderSort === 'ASC' ? 'ASC' : 'DESC'
                    )
                  "
                />
              </div>
            </div>
          </div>
          <!-- 번호 영역 -->
          <div
            class="th d-flex"
            style="width: 25%; height: 2.25rem"
            :style="{
              backgroundColor: stores.ts.isDarkmode ? '#2d2d2d' : '',
              border: stores.ts.isDarkmode ? '0.0625rem solid #414141' : '',
            }"
          >
            <div
              class="mr-1"
              style="line-height: 1.125rem"
              :style="{ color: stores.ts.isDarkmode ? '#bdbdbd' : '' }"
            >
              {{
                Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/NUMBER")
              }}
            </div>
            <div class="d-flex flex-column">
              <SvgBtn
                width="10"
                height="10"
                viewBox="0 0 8 8"
                :color="sortColors.numberSortAscColor"
                @click="sortElementListSpinner('number', 'ASC')"
              >
                <SortAsc />
              </SvgBtn>

              <SvgBtn
                width="10"
                height="10"
                viewBox="0 0 8 8"
                :color="sortColors.numberSortDescColor"
                @click="sortElementListSpinner('number', 'DESC')"
              >
                <SortDesc />
              </SvgBtn>
            </div>
          </div>
        </div>

        <!-- 테이블 바디 -->
        <div
          class="element-table-body"
          :style="{
            border: stores.ts.isDarkmode
              ? '0.0625rem solid #414141'
              : '0.0625rem solid #dfdfdf',
          }"
        >
          <!-- 구성요소 테이블 아이템 -->
          <draggable
            v-model="workspaceStore.caseData.elements.list"
            item-key="elementId"
            handle=".handle"
            group="elementTable"
            @change="elementsTableChangedSpinner"
            @drag.stop=""
            @dragstart.stop=""
            @dragend.stop=""
            @mousemove="onMouseMoveElTable"
          >
            <template #item="{ element, index }">
              <div
                v-if="element.itemType === 'E'"
                v-init-tr
                class="tr d-flex align-center text-400-14-black"
                :style="{
                  borderBottom: stores.ts.isDarkmode
                    ? '0.0625rem solid #414141'
                    : '0.0625rem solid #dfdfdf',
                  overflowX: 'hidden',
                  whiteSpace: 'normal',
                  backgroundColor: getBacgroundColor(index),
                  lineHeight: '0.875rem',
                  color: stores.ts.isDarkmode ? 'white' : '',
                }"
                style="width: 100%; cursor: pointer"
                :key="element.elementId"
                @click="
                  ($event) =>
                    !isReadonlyWindow &&
                    openEditElementModal(element.elementId, $event)
                "
                @mouseenter="(e) => onMouseEnterTr(e, element, index)"
                @mouseleave="(e) => onMouseLeaveTr(e, index)"
                @drag="onDragTr"
                @dragend="onDragEndTr"
              >
                <div
                  class="td d-flex"
                  style="
                    padding: 0.5rem;
                    width: calc(75% + 0.0625rem);
                    border-right: 0.0625rem solid #dfdfdf;
                    line-height: 1.125rem;
                  "
                  :style="{
                    borderRight: stores.ts.isDarkmode
                      ? '0.0625rem solid #414141'
                      : '0.0625rem solid #dfdfdf',
                  }"
                >
                  <!-- 드래그 핸들 -->
                  <div
                    class="handle d-flex align-center"
                    style="width: 1rem; height: 100%"
                  >
                    <IconBtn
                      color="#9E9E9E"
                      style="width: 1rem; height: 1rem; cursor: move"
                      :icon="mdiDragVertical"
                    />
                    <!-- 핸들 안보일 때 공간 확보하기 위한 박스 -->
                    <div style="width: 1rem" />
                  </div>
                  <!-- 명칭 td -->
                  <div class="d-flex align-center" v-html="element.name"></div>
                </div>
                <!-- 숫자 td -->
                <div
                  class="td d-flex"
                  style="
                    padding: 0.5rem;
                    width: calc(25% - 0.125rem);
                    height: 100%;
                  "
                >
                  <div v-html="element.number"></div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
      <IComponentSpinner ref="elementsSpinner" />
    </div>

    <Divider
      height="0.0625rem"
      :bdColor="stores.ts.isDarkmode ? '#414141' : '#DFDFDF'"
    />
    <!-- 구성요소 footer -->
    <div
      v-if="!isReadonlyWindow"
      class="elements-footer ml-3 d-flex justify-start align-center"
      :style="{
        backgroundColor: themeStore.darkmodeBackgroundColor,
      }"
    >
      <div
        class="ma-0 text-400-12-gray"
        :style="{ color: stores.ts.isDarkmode ? '#BDBDBD' : '' }"
      >
        {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/GUIDE") }}
      </div>
    </div>

    <teleport to="#modal-area">
      <EditElementModal v-if="workspaceStore.elementEditorModal.isOpen" />

      <Modal
        ref="excelUploadModal"
        :title="
          Util.getI18NTxt(
            stores,
            'I18N/WORKSPACE/ELEMENTS_LIST/UPLOAD_EXCEL_MODAL_HEADER'
          )
        "
        :description="
          Util.getI18NTxt(
            stores,
            'I18N/WORKSPACE/ELEMENTS_LIST/UPLOAD_EXCEL_MODAL_CONTENT'
          )
        "
        buttonType="NY"
        :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CLOSE')"
        :yesTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/UPLOAD')"
        :yesFunc="onClickExcelModalYesBtn"
      >
        <img src="@/assets/images/excel-example.svg" alt="excel-example" />
      </Modal>
      <!-- 구성요소 상세설명 모달 -->
      <div
        v-if="checkElement"
        v-show="isMouseEnterTr"
        class="element-detail-modal"
        :style="{
          position: 'absolute',
          width: 'max-content',
          left: elementModalLeft + 'px',
          top: elementModalTop + 'px',
          backgroundColor: stores.ts.isDarkmode
            ? rgbToRgba('#616161', '.4')
            : 'black',
          opacity: stores.ts.isDarkmode ? '1' : '.4',
          color: 'white',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          zIndex: '1100',
        }"
      >
        <div>
          {{
            Util.getI18NTxt(
              stores,
              "I18N/WORKSPACE/ELEMENTS_LIST/COUNT_IN_CLAIMS"
            )
          }}
          {{ elementCountInClaims }}
        </div>
        <div>
          {{
            Util.getI18NTxt(
              stores,
              "I18N/WORKSPACE/ELEMENTS_LIST/COUNT_IN_DESCRIPTION"
            )
          }}
          {{ elementCountInDescription }}
        </div>
      </div>
      <Modal
        ref="excelUploadResultModal"
        :title="
          Util.getI18NTxt(
            stores,
            'I18N/WORKSPACE/ELEMENTS_LIST/UPLOAD_EXCEL_RESULT_MODAL_HEADER'
          )
        "
        :description="
          Util.getI18NTxt(
            stores,
            'I18N/WORKSPACE/ELEMENTS_LIST/UPLOAD_EXCEL_RESULT_MODAL_SUCCESS'
          ).replace('$COUNT$', uploadResultElements.length)
        "
        button-type="Y"
        :yes-txt="Util.getI18NTxt(stores, 'I18N/BUTTON/CONFIRM')"
        :yes-func="excelUploadResultModal?.hide"
        closeBtn
      >
        <div class="excel-upload-result-modal-body">
          <div class="element-table" style="height: 37rem">
            <!-- 테이블 헤더 -->
            <div class="element-table-head d-flex" style="width: 100%">
              <!-- 명칭 영역 -->
              <div
                class="th d-flex"
                style="border-right: 0; width: 75%; height: 2.25rem"
                :style="{
                  backgroundColor: stores.ts.isDarkmode ? '#2d2d2d' : '',
                  border: stores.ts.isDarkmode ? '0.0625rem solid #414141' : '',
                }"
              >
                <!-- 명칭 컬럼 -->
                <div class="d-flex" style="width: 75%">
                  <div
                    class="mx-1 text-bold-14-gray"
                    style="line-height: 1.125rem"
                    :style="{
                      color: stores.ts.isDarkmode ? '#bdbdbd' : '#616161',
                    }"
                  >
                    {{
                      Util.getI18NTxt(
                        stores,
                        "I18N/WORKSPACE/ELEMENTS_LIST/NAME"
                      )
                    }}
                  </div>
                </div>
              </div>
              <!-- 번호 영역 -->
              <div
                class="th d-flex"
                style="width: 20%; height: 2.25rem"
                :style="{
                  backgroundColor: stores.ts.isDarkmode ? '#2d2d2d' : '',
                  border: stores.ts.isDarkmode ? '0.0625rem solid #414141' : '',
                }"
              >
                <div
                  class="mr-1"
                  style="line-height: 1.125rem"
                  :style="{ color: stores.ts.isDarkmode ? '#bdbdbd' : '' }"
                >
                  {{
                    Util.getI18NTxt(
                      stores,
                      "I18N/WORKSPACE/ELEMENTS_LIST/NUMBER"
                    )
                  }}
                </div>
              </div>
              <!-- 상태 영역 -->
              <div
                class="th d-flex"
                style="width: 25%; height: 2.25rem"
                :style="{
                  backgroundColor: stores.ts.isDarkmode ? '#2d2d2d' : '',
                  border: stores.ts.isDarkmode ? '0.0625rem solid #414141' : '',
                }"
              >
                <div
                  class="mr-1"
                  style="line-height: 1.125rem"
                  :style="{ color: stores.ts.isDarkmode ? '#bdbdbd' : '' }"
                ></div>
              </div>
            </div>
            <div class="element-table-body">
              <div
                class="tr d-flex align-center text-400-14-black"
                v-for="(element, idx) of uploadResultElements"
                :key="idx"
                v-init-tr
              >
                <div
                  class="td"
                  style="
                    padding: 0.5rem !important;
                    width: calc(75% + 0.0625rem);
                    border-right: 0.0625rem solid #dfdfdf;
                    line-height: 1.125rem;
                  "
                >
                  {{ element.ELEMENT }}
                </div>
                <div
                  class="td"
                  style="padding: 0.5rem; width: calc(20% - 0.125rem)"
                >
                  {{ element.NUMBER }}
                </div>
                <div
                  class="td"
                  style="
                    padding: 0.5rem;
                    width: calc(25% - 0.125rem);
                    height: 100%;
                    border-left: 1px solid #dfdfdf;
                  "
                >
                  {{ excelUploadStatusTxt(element.status) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </teleport>
  </div>
</template>
<script lang="ts" setup>
import * as ElementHandler from "@/assets/javascripts/ipedit_element_handler";
import * as Util from "@/assets/javascripts/ipedit_util";
import { rgbToRgba } from "@/assets/javascripts/utils/css";
import IconBtn from "@/components/common/IconBtn.vue";
import SvgBtn from "@/components/common/SvgBtn.vue";
import Modal from "@/components/common/modal/Modal.vue";
import Switch from "@/components/common/Switch.vue";
import Divider from "@/components/Divider.vue";
import Editor from "@/components/workspace/Editor.vue";
import EditElementModal from "@/components/workspace/modal/EditElementModal.vue";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { inlineEditorStyle } from "@/styles/index";
import type { ModalType } from "@/types/modal";
import {
  mdiClose,
  mdiDragVertical,
  mdiMicrosoftExcel,
  mdiReorderVertical,
  mdiSortClockAscendingOutline,
  mdiSortClockDescendingOutline,
} from "@mdi/js";
import {
  computed,
  onMounted,
  ref,
  watch,
  type CSSProperties,
  type Directive,
} from "vue";
import Draggable from "vuedraggable";
import * as Xlsx from "xlsx";
import tinymce from "tinymce/tinymce";
import type { ElementData } from "@/types/case";
import SortAsc from "@/assets/svgs/sortAsc.vue";
import SortDesc from "@/assets/svgs/sortDesc.vue";
import { tldexie } from "@/assets/javascripts/dexie";
import IComponentSpinner from "@/components/IComponentSpinner.vue";
import type { IIComponentSpinner } from "@/types/component";

const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = ref(props.modelValue);

// 전역 변수
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

// 구성요소 테이블 아이템 추가시 효과 주기 위한 플래그
let elementTableMounted = false;
const elementsSpinner = ref<IIComponentSpinner>();

// Tr로부터 높이를 구해서 Tr의 스타일에 적용함
function setTdHeightFromTr(el: HTMLElement) {
  // 배열 메소드 사용하기 위해서 타입 캐스팅
  const children = el.children as unknown as HTMLElement[];
  let style = window.getComputedStyle(el);
  // 구성요소 테이블 행 업데이트 될 때 양쪽 높이 맞춰주기
  children.forEach((child) => {
    child.style.height = "";
    child.style.height = style.height;
    child.style.padding = "0.5rem !important";
  });
}

// Tr mounted될 때 실행되는 디렉티브
const vInitTr: Directive = {
  mounted(el: HTMLElement) {
    // 테이블 양쪽 높이 맞춰주기
    setTdHeightFromTr(el);
    // 마운트된 후에 아이템이 성공적으로 추가 되었으면 배경색 변경
    if (elementTableMounted) {
      el.style.transition = "";
      el.style.backgroundColor = "rgba(92, 107, 196, 0.4)";
      setTimeout(() => {
        el.style.transition = "all 0.3s ease-in-out";
        el.style.backgroundColor = themeStore.darkmodeBackgroundColor;
      }, 200);
    }
  },
};

// 모달
const excelUploadModal = ref<ModalType>();

// elements의 높이, 너비 구하기 위해서 가져옴
const elementsRef = ref<HTMLElement>();

// 엑셀 업로드 인풋
const excelUploadInput = ref<HTMLInputElement>();

// 드래그할 때 호버 색상 하얀색/지정한 색
const isElDrag = ref(false);

// 구성요소 헤더의 핸들에 draggable 속성 true/false
const isComponentDrag = ref(false);

// 구성요소 드래그 할 때 배경화면을 바꿔주기 위한 함수들
const onDragTr = (e: MouseEvent) => {
  isElDrag.value = true;
  let target = e.target as HTMLElement;
  target.style.backgroundColor = Util.getColor(stores, "TINTED");
  isMouseEnterTr.value = false;
};

const onDragEndTr = (e: MouseEvent) => {
  elTableHoverIndices.value.length = 0;
  isElDrag.value = false;
  let target = e.target as HTMLElement;
  target.style.backgroundColor = "";
};

// 마우스가 테이블 내에 있는지 여부
const isMouseEnterTr = ref(false);
const elTableHoverIndices = ref<boolean[]>([]);
const trBacgroundColor = ref<string[]>([]);

// 구성요소 점검 스위치
const checkElement = ref(false);
// 청구범위 등장횟수
const elementCountInClaims = ref(0);
const elementCountInClaimsArray = ref<number[]>([]);
// 그외 등장횟수
const elementCountInDescription = ref(0);
const elementCountInDescriptionArray = ref<number[]>([]);

// 구성요소 모달 위치
const elementModalLeft = ref(0);
const elementModalTop = ref(0);

// isDarkmode 값이 변할 때 정렬 아이콘 색 변경
themeStore.$subscribe((_, state) => {
  if (state.isDarkmode) {
    for (let prop in sortColors.value) {
      if (sortColors.value[prop] === "#212121")
        sortColors.value[prop] = "white";
    }
  } else {
    for (let prop in sortColors.value) {
      if (sortColors.value[prop] === "white")
        sortColors.value[prop] = "#212121";
    }
  }
});

/**엑셀 업로드 부분 */
const onClickExcelUploadBtn = () => excelUploadModal.value?.show();
const onClickExcelModalYesBtn = () => {
  excelUploadInput.value?.click();
};

// status -> 0: 성공, 1: 중복, 2: 이름이 비어있음, 3: 번호가 000, 99: 알 수 없는 오류
const uploadResultElements = ref<
  {
    status: number;
    [key: string]: string | number;
  }[]
>([]);
const excelUploadResultModal = ref<ModalType>();
const reader = new FileReader();
const excelUploadStatusTxt = computed(() => {
  return (status: number) => {
    // 성공
    if (status === 0)
      return Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/ELEMENTS_LIST/EXCEL_SUCCESS"
      );
    // 중복
    else if (status === 1)
      return Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/ELEMENTS_LIST/EXCEL_DUPLICATED"
      );
    // 명칭이 비어있음
    else if (status === 2)
      return Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/ELEMENTS_LIST/EXCEL_EMPTY_NAME"
      );
    // 번호가 000
    else if (status === 3)
      return Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/ELEMENTS_LIST/EXCEL_NOT_000"
      );
    // 알수없는 에러
    else if (status === 99)
      return Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/ELEMENTS_LIST/EXCEL_UNKNOWN_ERROR"
      );
    // 에러
    else
      return Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/ELEMENTS_LIST/EXCEL_UNKNOWN_ERROR"
      );
  };
});

/** ===예외 경우===
 * 시트가 두 개 이상
 * A, B열 외에 데이터가 존재
 * 빈 엑셀 파일임
 */
function checkExcelData(workbook: Xlsx.WorkBook) {
  if (workbook?.SheetNames?.length !== 1) {
    return false;
  } else {
    // 빈 파일이면 ref가 undefinded
    const ref = workbook.Sheets[workbook.SheetNames[0]]["!ref"];
    // 범위가 AB를 벗어나면 return false (ref 예: A1:B31)
    if (ref?.includes("A") && ref.includes("B")) return true;
    else return false;
  }
}

function onLoadExcelFile() {
  // 워크북을 바이너리 형태로 읽음
  let data = reader.result;
  let workbook = Xlsx.read(data, { type: "binary" });
  if (!checkExcelData(workbook)) {
    Util.openAlertModal(
      stores,
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/ELEMENTS_LIST/UPLOAD_EXCEL_RESULT_MODAL_FAIL"
      )
    );
    return false;
  } else {
    // 첫 번째 시트 가져와서 json으로 변경한 후 저장
    const sheetName = workbook.SheetNames[0];
    const sheet: Xlsx.Sheet = workbook.Sheets[sheetName];
    let excelElements = Xlsx.utils.sheet_to_json(sheet);
    // 데이터 복구용 임시 구성요소
    const backupElements = JSON.parse(
      JSON.stringify(workspaceStore.caseData.elements)
    );

    // A1 B1이 없으면 키를 넣어주고 있으면 나머지 데이터를 밀고 키를 넣어줌
    const firstAValue = sheet["A1"]?.v ? sheet["A1"].v : "";
    let firstBValue = sheet["B1"]?.v ? sheet["B1"].v : "";

    if (firstAValue.trim() === "" && firstBValue.trim() === "") {
      // 맨 상위 두 값이 모두 비어있으면 키 만들어줌
      sheet["A1"] = {
        t: "s",
        r: "ELEMENT",
        v: "ELEMENT",
        w: "ELEMENT",
        h: "ELEMENT",
      };

      sheet["B1"] = {
        t: "s",
        v: "NUMBER",
        w: "NUMBER",
        r: "NUMBER",
      };
      // 엑셀 구성요소 업데이트
      excelElements = Xlsx.utils.sheet_to_json(sheet);
    }
    if (!excelElements?.length) {
      Util.openAlertModal(
        stores,
        Util.getI18NTxt(
          stores,
          "I18N/WORKSPACE/ELEMENTS_LIST/UPLOAD_EXCEL_RESULT_MODAL_FAIL"
        )
      );
      return;
    }
    if (firstAValue === firstBValue) firstBValue += "_1";

    uploadResultElements.value = [];
    const keys = Object.keys(excelElements[0] as object);
    for (const element of excelElements) {
      // 타입 캐스팅
      let nameKey = "";
      let numberKey = "";
      for (const [idx, key] of keys.entries()) {
        if (idx === 0) nameKey = key;
        else if (idx === 1) numberKey = key;
        // idx가 2 이상인 것은 예외 A, B 외의 열이 있으므로 예외
        else return false;
      }

      //  키가 비어있으면 참조할 수 없으므로 예외
      if (nameKey === "" && numberKey === "") return false;

      const el: { [key: string]: string } = element as {
        [key: string]: string;
      };
      const elName = el[nameKey] ? el[nameKey].toString() : "";
      const elNum = el[numberKey] ? el[numberKey].toString() : "";
      if (elName.trim() === "") {
        // 구성요소 이름이 비어있는 구성요소 패스
        uploadResultElements.value.push({
          ELEMENT: elName,
          NUMBER: elNum,
          status: 2,
        });
        continue;
      } else if (elNum.trim() === "000" || elNum.trim() === "０００") {
        // 번호로 000이 들어오면 패스
        uploadResultElements.value.push({
          ELEMENT: elName,
          NUMBER: elNum,
          status: 3,
        });
        continue;
      } else {
        // 스토어에 구성요소 추가 실행
        const addResult = ElementHandler.addElement(
          workspaceStore.caseData.elements,
          `<p>${elName}</p>`,
          `<p>${elNum}</p>`
        );
        if (addResult === 501) {
          // 중복된 구성요소가 있는지 체크해서 있으면 실패 구성요소 배열에 저장하고 다음 구성요소 처리
          uploadResultElements.value.push({
            ELEMENT: elName,
            NUMBER: elNum,
            status: 1,
          });
          continue;
        } else if (addResult === 500) {
          // 원상태로 복구
          workspaceStore.caseData.elements = backupElements;
          uploadResultElements.value.push({
            ELEMENT: elName,
            NUMBER: elNum,
            status: 99,
          });
          continue;
        }
        uploadResultElements.value.push({
          ELEMENT: elName,
          NUMBER: elNum,
          status: 0,
        });
      }
    }
    saveElementInDexie(backupElements, 200);
    // 엘레멘트 추가 애니메이션 끔
    elementTableMounted = false;
    excelUploadModal.value?.hide();
    // 결과 모달 보여줌
    excelUploadResultModal.value?.show();
  }
}

// 업로드한 파일을 바이너리로 읽음
const uploadExcelFile = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target?.files?.item(0);

  reader.onload = onLoadExcelFile;
  reader.readAsBinaryString(file as Blob);
  // 같은 파일 재 업로드 가능하도록 인풋 값 제거
  if (excelUploadInput.value) excelUploadInput.value.value = "";
};

// 구성요소 정렬 버튼을 위한 변수
const sortColors = ref<{ [key: string]: string }>({
  nameSortAscColor: "#9E9E9E",
  nameSortDescColor: "#9E9E9E",
  inputOrderSortColor: "#9E9E9E",
  inputOrderSort:
    workspaceStore.caseData.elements.orderKey === "inputOrder"
      ? workspaceStore.caseData.elements.order
      : "DESC",
  numberSortAscColor: "#9E9E9E",
  numberSortDescColor: "#9E9E9E",
});

// 구성요소 리스트 시간순 정렬 버튼 색
// 아이콘 명과 반대로 사용중, ASC아이콘의 화살표 방향이 DESC 같기 때문
// mdiSortClockAscendingOutline -> DESC 상태
const inputOrderBtnIcon = computed(() => {
  if (workspaceStore.caseData.elements.orderKey === "inputOrder")
    if (workspaceStore.caseData.elements.order === "DESC")
      return mdiSortClockAscendingOutline;
    else return mdiSortClockDescendingOutline;
  return mdiSortClockAscendingOutline;
});

// 구성요소 리스트 정렬
function setupSortIcons() {
  const colorObject = {
    nameSortAscColor: "#9E9E9E",
    nameSortDescColor: "#9E9E9E",
    inputOrderSortColor: "#9E9E9E",
    inputOrderSort:
      workspaceStore.caseData.elements.orderKey === "inputOrder"
        ? workspaceStore.caseData.elements.order
        : "DESC",
    numberSortAscColor: "#9E9E9E",
    numberSortDescColor: "#9E9E9E",
  };

  if (
    workspaceStore.caseData.elements.orderKey === "inputOrder" &&
    workspaceStore.caseData.elements.order === "DESC"
  ) {
    colorObject.inputOrderSortColor = stores.ts.isDarkmode
      ? "white"
      : "#212121";
    colorObject.inputOrderSort = "ASC";
  } else if (
    workspaceStore.caseData.elements.orderKey === "inputOrder" &&
    workspaceStore.caseData.elements.order === "ASC"
  ) {
    colorObject.inputOrderSortColor = stores.ts.isDarkmode
      ? "white"
      : "#212121";
    colorObject.inputOrderSort = "DESC";
  } else if (
    workspaceStore.caseData.elements.orderKey === "name" &&
    workspaceStore.caseData.elements.order === "DESC"
  ) {
    colorObject.nameSortDescColor = stores.ts.isDarkmode ? "white" : "#212121";
  } else if (
    workspaceStore.caseData.elements.orderKey === "name" &&
    workspaceStore.caseData.elements.order === "ASC"
  ) {
    colorObject.nameSortAscColor = stores.ts.isDarkmode ? "white" : "#212121";
  } else if (
    workspaceStore.caseData.elements.orderKey === "number" &&
    workspaceStore.caseData.elements.order === "DESC"
  ) {
    colorObject.numberSortDescColor = stores.ts.isDarkmode
      ? "white"
      : "#212121";
  } else if (
    workspaceStore.caseData.elements.orderKey === "number" &&
    workspaceStore.caseData.elements.order === "ASC"
  ) {
    colorObject.numberSortAscColor = stores.ts.isDarkmode ? "white" : "#212121";
  }

  sortColors.value.nameSortAscColor = colorObject.nameSortAscColor;
  sortColors.value.nameSortDescColor = colorObject.nameSortDescColor;
  sortColors.value.inputOrderSortColor = colorObject.inputOrderSortColor;
  sortColors.value.inputOrderSort = colorObject.inputOrderSort;
  sortColors.value.numberSortAscColor = colorObject.numberSortAscColor;
  sortColors.value.numberSortDescColor = colorObject.numberSortDescColor;
}
const setupSortIconsSpinner = () =>
  elementsSpinner.value?.setSpinner(setupSortIcons, "translucent")();

// 구성요소 리스트 덱시에 저장 및 아이콘 세팅
async function sortElementList(orderKey: string, order: string) {
  workspaceStore.caseData.elements.orderKey = orderKey;
  workspaceStore.caseData.elements.order = order;

  if (workspaceStore.caseData.elements.orderKey === "inputOrder") {
    Util.sortObjectArray(
      workspaceStore.caseData.elements.list,
      orderKey,
      "number",
      workspaceStore.caseData.elements.order
    );
  } else {
    Util.sortObjectArray(
      workspaceStore.caseData.elements.list,
      orderKey,
      "string",
      workspaceStore.caseData.elements.order
    );
  }

  // tldexie 저장
  await tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "elements",
    JSON.stringify(workspaceStore.caseData.elements)
  );

  setupSortIconsSpinner();
}

const sortElementListSpinner = (orderKey: string, order: string) =>
  elementsSpinner.value?.setSpinner(sortElementList)(orderKey, order);

// 드래그 되었을 때 데이터 저장
async function elementsTableChanged() {
  // tldexie 저장
  await tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "elements",
    JSON.stringify(workspaceStore.caseData.elements)
  );
}

const elementsTableChangedSpinner = () =>
  elementsSpinner.value?.setSpinner(elementsTableChanged, "translucent")();

// 구성요소 수정 모달 오픈
function openEditElementModal(id: string, e: MouseEvent) {
  // 모달의 위치가 창을 벗어나면 모달의 위치 조정

  // 구성요소 저장 후 구성요소 수정 모달에서 테이블 행 높이를 맞춰주기 위해서 스토어에 저장
  if (e.currentTarget) stores.ws.tempElement = e.currentTarget as HTMLElement;

  const modalMaxWidth = 530;
  const modalMaxHeight = 300;

  // 구성요소 모달 위치 조절
  if (elementModalTop.value + modalMaxHeight > window.innerHeight) {
    elementModalTop.value = window.innerHeight - modalMaxHeight;
    if (elementModalLeft.value + modalMaxWidth > window.innerWidth) {
      elementModalLeft.value = window.innerWidth - modalMaxWidth;
    }
  } else {
    if (elementModalLeft.value + modalMaxWidth > window.innerWidth) {
      elementModalLeft.value = window.innerWidth - modalMaxWidth;
    }
  }
  workspaceStore.elementEditorModal.left = elementModalLeft.value;
  workspaceStore.elementEditorModal.top = elementModalTop.value;

  workspaceStore.targetElementID = id;
  console.log("edit target element id:", workspaceStore.targetElementID);

  workspaceStore.elementEditorModal.show();
}

// 입력 데이터 초기화
function resetInputData() {
  tinymce.get("element-name").setContent("");
  tinymce.get("element-number").setContent("");
  tinymce.get("element-name").focus();
}

// 구성요소 명칭 입력창 엔터 핸들링
const handleNameEnter = (editor: any) => {
  editor.on("keydown", function (e: KeyboardEvent) {
    // console.log(e);
    if (e.keyCode === 229) return;

    if (e.key == "Enter" && (e.code == "Enter" || e.code == "NumpadEnter")) {
      e.preventDefault();
      e.stopPropagation();
      tinymce.get("element-number").focus();
    }
  });
};

// 구성요소 번호 입력창 엔터 핸들링
const handleNumberEnter = (editor: any) => {
  editor.on("keydown", function (e: KeyboardEvent) {
    // console.log(e);
    if (e.keyCode === 229) return;

    if (e.key == "Enter" && (e.code == "Enter" || e.code == "NumpadEnter")) {
      e.preventDefault();
      e.stopPropagation();
      saveElementDataSpinner();
    }
  });
};

async function saveElementInDexie(
  backupElements: {
    orderKey: string;
    order: "ASC" | "DESC";
    list: ElementData[];
  },
  addResult: number
) {
  if (addResult === 501) {
    tinymce.get("element-name").focus();
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/ELEMENTS_LIST/SAME_ELEMENT_ALERT"
      ),
      true
    );
  } else if (addResult === 500) {
    // 에러 발생
    tinymce.get("element-name").focus();
    // 원상태로 복구
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
      // 구성요소 변경 상태 업데이트
      workspaceStore.isElementAdded = true;
      resetInputData();

      workspaceStore.showSnackbar(
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/SAVE_SUCCESSED").replace(
          "$DATA$",
          Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/TITLE")
        ),
        "info"
      );
    } else {
      workspaceStore.showSnackbar(
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/SAVE_FAILED").replace(
          "$DATA$",
          Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/TITLE")
        ),
        "error"
      );
    }
  }
  // 구성요소 테이블 아이템 추가 효과 플래그 false
  elementTableMounted = false;
}

// 저장 클릭
async function saveElementData() {
  // 데이터 없으면 그냥 리셋해서 리턴
  // v-model에는 태그가 포함된 상태로 저장되므로 getContent로 텍스트만 가져옴
  if (
    tinymce.get("element-name").getContent({ format: "text" }).trim() === "" &&
    tinymce.get("element-number").getContent({ format: "text" }).trim() === ""
  ) {
    resetInputData();
    return;
  }

  // 명칭이 없는 경우 리턴
  if (
    tinymce.get("element-name").getContent({ format: "text" }).trim() === ""
  ) {
    tinymce.get("element-name").focus();
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/NAME_ALERT"),
      true
    );
    return;
  }

  // 번호로 000이 들어오면 리턴
  if (
    tinymce.get("element-number").getContent({ format: "text" }).trim() ===
      "000" ||
    tinymce.get("element-number").getContent({ format: "text" }).trim() ===
      "０００"
  ) {
    document.getElementById("element-name")?.focus();
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/000_ALERT"),
      true
    );
    return;
  }
  // 데이터 복구용 임시 구성요소
  const backupElements = JSON.parse(
    JSON.stringify(workspaceStore.caseData.elements)
  );

  // 구성요소 테이블 아이템 추가 효과 플래그 true
  elementTableMounted = true;

  // 스토어에 구성요소 추가 실행
  const addResult = ElementHandler.addElement(
    workspaceStore.caseData.elements,
    tinymce.get("element-name").getContent(),
    tinymce.get("element-number").getContent()
  );
  saveElementInDexie(backupElements, addResult);
}

// 스피너 세팅
const saveElementDataSpinner = () =>
  elementsSpinner.value?.setSpinner(saveElementData, "translucent")();

// 구성요소 추출 모드이면 추출 모달의 위치를 마우스 커서 위치로 만들어줌
function onMouseMoveElTable(e: MouseEvent) {
  let elementsWidthPx = elementsRef.value?.clientWidth;
  let elementsHeightPx = elementsRef.value?.clientHeight;
  let tooltipWidthPx = 200;
  let tooltipHeightPx = 50;
  let retouchWidthPx = 20;
  let retouchHeightPx = 20;

  if (elementsHeightPx && elementsWidthPx) {
    // 각 숫자 값은 모달의 높이, 넓이 보정값
    if (e.clientY + tooltipHeightPx > elementsHeightPx) {
      elementModalTop.value = e.clientY - tooltipHeightPx;
      // 298은 모달 너비
      if (e.clientX + tooltipWidthPx > window.innerWidth) {
        elementModalLeft.value = e.clientX - tooltipWidthPx;
      } else {
        elementModalLeft.value = e.clientX + retouchWidthPx;
      }
    } else {
      elementModalTop.value = e.clientY + retouchHeightPx;
      // 298은 모달 너비
      if (e.clientX + tooltipWidthPx > window.innerWidth) {
        console.log("flow");
        elementModalLeft.value = e.clientX - tooltipWidthPx;
      } else {
        elementModalLeft.value = e.clientX + retouchWidthPx;
      }
    }
  }
  // console.log(elementModalTop.value, elementModalLeft.value);
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

function closeArea() {
  workspaceStore.controlAreaShow("element");
  workspaceStore.initializeToolbar = true;
}
// props가 바뀔 때(부모에서 값이 바뀔 때)
watch(props, () => {
  modelValue.value = props.modelValue;
});

// modelValue가 바뀔 때(컴포넌트 내부에서 값이 바뀔 때)
watch(modelValue, () => {
  emit("update:modelValue", modelValue.value);
});

// 초기화 버튼 색상
const resetBtnColor = computed(() => {
  if (themeStore.isDarkmode) return Util.getColor(stores, "BUTTON_DARK");
  else return Util.getColor(stores, "BUTTON");
});

// 체크 스위치 색상
const checkElementSwitchToogleColor = computed(() => {
  if (themeStore.isDarkmode) return Util.getColor(stores, "PRIMARY_DARK");
  else return themeStore.workspacePrimary;
});

const checkElementSwitchBodyColor = computed(() => {
  if (themeStore.isDarkmode)
    return rgbToRgba(Util.getColor(stores, "PRIMARY_DARK"), ".4");
  else return rgbToRgba(themeStore.workspacePrimary, ".4");
});

watch(checkElement, () => {
  elementsSpinner.value?.onSpin();
  setTimeout(() => {
    if (checkElement.value) {
      // 상세한 설명 저장 요청 --> 덱시 저장에 딜레이가 있어서 스토어에 바로 반영 안됨 -> 아래에서 tiny데이터로 점검함
      workspaceStore.requestSaveDescription = true;

      for (let i = 0; i < workspaceStore.caseData.elements.list.length; i++) {
        let countInClaims = 0;
        let countInDescription = 0;
        if (workspaceStore.caseData.elements.list[i].itemType === "E") {
          // 분할 양식인 경우
          if (
            workspaceStore.caseMasterData.workspace_type_code_path ===
            "SETTING/DRAFT/WORKSPACE_TYPE/SPLIT"
          ) {
            for (let j = 0; j < workspaceStore.caseData.claims.length; j++) {
              // 구성요소 ID로 찾던 것에서 text로 찾는 것으로 변경
              countInClaims =
                countInClaims +
                Util.removeAllTag(workspaceStore.caseData.claims[j].body).split(
                  Util.removeAllTag(
                    workspaceStore.caseData.elements.list[i].name
                  )
                ).length -
                1;

              // const tempHTML = document.createElement("div");
              // tempHTML.innerHTML = workspaceStore.caseData.claims[j].body;
              // countInClaims =
              //   countInClaims +
              //   tempHTML.getElementsByClassName(
              //     workspaceStore.caseData.elements.list[i].elementId
              //   ).length;
            }

            const tempText =
              workspaceStore.caseData.technical_field.data +
              workspaceStore.caseData.background.data +
              workspaceStore.caseData.prior_art.data +
              workspaceStore.caseData.purpose.data +
              workspaceStore.caseData.advantages.data +
              workspaceStore.caseData.drawing_description.data +
              workspaceStore.caseData.summary.data +
              workspaceStore.caseData.industrial_applicability.data +
              workspaceStore.caseData.sequencelist.data +
              // 구성요소 ID로 찾던 것에서 text로 찾는 것으로 변경 -> 등장횟수 찾기 위한 건 text로 뽑아오면 됨
              tinymce
                .get("detailed-description")
                .getContent({ format: "text" });

            countInDescription =
              countInDescription +
              Util.removeAllTag(tempText).split(
                Util.removeAllTag(workspaceStore.caseData.elements.list[i].name)
              ).length -
              1;

            // const tempHTML2 = document.createElement("div");
            // tempHTML2.innerHTML =
            //   workspaceStore.caseData.technical_field.data +
            //   workspaceStore.caseData.background.data +
            //   workspaceStore.caseData.prior_art.data +
            //   workspaceStore.caseData.purpose.data +
            //   workspaceStore.caseData.advantages.data +
            //   workspaceStore.caseData.drawing_description.data +
            //   workspaceStore.caseData.summary.data +
            //   workspaceStore.caseData.industrial_applicability.data +
            //   workspaceStore.caseData.sequencelist.data +
            //   tinymce.get("detailed-description").getContent();
            // countInDescription =
            //   countInDescription +
            //   tempHTML2.getElementsByClassName(
            //     workspaceStore.caseData.elements.list[i].elementId
            //   ).length;
          }
          // 통합 양식인 경우
          else {
            const baseTxt = tinymce.get("detailed-description").getContent();
            let descriptionTxt = "";
            let claimTxt = "";
            let claimTitle = "";
            let abstractTitle = "";
            let splitResult = ["", ""];

            if (Util.isKIPO(stores)) {
              if (Util.isApplication(stores)) {
                claimTitle = "【청구범위】";
                abstractTitle = "【요약서】";
              } else {
                claimTitle = "【청구의 범위】";
                abstractTitle = "【요약서】";
              }
            } else if (Util.isJPO(stores)) {
              if (Util.isApplication(stores)) {
                claimTitle = "【特許請求の範囲】";
                abstractTitle = "【要約】";
              } else {
                claimTitle = "<strong>請求の範囲</strong>";
                abstractTitle = "<strong>要約</strong>";
              }
            } else if (Util.isUSPTO(stores)) {
              if (Util.isApplication(stores)) {
                claimTitle = "<strong>WHAT IS CLAIMED IS</strong>";
                abstractTitle = "<strong>ABSTRACT</strong>";
              } else {
                claimTitle = "<strong>WHAT IS CLAIMED IS</strong>";
                abstractTitle = "<strong>ABSTRACT</strong>";
              }
            }

            splitResult = Util.splitDataToClaimsAndDescription(
              baseTxt,
              claimTitle,
              abstractTitle
            );

            // 구성요소 ID 점검하는 것에서 name으로 점검하는 것으로 변경 -> tag 필요 없음
            descriptionTxt = Util.removeAllTag(splitResult[0]);
            claimTxt = Util.removeAllTag(splitResult[1]);

            if (descriptionTxt === "" || claimTxt === "") {
              Util.openInfoModal(
                stores,
                Util.changeDataInI18NTxt(
                  stores,
                  Util.getI18NTxt(
                    stores,
                    "I18N/WORKSPACE/ELEMENTS_LIST/CHECK_COUNT_ALERT"
                  ),
                  "$DATA$",
                  claimTitle
                ),
                true
              );

              return;
            }

            // 구성요소 ID 점검하는 것에서 name으로 점검하는 것으로 변경
            countInClaims =
              claimTxt.split(
                Util.removeAllTag(workspaceStore.caseData.elements.list[i].name)
              ).length - 1;
            countInDescription =
              descriptionTxt.split(
                Util.removeAllTag(workspaceStore.caseData.elements.list[i].name)
              ).length - 1;

            // countInClaims =
            //   claimTxt.split(
            //     "autocomplete " +
            //       workspaceStore.caseData.elements.list[i].elementId
            //   ).length - 1;
            // countInDescription =
            //   descriptionTxt.split(
            //     "autocomplete " +
            //       workspaceStore.caseData.elements.list[i].elementId
            //   ).length - 1;
          }
        }

        elementCountInClaimsArray.value[i] = countInClaims;
        elementCountInDescriptionArray.value[i] = countInDescription;

        if (countInClaims > 0 && countInDescription === 0)
          trBacgroundColor.value[i] = rgbToRgba("#ff0000", ".2");
        else trBacgroundColor.value[i] = "";
      }
    } else {
      for (let i = 0; i < workspaceStore.caseData.elements.list.length; i++) {
        elementCountInClaimsArray.value[i] = 0;
        elementCountInDescriptionArray.value[i] = 0;
        trBacgroundColor.value[i] = "";
      }
    }

    elementsSpinner.value?.offSpin();
  }, 300);
});

watch(workspaceStore, () => {
  // workspace에서 초기화 셋팅 작업이 끝난 다음에 데이터 로딩 진행
  if (workspaceStore.initializeElementArea) {
    initialSetupElementData();
    workspaceStore.initializeElementArea = false;
  }
});

function getBacgroundColor(index: number) {
  let returnColor = "";
  if (themeStore.isDarkmode) returnColor = "#1E1E1E";

  if (checkElement.value && trBacgroundColor.value[index] !== "")
    returnColor = trBacgroundColor.value[index];

  if (elTableHoverIndices.value[index])
    returnColor = Util.getColor(stores, "TINTED");

  return returnColor;
}

const onMouseEnterTr = (e: MouseEvent, element: ElementData, index: number) => {
  if (!isElDrag.value) isMouseEnterTr.value = true;
  elTableHoverIndices.value[index] = true;

  elementCountInClaims.value = elementCountInClaimsArray.value[index];
  elementCountInDescription.value = elementCountInDescriptionArray.value[index];
};

const onMouseLeaveTr = (e: MouseEvent, index: number) => {
  isMouseEnterTr.value = false;
  elTableHoverIndices.value[index] = false;

  if (checkElement.value) {
    elementCountInClaims.value = 0;
    elementCountInDescription.value = 0;
  }
};

// 컴포넌트 데이터 초기화
function initialSetupElementData() {
  try {
    // // 화면에 뿌려지는 list는 elements로 관리(workspaceStore.elements를 바로 보여주면 이전 케이스 정보가 보여질 수 있음)
    // elements.value = workspaceStore.elements;
    setupSortIconsSpinner();

    console.log("elements component initialized");
    // console.log(elements.value);
  } catch (e: any) {
    console.log("editelementmodal, innitialSetupElementData", e);
    Util.openAlertModal(
      stores,
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/DB_ALERT")
    );
  }
}
onMounted(() => {
  console.log("elements mounted");
  workspaceStore.elementsSpinnerRef = elementsSpinner.value;
});
</script>

<style lang="scss" scoped>
.elements {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  border: 0.0625rem solid #dfdfdf;
  background-color: white;
}

.elements-body {
  overflow: hidden;
  position: relative;
  height: calc(100% - 4rem);
}
.element-table {
  z-index: 1;
  position: relative;
  height: calc(100% - 9.5rem);

  .element-table-head {
    background: #eeeeee;

    .th {
      padding: 0.5rem;
      background: #eeeeee;

      font-size: 14px;
      font-weight: bold;
      color: #616161;
      white-space: nowrap;
    }
  }

  .element-table-body {
    overflow: overlay;
    border-top: none;
    width: 100%;
    height: calc(100% - 2rem + 0.0625rem);

    .tr {
      width: 100%;
      background-color: white;
      line-height: 14px;
      word-break: break-all;

      .td {
        overflow: overlay;
        div {
          padding-top: 0.125rem;
          width: calc(100% - 1rem);
        }
      }
      .td:nth-of-type(1) {
        width: 75%;
        padding-left: 0 !important;
      }
      .td:nth-of-type(2) {
        width: 25%;
      }
    }
    .tr:last-child {
      // border-bottom: 0 !important;
    }
  }
}

.element-table-sort-btn {
  position: absolute;
}

.elements-footer {
  width: 95%;
  height: 2rem;
}

.excel-upload-result-modal-body {
  width: 37.5rem;
  height: 37.5rem;
  overflow: hidden;
}
</style>
