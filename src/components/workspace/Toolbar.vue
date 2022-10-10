<template>
  <div
    class="workspace-toolbar d-flex justify-space-between"
    :style="{ '--color-sub': Util.getColor(stores, 'SUB') }"
  >
    <div class="d-flex align-center">
      <!-- 저장 -->
      <IconSelect
        v-if="!isReadonlyWindow"
        class="ml-4"
        :icon="mdiContentSaveOutline"
        :options="saveIconSelectOptions"
        :selectColor="Util.getColor(stores, 'SUB_TEXT')"
        :selectHoverBgColor="Util.getColor(stores, 'SUB_ACTIVE')"
        :selectClass="['text-500-12-white']"
        :optionsClass="['text-500-12-black']"
        :optionsStyle="themeStore.darkmodeOptionsStyle"
        :hoverColor="Util.getColor(stores, 'TINTED')"
        :disabled="workspaceStore.claimWizardModal.isOpen ? true : false"
      />
      <Divider
        class="workspace-toolbar-divider"
        :style="{ height: '60%' }"
        :bgColor="Util.getColor(stores, 'DIVIDER')"
        :bdColor="Util.getColor(stores, 'DIVIDER')"
        vertical
      />

      <!-- 글꼴 설정 -->
      <div
        :style="{ minWidth: '6.025rem' }"
        class="d-flex align-center justify-space-between mx-1"
      >
        <Select
          class="my-1"
          v-model="fontFamilySelectValue"
          :options="fontFamilySelectOptions"
          :style="{ width: '11rem', color: 'white' }"
          :selectStyle="{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: Util.getColor(stores, 'SUB_TEXT'),
            height: '1.5rem',
          }"
          :selectColor="Util.getColor(stores, 'SUB_TEXT')"
          :selectHoverBgColor="Util.getColor(stores, 'SUB_ACTIVE')"
          :optionsStyle="themeStore.darkmodeOptionsStyle"
          :optionHoverColor="Util.getColor(stores, 'TINTED')"
          downFullIcon
        />
      </div>
      <Divider
        class="workspace-toolbar-divider"
        :style="{ height: '60%' }"
        vertical
        :bgColor="Util.getColor(stores, 'DIVIDER')"
        :bdColor="Util.getColor(stores, 'DIVIDER')"
      />

      <!-- 글자 크기 설정 -->
      <div
        :style="{ minWidth: '3.625rem' }"
        class="d-flex align-center justify-space-between mx-1"
      >
        <Select
          v-model="fontSizeSelectValue"
          :options="fontSizeSelectOptions"
          :selectStyle="{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: Util.getColor(stores, 'SUB_TEXT'),
            height: '24px',
          }"
          :selectColor="Util.getColor(stores, 'SUB_TEXT')"
          :selectHoverBgColor="Util.getColor(stores, 'SUB_ACTIVE')"
          :optionsStyle="themeStore.darkmodeOptionsStyle"
          :optionHoverColor="Util.getColor(stores, 'TINTED')"
          downFullIcon
        />
      </div>
      <Divider
        :style="{ height: '60%' }"
        vertical
        :bgColor="Util.getColor(stores, 'DIVIDER')"
        :bdColor="Util.getColor(stores, 'DIVIDER')"
      />

      <!-- AI 문장 검색 -->
      <div
        v-if="!isReadonlyWindow"
        class="workspace-toolbar-btn px-3 py-1 mr-1"
        :style="{
          fontSize: '0.75rem',
          whiteSpace: 'nowrap',
          color: Util.getColor(stores, 'REVERSE_BUTTON_TEXT'),
          backgroundColor: Util.getColor(stores, 'REVERSE_BUTTON'),
        }"
        @click="
          () => {
            if (!workspaceStore.claimWizardModal.isOpen) {
              aiSearchModal?.show();
            }
          }
        "
      >
        {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/TOOLBAR/AI_SEARCH") }}
      </div>

      <!-- 기재불비 검토 -->
      <div
        v-if="!isReadonlyWindow"
        class="workspace-toolbar-btn px-3 py-1"
        :style="{
          fontSize: '0.75rem',
          whiteSpace: 'nowrap',
          color: Util.getColor(stores, 'REVERSE_BUTTON_TEXT'),
          backgroundColor: Util.getColor(stores, 'REVERSE_BUTTON'),
        }"
        @click="
          () => {
            if (!workspaceStore.claimWizardModal.isOpen) {
              gijaeBulbiModal?.show();
            }
          }
        "
      >
        {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/TOOLBAR/CHECK_FORMALITY") }}
      </div>

      <Divider
        v-if="!isReadonlyWindow"
        class="workspace-toolbar-divider"
        :style="{ height: '60%' }"
        vertical
        :bgColor="Util.getColor(stores, 'DIVIDER')"
        :bdColor="Util.getColor(stores, 'DIVIDER')"
      />

      <!-- 사용팁 -->
      <div
        v-if="!isReadonlyWindow"
        class="workspace-toolbar-btn px-3 py-1"
        :style="{
          fontSize: '0.75rem',
          whiteSpace: 'nowrap',
          color: Util.getColor(stores, 'REVERSE_BUTTON_TEXT'),
          backgroundColor: Util.getColor(stores, 'REVERSE_BUTTON'),
        }"
        @click="tipForUseModal?.show"
      >
        <div class="d-flex align-center">
          <img
            class="mr-1"
            src="@/assets/images/blub.svg"
            style="width: 0.875rem; height: 0.875rem"
          />
          {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/TOOLBAR/TIPS") }}
        </div>
      </div>
    </div>
    <div class="d-flex align-center">
      <template v-for="(area, index) in workspaceStore.areaData" :key="index">
        <div
          class="mr-3 text-bold-12-white"
          v-if="true"
          :style="{ color: Util.getColor(stores, 'SUB_TEXT') }"
          :key="index"
        >
          {{ setupAreaTitle(area.id) }}
        </div>
        <Switch
          v-model="areaToggle[index]"
          class="mr-5 mt-1"
          :toggleColor="Util.getColor(stores, 'SECONDARY')"
          :labelColor="Util.getColor(stores, 'SUB_TEXT')"
          :bodyColor="rgbToRgba(Util.getColor(stores, 'SECONDARY'), '.4')"
          :disabled="workspaceStore.claimWizardModal.isOpen ? true : false"
          @click="setupAreaShow(area.id)"
        />
      </template>

      <Divider
        class="workspace-toolbar-divider"
        :style="{ height: '60%' }"
        vertical
        :bgColor="Util.getColor(stores, 'DIVIDER')"
        :bdColor="Util.getColor(stores, 'DIVIDER')"
      />

      <!-- 백업파일 업로드 -->
      <!-- <IconBtn
        class="mr-2"
        :color="Util.getColor(stores, 'SUB_TEXT')"
        :icon="mdiTrayArrowUp"
      ></IconBtn> -->

      <!-- 백업파일 다운로드 -->
      <IconSelect
        :icon="mdiTrayArrowDown"
        v-model="downloadSelectValue"
        :options="downloadSelectOptions"
        :selectColor="Util.getColor(stores, 'SUB_TEXT')"
        :selectHoverBgColor="Util.getColor(stores, 'SUB_ACTIVE')"
        :selectClass="['text-500-12-white']"
        :optionsClass="['text-500-12-black']"
        :optionsStyle="themeStore.darkmodeOptionsStyle"
        :hoverColor="Util.getColor(stores, 'TINTED')"
        :disabled="workspaceStore.claimWizardModal.isOpen ? true : false"
        right
      >
      </IconSelect>
      <Divider
        class="workspace-toolbar-divider"
        :style="{ height: '60%' }"
        vertical
        :bgColor="Util.getColor(stores, 'DIVIDER')"
        :bdColor="Util.getColor(stores, 'DIVIDER')"
      />

      <!-- 다크모드 버튼 -->
      <DarkModeBtn
        class="mr-2"
        v-model="themeStore.isDarkmode"
        @click="changeDarkMode"
      />

      <!-- 통합설정 -->
      <IconSelect
        v-if="!isReadonlyWindow"
        class="mr-4"
        :icon="mdiCog"
        :options="settingSelectOptions"
        :selectColor="Util.getColor(stores, 'SUB_TEXT')"
        :selectHoverBgColor="Util.getColor(stores, 'SUB_ACTIVE')"
        :selectClass="['text-500-12-white']"
        :optionsClass="['text-500-12-black']"
        :optionsStyle="themeStore.darkmodeOptionsStyle"
        :hoverColor="Util.getColor(stores, 'TINTED')"
        :disabled="workspaceStore.claimWizardModal.isOpen ? true : false"
        right
      >
      </IconSelect>
    </div>
  </div>

  <!-- 모달 영역 -->
  <teleport to="#modal-area">
    <!-- AiSearchModal -->
    <AiSearchModal
      ref="aiSearchModal"
      :title="
        Util.getI18NTxt(
          stores,
          'I18N/WORKSPACE/DETAILED_DESCRIPTION/AI_SEARCH_MODAL_HEADER'
        )
      "
      buttonType="N"
      :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CLOSE')"
      opacityBar
      closeBtn
    >
    </AiSearchModal>

    <!-- 데이터 불러오기 모달 -->
    <Modal
      ref="dataLoadModal"
      :title="Util.getI18NTxt(stores, 'I18N/WORKSPACE/TOOLBAR/IMPORT')"
      buttonType="NY"
      :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CLOSE')"
      :yesTxt="Util.getI18NTxt(stores, 'I18N/WORKSPACE/TOOLBAR/IMPORT')"
      :yesFunc="onClickYesBtnInDataLoadModal"
      closeBtn
    >
      <div class="data-load-modal-body">
        <input
          id="backupFileLoadInput"
          type="file"
          ref="backupFileLoadInputRef"
          style="position: absolute; width: 0; height: 0; visibility: none"
          @change="onChangeBackupFileLoadInput"
        />
        <RadioBox
          v-model="dataLoadModalRadioBoxValue"
          :value="dataLoadModalRadioBoxOptions[0]"
          :label="
            Util.getI18NTxt(
              stores,
              'I18N/WORKSPACE/TOOLBAR/IMPORT_FROM_OTHER_CASE'
            )
          "
          :labelStyle="{
            color: themeStore.darkmodeColor,
            fontWeight: 400,
            fontSize: '0.875rem',
          }"
          :color="Util.getColor(stores, 'PRIMARY')"
        >
        </RadioBox>
        <!-- 다른 케이스 데이터 불러오기 셀렉트 -->
        <Select
          class="ml-7 mt-2"
          style="height: 2.5rem; margin-bottom: 1.5rem"
          v-model="anotherCaseSelectValue"
          :options="anotherCaseSelectOptions"
          :outline-color="Util.getColor(stores, 'PRIMARY')"
          :selectHoverBgColor="Util.getColor(stores, 'SUB_ACTIVE')"
          :optionHoverColor="Util.getColor(stores, 'TINTED')"
          :optionsStyle="themeStore.darkmodeOptionsStyle"
          :disabled="dataLoadModalRadioBoxValue !== 0"
          :selectStyle="{
            fontSize: '0.75rem',
            fontWeight: 500,
            height: '1.5rem',
          }"
          show-border
          downFullIcon
        />
        <RadioBox
          v-model="dataLoadModalRadioBoxValue"
          :value="dataLoadModalRadioBoxOptions[1]"
          :label="
            Util.getI18NTxt(
              stores,
              'I18N/WORKSPACE/TOOLBAR/IMPORT_FROM_BACKUP_FILE'
            )
          "
          :labelStyle="{
            color: themeStore.darkmodeColor,
            fontWeight: 400,
            fontSize: '0.875rem',
          }"
          :color="Util.getColor(stores, 'PRIMARY')"
        >
        </RadioBox>
        <div class="d-flex align-center mt-2 ml-7 mb-5">
          <v-btn
            class="mr-2"
            :style="{
              backgroundColor: themeStore.darkmodeBackgroundColor,
              border:
                dataLoadModalRadioBoxValue === 1
                  ? '1px solid ' + Util.getColor(stores, 'PRIMARY')
                  : '',
              color: Util.getColor(stores, 'PRIMARY'),
            }"
            :disabled="dataLoadModalRadioBoxValue !== 1"
            flat
            @click="onClickLoadBackupFileBtn"
          >
            {{
              Util.getI18NTxt(
                stores,
                "I18N/WORKSPACE/TOOLBAR/SELECT_BACKUP_FILE"
              )
            }}
          </v-btn>
          <div
            class="d-flex justify-space-between align-center text-400-14-black"
            v-if="backupFile"
            :style="{
              outline: colors.BORDER,
            }"
            style="
              width: 100%;
              height: 36px;
              padding: 0 12px;
              line-height: 36px;
              border-radius: 4px;
            "
          >
            {{ backupFile?.name }}
            <v-icon
              class="point-button"
              :icon="mdiTrashCan"
              :color="colors.GRAY"
              @click="backupFile = undefined"
            />
          </div>
        </div>
      </div>
    </Modal>

    <!-- 저장 슬롯 관리 모달 -->
    <Modal
      ref="saveSlotModal"
      :title="
        Util.getI18NTxt(stores, 'I18N/WORKSPACE/TOOLBAR/VERSION_MODAL_HEADER')
      "
      :description="
        Util.getI18NTxt(stores, 'I18N/WORKSPACE/TOOLBAR/VERSION_MODAL_CONTENT')
      "
      buttonType="NY"
      :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CLOSE')"
      :yesTxt="
        Util.getI18NTxt(
          stores,
          'I18N/WORKSPACE/TOOLBAR/VERSION_MODAL_SLOT_CHANGE_BUTTON'
        )
      "
      :yesFunc="onClickYesBtnInSaveSlotModal"
    >
      <div class="save-slot-modal-body">
        <div class="text-400-14-gray" style="margin-bottom: 1.5rem">
          {{
            Util.getI18NTxt(
              stores,
              "I18N/WORKSPACE/TOOLBAR/VERSION_MODAL_AUTOSAVE_SLOT"
            )
          }}: {{ slotAutoSaveTxt }}
        </div>
        <template v-for="n in 3" :key="n">
          <div class="point-button d-flex align-center mb-4">
            <RadioBox
              v-model="saveSlotRadioBoxValue"
              :value="n - 1"
              class="mr-4"
              style="width: 1.5rem; height: 1.5rem"
              :color="Util.getColor(stores, 'PRIMARY')"
              type="radio"
              :checked="
                workspaceStore.active_save_slot === n
                  ? 'checked'
                  : 'not-checked'
              "
            />

            <div
              class="d-flex justify-space-between align-center pl-4"
              style="
                width: 35rem;
                height: 4.5rem;
                border-radius: 0.5rem;
                cursor: pointer;
              "
              :style="{
                outline: saveSlotCardBorder(n - 1),
                color: saveSlotCardColor(n - 1),
                backgroundColor: saveSlotCardBgColor(n - 1),
              }"
              @click="saveSlotRadioBoxValue = n - 1"
              @mouseenter="isShowLoadBtns[n - 1] = true"
              @mouseleave="isShowLoadBtns[n - 1] = false"
            >
              <div class="d-flex flex-column">
                <div
                  class="mb-"
                  :class="
                    saveSlotRadioBoxOptions &&
                    saveSlotRadioBoxOptions[n - 1].save_time
                      ? 'text-bold-14-black'
                      : 'text-bold-14-gray'
                  "
                >
                  SLOT #{{ n - 1 }}
                </div>
                <div
                  v-if="
                    saveSlotRadioBoxOptions &&
                    saveSlotRadioBoxOptions[n - 1].save_time
                  "
                  class="text-400-14-black"
                >
                  {{
                    Util.getI18NTxt(
                      stores,
                      "I18N/WORKSPACE/TOOLBAR/VERSION_MODAL_LAST_SAVE"
                    )
                  }}:
                  {{ slotLastSaveTimeTxt(n - 1) }}
                </div>
                <div class="text-400-14-gray" v-else>
                  {{
                    Util.getI18NTxt(
                      stores,
                      "I18N/WORKSPACE/TOOLBAR/VERSION_MODAL_EMPTY_SLOT"
                    )
                  }}
                </div>
              </div>
              <!-- 불러오기 버튼
                1. 현재 슬롯 아님 &&
                2. 마우스 호버 &&
                3. 저장 시간이 있어야 함
               -->
              <v-btn
                v-if="
                  workspaceStore.active_save_slot !== n &&
                  isShowLoadBtns[n - 1] &&
                  saveSlotRadioBoxOptions &&
                  saveSlotRadioBoxOptions[n - 1].save_time
                "
                class="pa-0 px-2 mr-4 d-flex align-center justify-center"
                :style="{
                  width: 'max-content',
                  border: '1px solid ' + Util.getColor(stores, 'BUTTON'),
                  color: Util.getColor(stores, 'BUTTON'),
                }"
                flat
                @click.stop="onClickLoadBtnInSlotCard(n)"
              >
                {{
                  Util.getI18NTxt(
                    stores,
                    "I18N/WORKSPACE/TOOLBAR/VERSION_MODAL_LOAD_BUTTON"
                  )
                }}
              </v-btn>
            </div>
          </div>
        </template>
      </div>
    </Modal>

    <!-- 필수 사용 팁 모달 -->
    <Modal
      ref="tipForUseModal"
      :title="Util.getI18NTxt(stores, 'I18N/WORKSPACE/TOOLBAR/TIPS')"
      buttonType="N"
      :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CLOSE')"
    >
      <div class="tip-for-use-modal-body">
        <div
          class="tip-for-use-table d-flex flex-column align-center"
          :style="{ border: themeStore.darkmodeBorder }"
        >
          <div
            v-for="(keys, i) in useForTipKeys"
            class="tip-for-use-table-row d-flex"
            :style="{ borderBottom: themeStore.darkmodeBorder }"
            :key="i"
          >
            <div
              class="tip-for-use-name text-bold-14-black"
              :style="{ borderRight: themeStore.darkmodeBorder }"
            >
              {{ keys.split(":")[0] }}
            </div>
            <div
              class="tip-for-use-contents text-bold-14-black d-flex flex-column ma-2"
              :style="{ color: themeStore.darkmodeColor, textAlign: 'start' }"
              v-html="getTipsTxt(keys.split(':')[1])"
            ></div>
          </div>
        </div>
      </div>
    </Modal>

    <Modal
      ref="gijaeBulbiModal"
      :title="Util.getI18NTxt(stores, 'I18N/WORKSPACE/TOOLBAR/CHECK_FORMALITY')"
      buttonType="N"
      :no-txt="Util.getI18NTxt(stores, 'I18N/BUTTON/CLOSE')"
      opacity-bar
      closeBtn
    >
      <div
        class="mb-5"
        style="width: 62.5rem; height: 37.5rem"
        :style="{ border: themeStore.darkmodeBorder, overflow: 'auto' }"
      >
        <span style="white-space: break-spaces">{{ executeDeficiency() }}</span>
      </div>
    </Modal>

    <!-- 관용어구 설정 모달 -->
    <IdiomSettingModal ref="idiomSettingModal"> </IdiomSettingModal>

    <!-- 환경설정 모달 -->
    <SettingModal ref="settingModal"> </SettingModal>
  </teleport>
