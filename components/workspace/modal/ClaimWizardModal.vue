<template>
  <!-- 모달 컨텐츠 -->
  <div
    class="modal-contents d-flex flex-column"
    :style="{
      left: right ? '' : left ? left + 'px' : '',
      right: right ? '0' : '',
      top: top + 'px',
      opacity: modalOpaSliderValue,
      width: workspaceStore.claimWizardWidth,
      backgroundColor: stores.ts.isDarkmode
        ? stores.ts.darkmodePalette.backgroundColor
        : '',
    }"
  >
    <!-- 모달 헤더 -->
    <div class="d-flex align-center justify-space-between">
      <div
        class="text-400-22-black"
        :style="{
          color: stores.ts.isDarkmode ? stores.ts.darkmodePalette.color : '',
        }"
      >
        {{ modalTitle }}
      </div>

      <div class="d-flex align-center justify-space-between">
        <IconBtn
          v-if="opacityBar"
          style="margin-right: 0.3312rem"
          :color="Util.getColor(stores, 'MAIN')"
          :icon="mdiCircleOpacity"
          width="1rem"
          height="1rem"
        />
        <v-slider
          v-if="opacityBar"
          :style="{ width: '5rem', height: '1.875rem', marginRight: '1.65rem' }"
          v-model="modalOpaSliderValue"
          track-color="#7C7F90"
          :color="Util.getColor(stores, 'MAIN')"
          max="1"
          step="0.01"
          min="0.2"
        />
        <IconBtn
          class="mr-8"
          :color="themeStore.darkmodeColor"
          :icon="leftDock ? mdiDockLeft : mdiDockRight"
          @click="
            leftDock = !leftDock;
            changeWizardPosition();
          "
        />

        <IconBtn
          v-if="closeBtn"
          color="gray"
          :icon="mdiClose"
          @click="closeModal"
        />
      </div>
    </div>

    <!-- 청구항 번호, 종류 선택 영역 -->
    <div
      class="d-flex align-center my-4"
      :style="{ overflow: 'visible', whiteSpace: 'nowrap' }"
    >
      <div
        class="mr-2"
        :style="{
          color: stores.ts.isDarkmode ? stores.ts.darkmodePalette.color : '',
        }"
      >
        {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/CLAIM") }}
      </div>
      <Select
        class="mr-2"
        v-model="claimNumberValue"
        :options="claimNumberOptions"
        :disabled="claimNumberSelectDisable"
        style="height: 2.5rem"
        :selectColor="themeStore.darkmodeColor"
        :selectHoverBgColor="Util.getColor(stores, 'SUB_ACTIVE')"
        :optionsStyle="themeStore.darkmodeOptionsStyle"
        :optionHoverColor="Util.getColor(stores, 'TINTED')"
        downIcon
        show-border
        :outline-color="Util.getColor(stores, 'PRIMARY')"
      />
      <RadioBox
        class="ml-2 mr-1"
        v-model="claimType"
        value="I"
        width="1.5rem"
        height="1.5rem"
        :color="Util.getColor(stores, 'INDEPENDENT')"
        @click="changeType('I')"
      />
      <div
        class="mr-4 text-bold-14-black"
        :style="{ color: Util.getColor(stores, 'INDEPENDENT') }"
      >
        {{
          Util.getI18NTxt(
            stores,
            "I18N/WORKSPACE/CLAIMS/CLAIM_EDITOR_MODAL_INDEPENDENT"
          )
        }}
      </div>
      <RadioBox
        v-if="claimNumberValue.value !== '1'"
        class="mr-1"
        v-model="claimType"
        value="D"
        width="1.5rem"
        height="1.5rem"
        :color="Util.getColor(stores, 'PRIMARY')"
        @click="changeType('D')"
      />
      <div
        v-if="claimNumberValue.value !== '1'"
        class="mr-5 text-bold-14-black"
        :style="{ color: Util.getColor(stores, 'PRIMARY') }"
      >
        {{
          Util.getI18NTxt(
            stores,
            "I18N/WORKSPACE/CLAIMS/CLAIM_EDITOR_MODAL_DEPENDENT"
          )
        }}
      </div>
      <div
        class="d-flex align-center text-400-13-gray"
        style="
          height: max-content;
          padding-top: 0.125rem;
          flex-wrap: wrap;
          white-space: normal;
          width: 50%;
        "
        v-html="insertDesc"
      ></div>
      <input
        type="hidden"
        id="hidden-claim-number"
        v-model="claimNumberValue.value"
      />
      <input type="hidden" id="hidden-claim-type" v-model="claimType" />
    </div>

    <!-- 카테고리 영역 / USPTO인 경우-->
    <div
      v-if="
        workspaceStore.caseMasterData.format_code_path === appStore.formatUSPTO
      "
      class="mb-4"
    >
      <Editor
        inline
        id="claim-category"
        :data="category"
        :init="{
          ...workspaceStore.tinymceInlineConfig,
          placeholder: 'Category',
          setup: (ed) => {
            if (claimType === 'D') ed.mode.set('readonly');
          },
        }"
        :style="[
          inlineEditorStyle,
          {
            padding: '0.625rem',
            height: '2.6875rem',
            fontWeight: '400',
            overflow: 'overlay',
          },
        ]"
      />
    </div>

    <!-- 인용항 입력 영역 / KIPO & USPTO 인 경우 -->
    <div
      v-if="
        claimType === 'D' &&
        (workspaceStore.caseMasterData.format_code_path ===
          appStore.formatKIPO ||
          workspaceStore.caseMasterData.format_code_path ===
            appStore.formatUSPTO)
      "
      class="d-flex align-center mb-4 mr-4"
    >
      <div class="mr-2" style="width: 70%">
        <Editor
          inline
          id="quotation-text"
          :data="quotationTxt"
          cursor="pointer"
          class="ipac-editor mr-2"
          readonly
          disabled
          :init="{
            ...workspaceStore.tinymceInlineConfig,
            readonly: true,
          }"
          :placeholder="
            Util.getI18NTxt(
              stores,
              'I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_MODAL_CONTENT'
            )
          "
          :style="[
            inlineEditorStyle,
            {
              width: '100%',
              padding: '0.625rem',
              cursor: 'pointer',
              maxHeight: '4rem',
              overflow: 'overlay',
            },
          ]"
          @click="openParentClaimSelectModal"
        />
        <input type="hidden" id="hidden-parent" v-model="parentArray" />
        <!-- 인용항만 보기 -->
      </div>
      <div
        class="d-flex flex-column justify-center"
        style="width: 30%; flex-wrap: wrap"
      >
        <div
          class="d-flex justify-center ml-2 mr-2 text-400-14-black"
          style="white-space: nowrap"
          :style="{ color: themeStore.darkmodeColor }"
        >
          {{
            Util.getI18NTxt(
              stores,
              "I18N/WORKSPACE/CLAIMS/CLAIM_EDITOR_MODAL_DISPLAY_ONLY_RELATED"
            )
          }}
        </div>
        <div class="d-flex justify-center">
          <Switch
            :toggleColor="Util.getColor(stores, 'BUTTON')"
            :body-color="rgbToRgba(Util.getColor(stores, 'BUTTON'), '.4')"
            v-model="displayOnlyParents"
          />
        </div>
      </div>
    </div>

    <!-- 청구항 body 영역 -->
    <Editor
      id="claim-body"
      :init="{
        ...workspaceStore.tinymceConfig,
        height: '100%',
        setup: editorSetup,
        callback: editorInitCallback,
      }"
      :data="claimBody"
      :style="[
        {
          padding: '0.625rem',
          marginBottom: '0.75rem',
        },
      ]"
      useAutocomplete
      claimEditor
      doNotUseAutoCapitalize
    />

    <!-- 인용항 입력 영역 / JPO인 경우 -->
    <div
      v-if="
        claimType === 'D' &&
        workspaceStore.caseMasterData.format_code_path === appStore.formatJPO
      "
      class="d-flex align-center mt-4 mr-4"
    >
      <div class="mr-2" style="width: 70%">
        <Editor
          inline
          id="quotation-text"
          :data="quotationTxt"
          cursor="pointer"
          class="ipac-editor mr-2"
          readonly
          disabled
          :init="{
            ...workspaceStore.tinymceInlineConfig,
            readonly: true,
          }"
          :placeholder="
            Util.getI18NTxt(
              stores,
              'I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_MODAL_CONTENT'
            )
          "
          :style="[
            inlineEditorStyle,
            {
              width: '100%',
              padding: '0.625rem',
              cursor: 'pointer',
              maxHeight: '4rem',
              overflow: 'overlay',
            },
          ]"
          @click="openParentClaimSelectModal"
        />
        <input type="hidden" id="hidden-parent" v-model="parentArray" />
        <!-- 인용항만 보기 -->
      </div>
      <div
        class="d-flex flex-column justify-center"
        style="width: 30%; flex-wrap: wrap"
      >
        <div
          class="d-flex justify-center ml-2 mr-2 text-400-14-black"
          style="white-space: nowrap"
          :style="{ color: themeStore.darkmodeColor }"
        >
          {{
            Util.getI18NTxt(
              stores,
              "I18N/WORKSPACE/CLAIMS/CLAIM_EDITOR_MODAL_DISPLAY_ONLY_RELATED"
            )
          }}
        </div>
        <div class="d-flex justify-center">
          <Switch
            :toggleColor="Util.getColor(stores, 'BUTTON')"
            :body-color="rgbToRgba(Util.getColor(stores, 'BUTTON'), '.4')"
            v-model="displayOnlyParents"
          />
        </div>
      </div>
    </div>

    <!-- 카테고리 영역 / KIPO & JPO인 경우-->
    <div
      v-if="
        workspaceStore.caseMasterData.format_code_path ===
          appStore.formatKIPO ||
        workspaceStore.caseMasterData.format_code_path === appStore.formatJPO
      "
      class="mt-4"
    >
      <Editor
        inline
        id="claim-category"
        :data="category"
        :init="{
          ...workspaceStore.tinymceInlineConfig,
          setup: (ed) => {
            if (claimType === 'D') ed.mode.set('readonly');
          },
        }"
        :style="[
          inlineEditorStyle,
          {
            padding: '0.625rem',
            height: '2.6875rem',
            fontWeight: '400',
            overflow: 'overlay',
          },
        ]"
      />
    </div>

    <!-- 초기화, 닫기, 저장 버튼 -->
    <div>
      <div class="d-flex justify-space-between mt-4">
        <v-btn
          @click="initialSetupClaimWizard"
          flat
          border="#5c6bc0"
          :style="{
            width: '4rem',
            fontWeight: '400',
            backgroundColor: Util.getColor(stores, 'BUTTON'),
            color: Util.getColor(stores, 'BUTTON_TEXT'),
          }"
          >{{ Util.getI18NTxt(stores, "I18N/BUTTON/RESET") }}</v-btn
        >
        <div>
          <v-btn
            flat
            border="none"
            :style="{
              width: '4rem',
              color: Util.getColor(stores, 'BUTTON'),
              fontWeight: '400',
              backgroundColor: stores.ts.darkmodeBackgroundColor,
            }"
            class="mr-2"
            @click="closeModal"
            >{{ Util.getI18NTxt(stores, "I18N/BUTTON/CLOSE") }}</v-btn
          >
          <v-btn
            :style="{
              backgroundColor: Util.getColor(stores, 'BUTTON'),
              color: Util.getColor(stores, 'BUTTON_TEXT'),
            }"
            style="font-weight: 400"
            flat
            @click="saveCurrentClaimSpinner"
            >{{ Util.getI18NTxt(stores, "I18N/BUTTON/SAVE") }}</v-btn
          >
        </div>
      </div>
    </div>
    <IComponentSpinner
      ref="modalSpinner"
      :container-style="{ width: 'calc(100% - 2rem)' }"
    />
  </div>

  <!-- 인용 청구항 선택 모달 -->
  <teleport to="#modal-area">
    <Modal
      ref="parentClaimSelectModal"
      :title="
        Util.getI18NTxt(
          stores,
          'I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_MODAL_HEADER'
        )
      "
      :description="
        Util.getI18NTxt(
          stores,
          'I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_MODAL_CONTENT'
        )
      "
      buttonType="NY"
      :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CLOSE')"
      :yesTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/SAVE')"
      :yesFunc="saveParentClaim"
    >
      <div class="d-flex align-center">
        <div class="d-flex align-center" style="width: 40%">
          <CheckBox
            class="mr-2 my-4"
            id="select-all"
            width="1.75rem"
            height="1.75rem"
            :color="Util.getColor(stores, 'BUTTON')"
            v-model="selectAllClaimsAsParent"
            @click="selectParentClaim(-1)"
          /><span style="cursor: pointer" @click="selectParentClaim(-1)">{{
            Util.getI18NTxt(
              stores,
              "I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_MODAL_SELECT_ALL"
            )
          }}</span>
        </div>
        <div class="d-flex align-center justify-end" style="width: 60%">
          <div class="d-flex text-500-13-black mr-2" style="text-align: end">
            {{
              Util.getI18NTxt(
                stores,
                "I18N/WORKSPACE/CLAIMS/CHECK_MULTICLAIM_ERROR"
              )
            }}
          </div>
          <div>
            <Switch
              v-model="checkMultiClaimError"
              class="mr-1"
              :toggleColor="Util.getColor(stores, 'PRIMARY')"
              :body-color="rgbToRgba(Util.getColor(stores, 'PRIMARY'), '.4')"
            />
          </div>
        </div>
      </div>
      <div class="d-flex flex-wrap" style="width: 25rem">
        <template
          v-for="(item, idx) in workspaceStore.caseData.claims.filter((data: any) => { return data.claimNumber < parseInt(claimNumberValue.value)})"
          :key="item.no"
        >
          <div
            class="claim-select-btn d-flex justify-center align-center mr-2 mb-2"
            :style="{
              width: '1.875rem',
              height: '1.875rem',
              color: Util.getColor(stores, 'PRIMARY_TEXT'),
              backgroundColor:
                item.type === 'I'
                  ? Util.getColor(stores, 'INDEPENDENT')
                  : Util.getColor(stores, 'PRIMARY'),
              opacity: !selectedClaims[idx] ? '.2' : '1',
              cursor: 'pointer',
              fontWeight: 'bold',
            }"
            style="border-radius: 0.3rem"
            @click="selectParentClaim(idx)"
          >
            {{ item.claimNumber }}
          </div>
        </template>
      </div>
    </Modal>
  </teleport>