</template>

<script lang="ts" setup>
import * as Util from "@/assets/javascripts/ipedit_util";
import IconSelect from "@/components/common/IconSelect.vue";
import RadioBox from "@/components/common/RadioBox.vue";
import Select from "@/components/common/Select.vue";
import Switch from "@/components/common/Switch.vue";
import Divider from "@/components/Divider.vue";
import AiSearchModal from "@/components/workspace/modal/AiSearchModal.vue";
import IdiomSettingModal from "@/components/workspace/modal/IdiomSettingModal.vue";
import SettingModal from "@/components/workspace/modal/SettingModal.vue";
import DarkModeBtn from "@/components/workspace/toolbar/DarkModeBtn.vue";
import type { ModalType } from "@/types/modal";
import {
  mdiCog,
  mdiContentSaveOutline,
  mdiDownloadBox,
  mdiLayersTripleOutline,
  mdiMicrosoftWord,
  mdiTrayArrowDown,
  mdiMessageTextOutline,
  mdiFileImportOutline,
  mdiTrashCan,
  mdiOpenInNew,
} from "@mdi/js";
import { ref, onMounted, computed, watch } from "vue";
import tinymce from "tinymce/tinymce";
import Modal from "@/components/common/modal/Modal.vue";
import * as WordDownload from "@/assets/javascripts/docx/index";
import { tldexie } from "@/assets/javascripts/dexie";
import { rgbToRgba } from "@/assets/javascripts/utils/css";

// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { extractError } from "@/api/error";
import api from "@/api/api";
import { parseJsonSafe } from "@/assets/javascripts/utils/workspace";
import colors from "@/assets/javascripts/colors";
import { analyzeFullText } from "@/assets/javascripts/workspace/deficiency";

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

// 모달
const aiSearchModal = ref<ModalType>();
const idiomSettingModal = ref<ModalType>();
const settingModal = ref<ModalType>();
const tipForUseModal = ref<ModalType>();
const gijaeBulbiModal = ref<ModalType>();

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

// 글꼴 셀렉트 값
const fontFamilySelectValue = ref({ text: "", value: "" });
// 글꼴 셀렉트 옵션
let fontFamilyArray = [] as string[];

const fontFamilySelectOptions = ref<any>([]);

// 폰트 사이즈 셀렉트 값
const fontSizeSelectValue = ref({ text: "12pt", value: "12" });
// 폰트 사이즈 셀렉트 옵션
const fontSizeSelectOptions = ref<
  { text: string; value: any; func: (...args: any[]) => void }[]
>([]);

const areaToggle = ref([true, true, true, true, true]);

function executeDeficiency() {
  let text = "";
  if (
    workspaceStore.caseMasterData.workspace_type_code_path ===
    "SETTING/DRAFT/WORKSPACE_TYPE/SPLIT"
  ) {
    // 청구항 도면부호 표시 안함(false), 기본 영역 도면부호 표시 안함(false), 과제해결수단 생략(TYPE3), 부호설명 생략(N), 요약 생략(TYPE4)
    text = Util.makeHtmlForWord(stores, false, false, "TYPE3", "N", "TYPE4");
    text = Util.removeAllTag(text);
  } else
    text = tinymce.get("detailed-description").getContent({ format: "text" });

  const format = workspaceStore.caseMasterData.format_code_path
    .split("/")
    .at(-1)
    ?.toLowerCase() as "kipo" | "uspto" | "jpo";

  const result = analyzeFullText(text, format);
  return result.join("\n");
}

function setupAreaShow(target: string) {
  // claimWizardModal이 닫혀있으면 Area가 셋업되는 것 방지
  if (!workspaceStore.claimWizardModal.isOpen) {
    workspaceStore.controlAreaShow(target);

    // 레이아웃 설정값 업데이트
    if (Util.isSplitLayout(stores))
      workspaceStore.setSettingOption("SETTING/DRAFT/APPLICATION_SPLIT_LAYOUT");
    else
      workspaceStore.setSettingOption(
        "SETTING/DRAFT/APPLICATION_MERGED_LAYOUT"
      );
    workspaceStore.setSettingValue(JSON.stringify(workspaceStore.areaData));
    workspaceStore.requestUpdateSetting = true;
  }

  if (target === "structure") {
    workspaceStore.initializeStructureArea = true;
  } else if (target === "description") {
    workspaceStore.initializeDescriptionArea = true;
  }
}

// 다운로드 셀렉트 값
const downloadSelectValue = ref();

/**저장 슬롯 관리 모달 */
interface VersionOption {
  save_slot: number;
  save_time?: string;
}

const saveSlotModal = ref<ModalType>();
// 저장 슬롯 관리 값
const saveSlotRadioBoxValue = ref(0);
// 저장 슬롯 관리 아이템
const saveSlotRadioBoxOptions = ref<VersionOption[]>();
const isShowLoadBtns = ref<boolean[]>([]);

// 슬롯 마지막 저장 시간 텍스트
const slotLastSaveTimeTxt = computed(() => (i: number) => {
  if (saveSlotRadioBoxOptions.value) {
    if (saveSlotRadioBoxOptions.value[i]) {
      const saveTime = saveSlotRadioBoxOptions.value[i].save_time;
      if (saveTime !== undefined)
        return Util.getDateTimeByFormat(
          "yyyy-MM-dd HH:mm:ss",
          Util.getUserTime(saveTime, Util.getTimezone(stores))
        );
    }
  }

  return "-";
});

// 슬롯 저장 모달 카드 스타일
const saveSlotCardBorder = computed(() => (i: number) => {
  if (saveSlotRadioBoxValue.value === i) {
    return "1px solid " + themeStore.workspacePrimary;
  } else return "1px solid #e0e0e0";
});

const saveSlotCardColor = computed(() => (i: number) => {
  if (
    saveSlotRadioBoxOptions.value &&
    saveSlotRadioBoxOptions.value[i]?.save_time
  ) {
    return "#1b1a1b";
  } else {
    return "#7c7f90";
  }
});

const saveSlotCardBgColor = computed(() => (i: number) => {
  if (saveSlotRadioBoxValue.value === i) {
    return Util.getColor(stores, "TINTED");
  } else if (
    saveSlotRadioBoxOptions.value &&
    saveSlotRadioBoxOptions.value[i]?.save_time
  ) {
    return "white";
  } else {
    return "#EEEEEE";
  }
});

// 슬롯 데이터 가져와서 라디오박스 옵션에 넣음
async function getCaseSlots() {
  try {
    const response = await api.draft.readSlotsOfCase({
      case_id: stores.ws.caseMasterData.id,
    });
    // 슬롯 스위치
    saveSlotRadioBoxOptions.value = [];
    saveSlotRadioBoxOptions.value = response.data.objects;
  } catch (e) {
    const error = extractError(e);
    console.log(error);
  }
}

// 자동저장 텍스트
const slotAutoSaveTxt = ref("-");

async function getAutoSaveSlot() {
  try {
    const response = await api.draft.caseSlotRead({
      case_id: stores.ws.caseMasterData.id,
      save_slot: 3,
    });
    // 슬롯 스위치
    const saveTime = response.data.object.save_time;
    // 자동저장 슬롯 저장시간 텍스트 초기화
    slotAutoSaveTxt.value = saveTime
      ? saveTime.substring(0, 10) + " " + saveTime.substring(11)
      : "-";
  } catch (e) {
    const error = extractError(e);
    console.log(error);
  }
}

async function showSaveSlotModal() {
  // 슬롯 관리 열기
  await getCaseSlots();
  saveSlotRadioBoxValue.value = workspaceStore.active_save_slot - 1;
  saveSlotModal.value?.show();
}

async function onClickYesBtnInSaveSlotModal() {
  // 슬롯 관리 > 슬롯만 변경
  const fromSlot = workspaceStore.active_save_slot;
  const toSlot = saveSlotRadioBoxValue.value + 1;
  if (fromSlot !== toSlot) {
    // 변경 저장, 캐시는 그대로 사용
    await tldexie.chagneActiveSlot(fromSlot, toSlot, workspaceStore.isLocal());
    workspaceStore.active_save_slot = toSlot;

    workspaceStore.showSnackbar(
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/TOOLBAR/VERSION_MODAL_SLOT_CHANGED"
      ),
      "success"
    );
  }
  saveSlotModal.value?.hide();
}