</template>

<script lang="ts" setup>
import * as Util from "@/assets/javascripts/ipedit_util";
import * as ClaimHandler from "@/assets/javascripts/ipedit_claim_handler";
import IconBtn from "@/components/common/IconBtn.vue";
import Modal from "@/components/common/modal/Modal.vue";
import RadioBox from "@/components/common/RadioBox.vue";
import Select from "@/components/common/Select.vue";
import Switch from "@/components/common/Switch.vue";
import Editor from "@/components/workspace/Editor.vue";
import CheckBox from "@/components/common/CheckBox.vue";
import type { ModalType } from "@/types/modal";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";

import { inlineEditorStyle } from "@/styles";
import { mdiCircleOpacity, mdiClose, mdiDockLeft, mdiDockRight } from "@mdi/js";
import { ref, watch, onBeforeMount, onMounted, onBeforeUnmount } from "vue";
import { tldexie } from "@/assets/javascripts/dexie";
import { rgbToRgba } from "@/assets/javascripts/utils/css";
import tinymce from "tinymce/tinymce";
import type { IIComponentSpinner } from "@/types/component";
import IComponentSpinner from "@/components/IComponentSpinner.vue";

const props = defineProps<{
  title?: string;
  description?: string;
  check?: boolean;
  checkTxt?: string;
  buttonType?: string;
  noTxt?: string;
  yesTxt?: string;
  yesFunc?: (e?: any) => void;
  deleteFunc?: (e?: any) => void;
  noFunc?: (e?: any) => void;
  deleteBtn?: boolean;
  left?: number;
  top?: number;
  right?: boolean;
  opacityBar?: boolean;
  closeBtn?: boolean;
  leftDock?: boolean;
}>();
const emit = defineEmits(["update:leftDock"]);