function onClickLoadBtnInSlotCard(n: number) {
  // 저장 슬롯 관리 > 불러오기
  modalStore.confirmModal.title = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/TOOLBAR/VERSION_MODAL_LOAD_CONFIRM_MODAL_HEADER"
  );
  modalStore.confirmModal.desc = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/TOOLBAR/VERSION_MODAL_LOAD_CONFIRM_MODAL_CONTENT"
  );
  modalStore.confirmModal.yesButtonFunc = async () => {
    // 덱시 불러오기
    await tldexie.loadLayeredDataSelfAll(n, workspaceStore.active_save_slot);

    // 덱시 데이터에서 스토어 설정
    const cacheKeys = Object.keys(workspaceStore.caseData);
    const promises = cacheKeys.map(async (dataKey) => {
      const row = await tldexie.readCacheData(dataKey);
      workspaceStore.caseData[dataKey] = parseJsonSafe(row?.data);
    });
    await Promise.all(promises);

    // 상세설명, 도면 강제 새로고침
    workspaceStore.forceRefreshDescription();
    workspaceStore.forceRefreshDrawings();

    // 모달 닫기
    modalStore.confirmModal.hide();
    saveSlotModal.value?.hide();
  };
  modalStore.confirmModal.yesButtonText = Util.getI18NTxt(
    stores,
    "I18N/BUTTON/CONFIRM"
  );

  modalStore.confirmModal.noButtonText = Util.getI18NTxt(
    stores,
    "I18N/BUTTON/CLOSE"
  );
  modalStore.confirmModal.show();
}

// 다운로드 셀렉트 옵션
const downloadSelectOptions = ref([
  {
    icon: mdiMicrosoftWord,
    text: Util.getI18NTxt(
      stores,
      "I18N/DASHBOARD/CASE_COMPLETE_MODAL/WORD_BUTTON"
    ),
    // func: downloadDocx,
    func: onClickOpenDownloadWordBtn,
  },
  {
    icon: mdiDownloadBox,
    text: Util.getI18NTxt(
      stores,
      "I18N/DASHBOARD/CASE_COMPLETE_MODAL/BACKUP_BUTTON"
    ),
    func: downloadBackup,
  },
]);

// 설정 dropdown 옵션
const settingSelectOptions = ref([
  // 관용어구 설정 text 및 모달 열기 설정
  {
    icon: mdiMessageTextOutline,
    text: Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/TOOLBAR/DROPDOWN_SETTING_IDIOM"
    ),
    func: () => {
      // 설정관련 UI 변수들 초기화
      appStore.settingTabIndex = 0;
      appStore.settingSidemenuIndex = 0;
      appStore.settingTitle = "";
      appStore.settingDesc = "";
      appStore.settingCodeNode = "";
      appStore.settingRefresh = false;

      idiomSettingModal.value?.show();
    },
  },
  // 환경설정 text 및 모달 열기 설정
  {
    icon: mdiCog,
    text: Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/TOOLBAR/DROPDOWN_SETTING_SETTINGS"
    ),
    func: () => {
      // 설정관련 UI 변수들 초기화
      appStore.settingTabIndex = 0;
      appStore.settingSidemenuIndex = 0;
      appStore.settingTitle = "";
      appStore.settingDesc = "";
      appStore.settingCodeNode = "";
      appStore.settingRefresh = false;

      // 환경설정 모달 띄우기 전에 현재 설정값 임시 저장
      workspaceStore.setTempSettings(
        JSON.parse(JSON.stringify(userStore.settings))
      );

      settingModal.value?.show();
    },
  },
]);

// 저장 셀렉트 옵션
const saveIconSelectOptions = computed(() => [
  {
    text: Util.getI18NTxt(stores, "I18N/WORKSPACE/TOOLBAR/DROPDOWN_SAVE"),
    value: Util.getI18NTxt(stores, "I18N/WORKSPACE/TOOLBAR/DROPDOWN_SAVE"),
    icon: mdiContentSaveOutline,
    func: () => {
      workspaceStore.setSaveCaseData(true);
    },
  },
  {
    text: Util.getI18NTxt(stores, "I18N/WORKSPACE/TOOLBAR/IMPORT"),
    icon: mdiFileImportOutline,
    value: Util.getI18NTxt(stores, "I18N/WORKSPACE/TOOLBAR/IMPORT"),
    func: dataLoadModal.value?.show,
  },
  {
    text: Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/TOOLBAR/VERSION_MODAL_HEADER"
    ),
    icon: mdiLayersTripleOutline,
    value: Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/TOOLBAR/VERSION_MODAL_HEADER"
    ),
    func: showSaveSlotModal,
  },
]);

/**불러오기 모달 */
const dataLoadModal = ref<ModalType>();
const backupFileLoadInputRef = ref<HTMLInputElement>(
  document.createElement("input")
);
const dataLoadModalRadioBoxValue = ref(0);
const dataLoadModalRadioBoxOptions = ref([0, 1]);
const isLoadDataSelectDisabled = ref(false);
const reader = new FileReader();
const backupFile = ref<File | undefined>();
// 파일 업로드
// 파일리더 이벤트
reader.onload = (e: ProgressEvent<FileReader>) => {
  const target = e.target;
  // dataURL
  const result = target?.result;
  if (result) {
    console.log(result);
  } else Util.openAlertModal(stores, "file upload error");
};
reader.onerror = () => {};

// 파일
const onClickLoadBackupFileBtn = () => backupFileLoadInputRef.value.click();

// 파일 로드
function onChangeBackupFileLoadInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.item(0);
  if (file) {
    // 파일 있으면 파일 처리
    backupFile.value = file;
    // 파일 업로드 에러: 경고 모달
  } else Util.openAlertModal(stores, "file upload error");
  target.value = "";
}

watch(dataLoadModalRadioBoxValue, (newValue) => {
  if (newValue === 1) isLoadDataSelectDisabled.value = true;
  else isLoadDataSelectDisabled.value = false;
});

const anotherCaseSelectValue = ref({
  text: Util.getI18NTxt(stores, "I18N/BUTTON/SELECT"),
  value: null,
});
const anotherCaseSelectOptions = ref<{ text: string; value: any }[]>([
  {
    text: Util.getI18NTxt(stores, "I18N/BUTTON/SELECT"),
    value: null,
  },
]);

// 케이스 데이터 불러와서 데이터 불러오기 모달 셀렉트에 값 할당
async function getOtherCasesData() {
  try {
    const response = await api.draft.caseReadAll({
      format_code_path: stores.ws.caseMasterData.format_code_path,
      work_type_code_path: stores.ws.caseMasterData.work_type_code_path,
      workspace_type_code_path:
        stores.ws.caseMasterData.workspace_type_code_path,
      case_save_location_code_path:
        stores.ws.caseMasterData.case_save_location_code_path,
    });
    // 현재 열려있는 케이스 데이터 제외
    // 로컬인 경우, 접근 가능한 케이스만 필터링
    const objects = response.data.objects.filter((item) => {
      let result = item.id !== stores.ws.caseMasterData.id;
      if (workspaceStore.isLocal())
        return result && tldexie.existsLocalDexie(item.id);
      else return result;
    });
    objects.forEach((item) => {
      anotherCaseSelectOptions.value.push({
        text: item.title,
        value: item,
      });
    });
  } catch (e) {
    const error = extractError(e);
    console.log(error);
  }
}

function onClickYesBtnInDataLoadModal() {
  console.log(dataLoadModalRadioBoxValue.value, anotherCaseSelectValue.value);
  if (
    dataLoadModalRadioBoxValue.value === 0 &&
    anotherCaseSelectValue.value.value === null
  ) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/WORKSPACE/TOOLBAR/REQUEST_SELECT_CASE"),
      true
    );
    return;
  }

  if (
    dataLoadModalRadioBoxValue.value === 1 &&
    backupFile.value === undefined
  ) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/TOOLBAR/REQUEST_SELECT_BACKUP_FILE"
      ),
      true
    );
    return;
  }

  // 모달 설정
  modalStore.confirmModal.title = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/TOOLBAR/IMPORT"
  );
  modalStore.confirmModal.desc = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/TOOLBAR/IMPORT_CONFIRM_MODAL_CONTENT"
  );
  modalStore.confirmModal.noButtonText = Util.getI18NTxt(
    stores,
    "I18N/BUTTON/CLOSE"
  );
  modalStore.confirmModal.yesButtonText = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/TOOLBAR/IMPORT"
  );
  modalStore.confirmModal.yesButtonFunc = async () => {
    if (dataLoadModalRadioBoxValue.value === 0) {
      // 다른 케이스에서 불러오기
      const data: any = anotherCaseSelectValue.value.value;
      await tldexie.loadLayeredOtherCaseDataAll(
        workspaceStore.active_save_slot,
        data.id,
        data.active_save_slot
      );
    } else if (dataLoadModalRadioBoxValue.value === 1) {
      // 파일에서 불러오기
      await tldexie.uploadFromIpac(
        workspaceStore.active_save_slot,
        backupFile.value as File
      );
    }

    // 덱시 데이터에서 스토어 설정
    const cacheKeys = Object.keys(workspaceStore.caseData);
    const promises = cacheKeys.map(async (dataKey) => {
      const row = await tldexie.readCacheData(dataKey);
      workspaceStore.caseData[dataKey] = parseJsonSafe(row?.data);
    });
    await Promise.all(promises);

    // 상세설명, 도면 강제 새로고침
    workspaceStore.forceRefreshDescription();
    workspaceStore.forceRefreshDrawings();

    // 모달 닫기
    modalStore.confirmModal.hide();
    dataLoadModal.value?.hide();
  };

  // 모달 실행
  modalStore.confirmModal.show();
}
/**툴바 버튼들 */
// 폰트 크기 데이터 푸시
for (let i = 8; i < 19; ++i) {
  fontSizeSelectOptions.value.push({
    text: i + "pt",
    value: i,
    func: () => onClickFontSizeBtn(i),
  });
}

function setupAreaTitle(id: string) {
  if (id === "element") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/TITLE");
  } else if (id === "basic") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/TITLE");
  } else if (id === "claim") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/TITLE");
  } else if (id === "description") {
    if (Util.isSplitLayout(stores))
      return Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/DETAILED_DESCRIPTION/TITLE"
      );
    else
      return Util.getI18NTxt(
        stores,
        workspaceStore.caseMasterData.work_type_code_path,
        "setting_titles"
      );
  } else if (id === "drawing") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/DRAWINGS/TITLE");
  } else if (id === "structure") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/STRUCTURE/TITLE");
  }
}

const onClickFontNameBtn = (fontName: string) => {
  // 워크스페이스 스토어에 폰트 저장
  // TODO: 왜 important가 있어야 상세한 설명 에디터 폰트가 바뀌는지 원인 파악 필요
  workspaceStore.setFontFamily(fontName);
  // 현재 열려있는 모든 에디터에 폰트 패밀리 스타일 부여
  tinymce.editors.forEach((item) => {
    if (item.contentWindow?.document)
      item.contentWindow.document.body.style.fontFamily = fontName;
  });

  // 폰트 패밀리 설정값 업데이트
  workspaceStore.setSettingOption("SETTING/EDITOR/FONT_STYLE");
  workspaceStore.setSettingValue(fontName);
  workspaceStore.requestUpdateSetting = true;

  workspaceStore.resetTinyMceFontFamily(fontName);
};

const onClickFontSizeBtn = (fontPoint: number) => {
  // 워크스페이스 스토어에 폰트 크기 저장
  let fontSize = Math.floor((fontPoint * 4) / 3);
  let fontSizePx = `${fontSize}px`;
  workspaceStore.fontSize = fontSizePx;
  // 현재 열려있는 모든 에디터에 폰트 크기 부여
  tinymce.editors.forEach((editor) => {
    if (!editor.inline)
      editor.contentWindow.document.body.style.fontSize = fontSizePx;
  });

  // 폰트 크기 설정값 업데이트
  workspaceStore.setSettingOption("SETTING/EDITOR/FONT_SIZE");
  workspaceStore.setSettingValue(fontPoint + "");
  workspaceStore.requestUpdateSetting = true;

  workspaceStore.resetTinyMceFontSize(fontSize);
};