const isMounted = ref(false);
const modalSpinner = ref<IIComponentSpinner>();

// 전역 값
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

const modalOpaSliderValue = ref<number>(1);

const leftDock = ref(props.leftDock);

// 인용청구항 선택 모달
const parentClaimSelectModal = ref<HTMLElement & ModalType>();

const modalTitle = ref<string>("");

type optionType = {
  text: string;
  value: string;
};

const claimNumberValue = ref({ text: "1", value: "1" });
const claimNumberOptions = ref<optionType[]>([]);
const claimNumberSelectDisable = ref(false);
const claimType = ref<string>("I");
const insertDesc = ref<string>("");
const transition = ref<string>("");
const quotationTxt = ref<string>("");
const claimBody = ref<string>("");
const category = ref<string>("");
const parentArray = ref<number[]>([]);

const selectedClaims = ref<boolean[]>([]);
// 청구항 모두 선택 변수
const selectAllClaimsAsParent = ref(false);

// 인용항만 보기
const displayOnlyParents = ref(false);

// 멀티 인용 체크
const checkMultiClaimError = ref(true);
if (Util.getSettingValue(stores, "SETTING/DRAFT/MULTICLAIM_CHECK") === "N")
  checkMultiClaimError.value = false;

function changeWizardPosition() {
  // 레이아웃 설정값 업데이트
  workspaceStore.setSettingOption("SETTING/DRAFT/CLAIM_WIZARD_POSITON");
  // 이 함수가 호출되는 시점에서는 leftDock 값이 아직 안바뀐 상태라, not을 붙여줌
  if (!props.leftDock) workspaceStore.setSettingValue("LEFT");
  else workspaceStore.setSettingValue("RIGHT");
  workspaceStore.requestUpdateSetting = true;
}

// 인용 청구항 선택 모달 오픈
function openParentClaimSelectModal() {
  // 청구항 선택용 배열 초기화
  selectedClaims.value = [];
  const parentCandidate = workspaceStore.caseData.claims.filter((data: any) => {
    return data.claimNumber < parseInt(claimNumberValue.value.value);
  });
  for (let i = 0; i < parentCandidate.length; i++) {
    if (parentArray.value.includes(i + 1)) selectedClaims.value.push(true);
    else selectedClaims.value.push(false);
  }

  // 전체선택 초기화
  selectAllClaimsAsParent.value = false;

  // 부모 청구항 초기화는 여기서 안함(모달 띄웠다가 그냥 닫는 경우도 있으므로)

  // 모달 오픈
  parentClaimSelectModal.value.show();
}

function selectParentClaim(idx: number) {
  const tempSelectedClaims = JSON.parse(JSON.stringify(selectedClaims.value));

  // 전체 선택
  if (idx === -1) {
    for (let i = 0; i < tempSelectedClaims.length; i++) {
      tempSelectedClaims[i] = !selectAllClaimsAsParent.value;
    }

    const tempArray = [];
    for (let i = 0; i < tempSelectedClaims.length; i++) {
      if (tempSelectedClaims[i]) tempArray.push(i + 1);
    }

    // 카테고리 동일 체크
    const categoryCheckResult = ClaimHandler.checkSameCategory(
      workspaceStore.caseData.claims,
      tempArray
    );
    if (!categoryCheckResult) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(
          stores,
          "I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_ERROR_DIFFERENT_CATEGORY"
        ).replace("$NUMBER$", "1"), // 전체선택이어서, 1항으로 강제 셋팅
        true
      );

      // 체크 상태 해제 (v-model 값 변경으로 제어가 안되어서 dom으로 컨트롤함)
      document.getElementById("select-all").checked = false;

      return;
    }

    // 멀티 인용 체크(JPO인 경우에는 체크하지 않음) --> 법 바뀌어서 이제 체크함
    const multiCheckResult = ClaimHandler.checkMultiCitation(
      workspaceStore.caseData.claims,
      tempArray
    );

    if (!multiCheckResult.isValid) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(
          stores,
          "I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_ERROR_MULTISELECT"
        ).replace("$NUMBER$", multiCheckResult.invalidClaimNumber),
        true
      );

      // 체크 상태 해제 (v-model 값 변경으로 제어가 안되어서 dom으로 컨트롤함)
      document.getElementById("select-all").checked = false;
      return;
    }

    selectAllClaimsAsParent.value = !selectAllClaimsAsParent.value;
    for (let i = 0; i < selectedClaims.value.length; i++) {
      selectedClaims.value[i] = selectAllClaimsAsParent.value;
    }
  }
  // 항마다 선택
  else {
    tempSelectedClaims[idx] = !tempSelectedClaims[idx];

    const tempArray = [];
    for (let i = 0; i < tempSelectedClaims.length; i++) {
      if (tempSelectedClaims[i]) tempArray.push(i + 1);
    }

    // 카테고리 동일 체크
    const categoryCheckResult = ClaimHandler.checkSameCategory(
      workspaceStore.caseData.claims,
      tempArray
    );
    if (!categoryCheckResult) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(
          stores,
          "I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_ERROR_DIFFERENT_CATEGORY"
        ).replace("$NUMBER$", idx + 1),
        true
      );

      // 체크 상태 해제 (v-model 값 변경으로 제어가 안되어서 dom으로 컨트롤함)
      document.getElementById("select-all").checked = false;

      return;
    }

    // 멀티 인용 체크
    // 설정에서 체크한다고 선택한 경우만 체크함
    if (checkMultiClaimError.value) {
      const multiCheckResult = ClaimHandler.checkMultiCitation(
        workspaceStore.caseData.claims,
        tempArray
      );

      if (!multiCheckResult.isValid) {
        Util.openInfoModal(
          stores,
          Util.getI18NTxt(
            stores,
            "I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_ERROR_MULTISELECT"
          ).replace("$NUMBER$", multiCheckResult.invalidClaimNumber),
          true
        );

        // 체크 상태 해제 (v-model 값 변경으로 제어가 안되어서 dom으로 컨트롤함)
        document.getElementById("select-all").checked = false;

        return;
      }
    }

    selectedClaims.value[idx] = !selectedClaims.value[idx];

    if (selectedClaims.value.includes(false))
      selectAllClaimsAsParent.value = false;
    else selectAllClaimsAsParent.value = true;
  }
}