function downloadDocx() {
  let documentText =
    "<p style='text-indent: 0rem; text-align: center' contentEditable='false'>【明細書】</p>";
  // 발명의 명칭
  documentText = Util.makeDocumentText(documentText, "title", "発明の名称");
  // TODO: 영문 추가
  documentText = Util.makeDocumentText(
    documentText,
    "content",
    workspaceStore.caseData.invention_title.data
  );

  // 기술분야
  documentText = Util.makeDocumentText(documentText, "title", "技術分野");
  documentText = documentText.concat(
    workspaceStore.caseData.technical_field.data
  );
  documentText = Util.makeDocumentText(documentText, "content", "");

  // 배경기술
  documentText = Util.makeDocumentText(documentText, "title", "背景技術");
  documentText = documentText.concat(workspaceStore.caseData.background.data);
  documentText = Util.makeDocumentText(documentText, "content", "");

  // 선행기술문헌
  documentText = Util.makeDocumentText(documentText, "title", "先行技術文献");
  documentText = documentText.concat(workspaceStore.caseData.prior_art.data);
  documentText = Util.makeDocumentText(documentText, "content", "");

  // 발명의 내용
  documentText = Util.makeDocumentText(documentText, "title", "発明の概要");
  // 해결하고자하는 과제
  documentText = Util.makeDocumentText(
    documentText,
    "title",
    "発明が解決しようとする課題"
  );
  documentText = documentText.concat(workspaceStore.caseData.purpose.data);
  documentText = Util.makeDocumentText(documentText, "content", "");

  // 과제의 해결수단
  documentText = Util.makeDocumentText(
    documentText,
    "title",
    "課題を解決するための手段"
  );
  // TODO: 자동으로 생성
  documentText = Util.makeDocumentText(documentText, "content", "");
  documentText = Util.makeDocumentText(documentText, "content", "");

  // 발명의 효과
  documentText = Util.makeDocumentText(documentText, "title", "発明の効果");
  documentText = documentText.concat(workspaceStore.caseData.advantages.data);
  documentText = Util.makeDocumentText(documentText, "content", "");

  // 도면의 간단한 설명
  documentText = Util.makeDocumentText(
    documentText,
    "title",
    "図面の簡単な説明"
  );
  documentText = documentText.concat(
    workspaceStore.caseData.drawing_description.data
  );
  documentText = Util.makeDocumentText(documentText, "content", "");

  // 발명을 실시하기 위한 구체적인 내용
  documentText = Util.makeDocumentText(
    documentText,
    "title",
    "発明を実施するための形態"
  );
  documentText = documentText.concat(
    workspaceStore.caseData.detailed_description.data
  );
  documentText = Util.makeDocumentText(documentText, "content", "");

  // 부호의 설명
  documentText = Util.makeDocumentText(documentText, "title", "符号の説明");
  // TODO: 만들어주자
  documentText = Util.makeDocumentText(documentText, "content", "");
  documentText = Util.makeDocumentText(documentText, "content", "");
  documentText = Util.makeDocumentText(documentText, "content", "");

  // documentText = documentText.concat("<pagebreak/>");

  // 청구범위
  documentText = documentText.concat(
    "<p style='text-indent: 0rem; text-align: center' contentEditable='false'>【特許請求の範囲】</p>"
  );
  for (let i = 0; i < workspaceStore.caseData.claims.length; i++) {
    documentText = documentText.concat(
      "<p style='text-indent: 0rem'>【請求項 " + (i + 1) + "】</p>"
    );
    documentText = documentText.concat(
      workspaceStore.caseData.claims[i].quotationTxt +
        workspaceStore.caseData.claims[i].body +
        workspaceStore.caseData.claims[i].category
    );
    documentText = Util.makeDocumentText(documentText, "content", "");
  }
  documentText = Util.makeDocumentText(documentText, "content", "");
  documentText = Util.makeDocumentText(documentText, "content", "");

  // documentText = documentText.concat("<pagebreak/>");

  // 요약서
  documentText = documentText.concat(
    "<p style='text-indent: 0rem; text-align: center' contentEditable='false'>【要約】</p>"
  );
  // 요약
  documentText = Util.makeDocumentText(documentText, "title", "要約");
  // TODO: 만들어주자.
  documentText = Util.makeDocumentText(documentText, "content", "");
  documentText = Util.makeDocumentText(documentText, "content", "");

  // 대표도
  documentText = Util.makeDocumentText(documentText, "title", "選択図");
  documentText = Util.makeDocumentText(documentText, "content", "図 1");
  documentText = Util.makeDocumentText(documentText, "content", "");

  documentText = Util.makeDocumentText(documentText, "content", "");
  // documentText = documentText.concat("<pagebreak/>");

  // 도면
  documentText = documentText.concat(
    "<p style='text-indent: 0rem; text-align: center' contentEditable='false'>【図面】</p>"
  );
  // TODO: 만들어주자
  // documentText = documentText.concat(
  //   "<p style='text-indent: 0rem'>【도 1】</p>"
  // );
  // documentText = Util.makeDocumentText(documentText, "content", "");
  // documentText = Util.makeDocumentText(documentText, "content", "");

  // console.log(documentText);

  const drawingData = [];

  for (let i = 0; i < workspaceStore.caseData.drawings.length; i++) {
    drawingData.push({
      url: workspaceStore.caseData.drawings[i].data,
      label: "【도 " + (i + 1) + "】",
    });
  }

  let tempString = documentText;
  const extractDivPattern = /<(\/div|div)([^>]*)>/gi;

  const tempHTML = document.createElement("div");
  tempHTML.innerHTML = tempString;
  // console.log(tempHTML);
  let elementArray = tempHTML.getElementsByClassName("autocomplete");
  for (let i = elementArray.length - 1; i >= 0; i--) {
    elementArray[i].removeAttribute("contenteditable");
    elementArray[i].removeAttribute("data-name");
    elementArray[i].removeAttribute("data-number");
    elementArray[i].removeAttribute("data-eid");
    elementArray[i].removeAttribute("data-fcc");
    elementArray[i].removeAttribute("data-cp");
    elementArray[i].setAttribute(
      "style",
      `color: ${Util.getSettingValue(
        stores,
        "SETTING/EDITOR/AUTOCOMPLETE_COLOR"
      ).substring(0, 7)};
      font-weight: ${Util.getSettingValue(
        stores,
        "SETTING/EDITOR/AUTOCOMPLETE_WEIGHT"
      )}
      `
    );
    console.log(elementArray[i]);
  }

  elementArray = tempHTML.getElementsByClassName("antecedent");
  for (let i = elementArray.length - 1; i >= 0; i--) {
    elementArray[i].removeAttribute("contenteditable");
    elementArray[i].removeAttribute("data-name");
    elementArray[i].removeAttribute("data-number");
    elementArray[i].removeAttribute("data-eid");
    elementArray[i].removeAttribute("data-fcc");
    elementArray[i].removeAttribute("data-cp");
    elementArray[i].setAttribute(
      "style",
      `background-color: ${Util.getSettingValue(
        stores,
        "SETTING/EDITOR/ANTECEDENT_ERROR_COLOR"
      ).substring(0, 7)}
      `
    );
    console.log(elementArray[i]);
  }

  tempString = String(tempHTML.innerHTML);
  tempString = tempString.replace(extractDivPattern, "");

  documentText = tempString;

  console.log(tempString);

  // const autocompletedElements = documentText.match(
  //   /\<span\sid\=\"el.*\<\/span\>/gi
  // );

  // for (let i = 0; i < autocompletedElements?.length; i++) {
  //   const elementString = autocompletedElements[i];
  //   console.log(elementString);
  // }

  WordDownload.downloadAfterHtmlToDocx(
    Util.replaceAll(
      documentText,
      // workspaceStore.caseData.detailed_description.data,
      "<p></p>",
      "<p>&nbsp;</p>"
    ),
    drawingData,
    workspaceStore.caseMasterData.ref_no,
    {
      fontSpec: {
        name: Util.getSettingValue(stores, "SETTING/EDITOR/FONT_STYLE"),
        size:
          parseInt(Util.getSettingValue(stores, "SETTING/EDITOR/FONT_SIZE")) *
          2,
      },
      headerContents: {
        left: workspaceStore.caseMasterData.client,
        right: workspaceStore.caseMasterData.ref_no,
      },
    }
  );
}