// 인용 청구항 선택 완료
function saveParentClaim() {
  // 선택된 청구항이 없으면 리턴
  if (!selectedClaims.value.includes(true)) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_MODAL_CONTENT"
      ),
      true
    );
    return;
  }

  // 부모 청구항 초기화
  parentArray.value = [];

  for (let i = 0; i < selectedClaims.value.length; i++) {
    if (selectedClaims.value[i]) parentArray.value.push(i + 1);
  }

  // 청구항 인용 문구 셋팅
  tinymce
    .get("quotation-text")
    .setContent(
      ClaimHandler.makeQuotationText(
        workspaceStore.caseMasterData.format_code_path,
        Util.getIdiomData(stores, "DR_IDIOM/TEMPLATE/CLAIM_CITATION/C1"),
        Util.getIdiomData(stores, "DR_IDIOM/TEMPLATE/CLAIM_CITATION/C2"),
        Util.getIdiomData(
          stores,
          "DR_IDIOM/TEMPLATE/CLAIM_CITATION/C3_CONTINUOUS"
        ),
        Util.getIdiomData(
          stores,
          "DR_IDIOM/TEMPLATE/CLAIM_CITATION/C3_NONCONTINUOUS"
        ),
        parentArray.value
      )
    );

  // 작성화면의 카테고리를 선택된 부모항 중 첫번째 청구항과 일치시켜줌
  let parentCategory = Util.removePTag(
    workspaceStore.caseData.claims[parentArray.value[0] - 1].category.trim()
  );
  parentCategory = "<p>" + Util.changeAtoThe(parentCategory) + "</p>";

  tinymce.get("claim-category").setContent(parentCategory);

  // 모달 닫기
  parentClaimSelectModal.value.hide();
}

function closeModal() {
  workspaceStore.updateWizardData = false;
  workspaceStore.setTargetClaimNumber(0);
  workspaceStore.claimWizardModal.hide();
}

async function saveCurrentClaim() {
  // 종속항인데, 부모청구항 선택 안되어 있으면 리턴
  if (claimType.value === "D" && parentArray.value.length === 0) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM"),
      true
    );
    return;
  }

  // 카테고리 입력 안되어 있으면 리턴
  if (
    tinymce.get("claim-category").getContent({ format: "text" }).trim() === ""
  ) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/REQUEST_CATEGORY"),
      true
    );
    return;
  }

  // 백업용 임시 청구항
  let backupClaims = JSON.parse(JSON.stringify(workspaceStore.caseData.claims));

  let tempQuotationTxt = "";
  if (claimType.value === "D")
    tempQuotationTxt = tinymce.get("quotation-text").getContent();

  // 마지막에 들어간 빈줄 제거
  let bodyTxt = tinymce.get("claim-body").getContent();
  while (
    bodyTxt.length >= 13 &&
    bodyTxt.substring(bodyTxt.length - 13, bodyTxt.length) === "<p>&nbsp;</p>"
  ) {
    bodyTxt = bodyTxt.substring(0, bodyTxt.length - 13).trim();
  }
  tinymce.get("claim-body").setContent(bodyTxt);

  const claimData = {
    claimNumber: parseInt(claimNumberValue.value.value),
    type: claimType.value,
    parentArray: parentArray.value,
    quotationTxt: tempQuotationTxt,
    transition: transition.value,
    body: bodyTxt,
    category: tinymce.get("claim-category").getContent(),
    fold: false,
    show: true,
  };

  if (workspaceStore.claimWizardWorkType === "new") {
    workspaceStore.caseData.claims = ClaimHandler.saveClaim(
      workspaceStore.caseData.claims,
      0,
      claimData,
      "A",
      stores
    );

    // 창 안닫고 update 모드로 변경함
    workspaceStore.claimWizardWorkType = "update";
    workspaceStore.targetClaimNumber = claimData.claimNumber;
    initialSetupClaimWizard();
  } else if (workspaceStore.claimWizardWorkType === "insert") {
    // TODO: saveClaim에 quatationTxt 바꾸는거도 넣어야 한다  --> 2022.08.27. JHY 왜 남긴건지 모르겠다...
    workspaceStore.caseData.claims = ClaimHandler.saveClaim(
      workspaceStore.caseData.claims,
      claimData.claimNumber,
      claimData,
      "I",
      stores
    );

    // 창 안닫고 update 모드로 변경함
    workspaceStore.claimWizardWorkType = "update";
    workspaceStore.targetClaimNumber = claimData.claimNumber;
    initialSetupClaimWizard();
  } else if (workspaceStore.claimWizardWorkType === "update") {
    // console.log(claimData);
    workspaceStore.caseData.claims = ClaimHandler.saveClaim(
      workspaceStore.caseData.claims,
      claimData.claimNumber,
      claimData,
      "U",
      stores
    );
  }

  // tldexie 저장
  const result = await tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "claims",
    JSON.stringify(workspaceStore.caseData.claims)
  );
  if (result) {
    workspaceStore.showSnackbar(
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/CLAIMS/CLAIM_SAVE_SUCCESS"
      ).replace("$DATA$", claimData.claimNumber + ""),
      "info"
    );
  } else {
    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/UPDATE_FAILED").replace(
        "$DATA$",
        ""
      ),
      "error"
    );
  }
  tinymce
    .get("claim-body")
    .selection.select(tinymce.get("claim-body").getBody(), true);
  tinymce.get("claim-body").selection.collapse(false);
}

const saveCurrentClaimSpinner = () =>
  modalSpinner.value?.setSpinner(saveCurrentClaim, "translucent")();