function downloadBackup() {
  tldexie.downloadAsIpac(workspaceStore.caseMasterData.ref_no);
}

function changeDarkMode() {
  console.log(workspaceStore.claimWizardModal.isOpen);

  if (!workspaceStore.claimWizardModal.isOpen) {
    themeStore.setIsDarkmode(!themeStore.isDarkmode);

    workspaceStore.setSettingOption("SETTING/EDITOR/DARK_MODE");
    if (themeStore.isDarkmode) workspaceStore.setSettingValue("Y");
    else workspaceStore.setSettingValue("N");

    workspaceStore.requestUpdateSetting = true;
  }
}

function initialSetupToolbar() {
  // 영역 ON/OFF 스위치 셋팅
  for (let i = 0; i < workspaceStore.areaData.length; i++) {
    areaToggle.value[i] = workspaceStore.areaData[i].isShow;
  }

  // console.log(
  //   Util.getSettingValue(stores, "SETTING/EDITOR/FONT_STYLE"),
  //   Util.getSettingValue(stores, "SETTING/EDITOR/FONT_SIZE")
  // );

  // font 종류 설정
  if (Util.isKIPO(stores)) {
    fontFamilyArray = workspaceStore.KIPOfont;
    fontFamilySelectValue.value = {
      text: workspaceStore.KIPOfont[0],
      value: workspaceStore.KIPOfont[0],
    };
  } else if (Util.isJPO(stores)) {
    fontFamilyArray = workspaceStore.JPOfont;
    fontFamilySelectValue.value = {
      text: workspaceStore.JPOfont[0],
      value: workspaceStore.JPOfont[0],
    };
  } else if (Util.isUSPTO(stores)) {
    fontFamilyArray = workspaceStore.USPTOfont;
    fontFamilySelectValue.value = {
      text: workspaceStore.USPTOfont[0],
      value: workspaceStore.USPTOfont[0],
    };
  }
  fontFamilySelectOptions.value = [];
  fontFamilyArray.forEach((item) => {
    fontFamilySelectOptions.value.push({
      text: item,
      value: item,
      func: () => onClickFontNameBtn(item),
    });
  });

  // 설정 폰트로 설정
  for (let i = 0; i < fontFamilySelectOptions.value.length; i++) {
    if (
      fontFamilySelectOptions.value[i].value ===
      Util.getSettingValue(stores, "SETTING/EDITOR/FONT_STYLE")
    ) {
      fontFamilySelectValue.value = fontFamilySelectOptions.value[i];
      break;
    }
  }

  // font 크기 설정
  for (let i = 0; i < fontSizeSelectOptions.value.length; i++) {
    if (
      fontSizeSelectOptions.value[i].value + "" ===
      Util.getSettingValue(stores, "SETTING/EDITOR/FONT_SIZE")
    ) {
      fontSizeSelectValue.value = fontSizeSelectOptions.value[i];
      break;
    }
  }
}

// 필수팁 데이터
const useForTipKeys = Util.isKIPO(stores)
  ? Util.getI18NTxt(stores, "I18N/WORKSPACE/TOOLBAR/TIPS_KIPO")?.split("|")
  : Util.isJPO(stores)
  ? Util.getI18NTxt(stores, "I18N/WORKSPACE/TOOLBAR/TIPS_JPO")?.split("|")
  : Util.isUSPTO(stores)
  ? Util.getI18NTxt(stores, "I18N/WORKSPACE/TOOLBAR/TIPS_USPTO")?.split("|")
  : [];

function getTipsTxt(data: string) {
  let tempTxt = data;
  tempTxt = "<li>" + tempTxt;
  tempTxt = Util.replaceAll(tempTxt, "//", "</li><li>");
  tempTxt = getHighlightTag(tempTxt, "enter");
  tempTxt = getHighlightTag(tempTxt, "tab");
  tempTxt = getHighlightTag(tempTxt, "esc");
  tempTxt = getHighlightTag(tempTxt, "shift");
  tempTxt = getHighlightTag(tempTxt, "space");
  tempTxt = getHighlightTag(tempTxt, "↑");
  tempTxt = getHighlightTag(tempTxt, "↓");
  tempTxt = Util.replaceAll(
    tempTxt,
    "/newWindowIcon/",
    "<svg style='position:relative; top: 6px' width='24' height='24' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' role='img' aria-hidden='true'><path fill='#9e9e9e' d='" +
      mdiOpenInNew +
      "'></path></svg>"
  );
  tempTxt = tempTxt + "</li>";

  return tempTxt;

  function getHighlightTag(source: string, target: string) {
    return Util.replaceAll(
      source,
      target,
      "<span class='mx-0 text-bold-14-black' style='border: " +
        themeStore.darkmodeBorder +
        "; width: max-content; height: 1.5rem; padding: 0 0.25rem; border-radius: 0.25rem; background-color: #fafafa;'>" +
        target +
        "</span>"
    );
  }
}

function onClickOpenDownloadWordBtn() {
  localStorage.setItem(
    "editorConfig",
    JSON.stringify(workspaceStore.tinymceConfig)
  );
  window.open(
    "downloadword",
    "downloadword",
    `width=1400px, height=${window.screen.availHeight}, menubar=no, status=no, toolbar=no, location=no`
  );
}

watch(workspaceStore, () => {
  // workspace에서 초기화 셋팅 작업이 끝난 다음에 데이터 로딩 진행
  if (workspaceStore.initializeToolbar) {
    initialSetupToolbar();
    workspaceStore.initializeToolbar = false;
  }
});

/**created */
// 슬롯 모달, 불러오기 모달 데이터 초기화
getOtherCasesData();
getAutoSaveSlot();

onMounted(() => {
  console.log("toolbar mounted");
});
</script>
<style lang="scss" scoped>
@import "@/styles/draft/text";
@import "@/styles/colors";
.workspace-toolbar {
  overflow: visible;
  width: 100%;
  height: 2.375rem;
  background-color: var(--color-sub);
  white-space: nowrap;
  .workspace-toolbar-btn {
    background-color: white;
    color: #5c6bc0;
    border-radius: 0.125rem;
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  }
  .workspace-toolbar-divider {
    margin: 0rem 0.5rem;
  }
}

.data-load-modal-body {
  width: 28.75rem;
  height: 11.875rem;
}
.save-slot-modal-body {
  width: 40rem;
  height: 20rem;
}
.tip-for-use-modal-body {
  width: 47rem;
  height: max-content;
  .tip-for-use-table {
    border-bottom: none !important;
    margin-bottom: 1.5rem;
  }
  .tip-for-use-table-row {
    width: 100%;
    .tip-for-use-name {
      padding: 0.5rem 0;
      width: 12.5rem;
      text-align: center;
      background-color: $color-gray-eee;
      color: $color-global-black;
    }
    .tip-for-use-contents {
      width: 100%;
      text-align: center;
    }
  }
}
</style>