function initialSetupClaimWizard() {
  // console.log(workspaceStore.claimWizardWorkType);

  // 신규 청구항 셋팅
  if (
    workspaceStore.claimWizardWorkType === "new" ||
    workspaceStore.claimWizardWorkType === "insert"
  ) {
    // 삽입 모드이면, 청구항 번호 select에 watch 붙은게 동작하게 해서 자동으로 "삽입" 모드가 되도록 설정
    if (workspaceStore.claimWizardWorkType === "insert") isMounted.value = true;

    // 기본 제목
    modalTitle.value = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/CLAIM_EDITOR_MODAL_HEADER"
    );

    claimNumberSelectDisable.value = false;

    // select option 초기화
    claimNumberOptions.value = [];
    for (let i = 1; i < workspaceStore.caseData.claims.length + 1; i++) {
      claimNumberOptions.value.push({
        text: i + 1 + "",
        value: i + 1 + "",
      });
    }

    // 청구항 추가 또는 삽입용 기본값들 셋팅
    claimType.value = "I";
    parentArray.value = [];
    quotationTxt.value = "";
    claimBody.value = "";

    insertDesc.value = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/INSERT_GUIDE"
    );

    // claimNumberValue 값의 변화에 따라(watch) modalTitle하고 insertDesc가 달라지기 때문에
    // 'new' 용으로 modalTitle 및 insertDesc가 셋팅된 다음에 claimNumberValue 값을 설정해 줌
    if (workspaceStore.claimWizardWorkType === "new")
      claimNumberValue.value = {
        text: workspaceStore.caseData.claims.length + 1 + "",
        value: workspaceStore.caseData.claims.length + 1 + "",
      };
    else
      claimNumberValue.value = {
        text: workspaceStore.targetClaimNumber + "",
        value: workspaceStore.targetClaimNumber + "",
      };

    category.value = "";

    setTinyData();
  } else if (workspaceStore.claimWizardWorkType === "update") {
    modalTitle.value = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/EDIT_CLAIM"
    );

    claimNumberOptions.value = [];
    for (let i = 1; i < workspaceStore.caseData.claims.length + 1; i++) {
      claimNumberOptions.value.push({
        text: i + 1 + "",
        value: i + 1 + "",
      });
    }

    claimNumberValue.value = {
      text: workspaceStore.targetClaimNumber + "",
      value: workspaceStore.targetClaimNumber + "",
    };

    claimNumberSelectDisable.value = true;

    claimType.value =
      workspaceStore.caseData.claims[workspaceStore.targetClaimNumber - 1].type;
    if (claimType.value === "D") {
      parentArray.value =
        workspaceStore.caseData.claims[
          workspaceStore.targetClaimNumber - 1
        ].parentArray;
      quotationTxt.value =
        workspaceStore.caseData.claims[
          workspaceStore.targetClaimNumber - 1
        ].quotationTxt;
    }
    claimBody.value =
      workspaceStore.caseData.claims[workspaceStore.targetClaimNumber - 1].body;

    category.value =
      workspaceStore.caseData.claims[
        workspaceStore.targetClaimNumber - 1
      ].category;

    // console.log(quotationTxt.value, category.value);

    setTinyData();
  }
}

function setTinyData() {
  // 청구범위 리스트 영역에서 떠 있는 마법사 화면의 데이터를 바꾸는 경우에는 tiny에디터 값 변경이 필요함
  // console.log(workspaceStore.updateWizardData);
  if (workspaceStore.updateWizardData) {
    tinymce.get("quotation-text")?.setContent(quotationTxt.value);
    tinymce.get("claim-body")?.setContent(claimBody.value);
    tinymce.get("claim-category")?.setContent(category.value);

    if (claimType.value === "D")
      tinymce.get("claim-category")?.mode.set("readonly");
    else tinymce.get("claim-category")?.mode.set("design");

    // 바디에 포커스 주고 커서 위치시킴
    tinymce.get("claim-body")?.focus();
    tinymce
      .get("claim-body")
      ?.selection.select(tinymce.get("claim-body")?.getBody(), true);
    tinymce.get("claim-body")?.selection.collapse(false);
  }
}

onBeforeMount(() => {
  initialSetupClaimWizard();
});

onBeforeUnmount(() => {
  // 인용항만 보기 해제 하기 위한 값
  workspaceStore.displayOnlyParents = false;
  workspaceStore.isWizardClosing = true;

  workspaceStore.parentArray = [];

  // workspace에 포커스를 강제로 주기 위함
  document.getElementById("hidden-input")?.focus();
});

onMounted(() => {
  // watch 제어를 위해 마운트된 상태에 대한 flag를 줌
  isMounted.value = true;
});

// 독립항, 종속항 변경에 따른 핸들링
function changeType(gubun: string) {
  // 종속항으로 변경되면 인용항 선택 모달 자동 팝업
  // --> 나중에 고객 반응보고 추가하던가 하자
  if (gubun === "D") {
    // openParentClaimSelectModal();
    tinymce.get("claim-category").mode.set("readonly");
  } else {
    tinymce.get("claim-category").mode.set("design");
  }

  // 카테고리 초기화
  category.value = "";
  tinymce.get("claim-category").setContent("");

  // 부모항 배열 초기화
  parentArray.value = [];
  // 인용문구 초기화
  quotationTxt.value = "";
  // tinymce.get("quotation-text").setContent("");

  // 청구항 바디는 초기화 하지 않음
  tinymce.get("claim-body").focus();
}

// 청구항 번호 변경 시 핸들링
watch(claimNumberValue, () => {
  // 아직 마운트 안되었으면 동작 안함
  if (!isMounted.value) return;

  // 청구항 수정인 경우에는 동작 안함
  if (workspaceStore.claimWizardWorkType === "update") return;

  // console.log("claimNumberChanged: ", claimNumberValue.value);

  if (
    parseInt(claimNumberValue.value.value) <=
    workspaceStore.caseData.claims.length
  ) {
    modalTitle.value = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/INSERT_CLAIM_MODAL_HEADER"
    );

    workspaceStore.claimWizardWorkType = "insert";

    if (Util.isKIPO(stores))
      insertDesc.value = Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/CLAIMS/CLAIM_EDITOR_MODAL_GUIDANCE_INSERT_POSITION"
      ).replace(
        "$NUMBER$로",
        claimNumberValue.value.value +
          Util.setJosa(claimNumberValue.value.value, "로")
      );
    else
      insertDesc.value = Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/CLAIMS/CLAIM_EDITOR_MODAL_GUIDANCE_INSERT_POSITION"
      ).replace("$NUMBER$", claimNumberValue.value.value);
  } else {
    workspaceStore.claimWizardWorkType = "new";

    modalTitle.value = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/CLAIM_EDITOR_MODAL_HEADER"
    );

    insertDesc.value = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/INSERT_GUIDE"
    );
  }
});

// 독립항만 보기 컨트롤
watch(displayOnlyParents, () => {
  workspaceStore.displayOnlyParents = displayOnlyParents.value;

  if (parentArray.value) workspaceStore.parentArray = parentArray.value;
  else workspaceStore.parentArray = [];
});

// 마법사가 열려있는데, 다른 청구항 편집 누르는 경우
watch(workspaceStore, () => {
  if (workspaceStore.updateWizardData) {
    initialSetupClaimWizard();

    workspaceStore.updateWizardData = false;
  }
});

watch(leftDock, (newValue) => {
  console.log("newValue: ", newValue);
  emit("update:leftDock", newValue);
});

watch(props, () => {
  console.log("props.leftDock: ", props.leftDock);
  leftDock.value = props.leftDock;
});

watch(checkMultiClaimError, () => {
  if (isMounted.value) {
    // 멀티 인용 체크값 업데이트
    workspaceStore.setSettingOption("SETTING/DRAFT/MULTICLAIM_CHECK");
    if (checkMultiClaimError.value) workspaceStore.setSettingValue("Y");
    else workspaceStore.setSettingValue("N");
    workspaceStore.requestUpdateSetting = true;
  }
});

const editorSetup = (editor: any) => {
  editor.on("keydown", function (e) {
    // console.log(e);
    if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      saveCurrentClaimSpinner();
    }
  });
};

// Editor.vue에서 tinymce init이 완료된 후 실행할 함수
const editorInitCallback = (editor: any) => {
  // 아래 3줄 -> 입력된 내용 맨 뒤에 포커스 줌
  // 자동완성 태그가 제일 뒤에 있으면 커서 날라감. 지금처럼 .focus를 앞에 둬야 그나마 덜 꼬임
  tinymce.activeEditor.focus();
  tinymce.activeEditor.selection.select(tinymce.activeEditor.getBody(), true);
  tinymce.activeEditor.selection.collapse(false);
};
</script>

<style lang="scss" scoped>
::v-deep(.v-slider-thumb__surface) {
  height: 0.625rem;
  width: 0.625rem;
}

::v-deep(.v-slider-track) {
  height: 0.25rem !important;
}

.modal-contents {
  padding: 1.719rem 1.5rem 1rem 1.5rem;
  position: absolute;
  height: calc(100% - 7.875rem);
  opacity: 1;
  z-index: 1;
  background-color: white;
  box-shadow: 0rem 0.25rem 1.25rem rgba(0, 0, 0, 0.25);
  border-radius: 0.5rem;
  .checkBox {
    width: 1rem;
    height: 1rem;
    border: 0.125rem solid #bcbcbc;
    border-radius: 0.25rem;
  }
}
</style>
