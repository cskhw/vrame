<template>
  <div
    class="modal-wrapper"
    v-bind:class="{ 'is-active': modalStore.caseManagementModal.isOpen }"
  >
    <div
      class="modal-backgrounds"
      @click="modalStore.caseManagementModal.isOpen = false"
    />
    <!-- content-area -->

    <div
      class="modal-contents"
      :style="[
        {
          height: !modalStore.caseManagementModal.caseID
            ? '822px'
            : router.currentRoute.value.path === '/draft/workspace'
            ? '45.875rem'
            : appStore.lang.includes('EN')
            ? '35rem'
            : appStore.lang.includes('JA')
            ? '34.375rem'
            : '33.5rem',
        },
        themeStore.darkmodeStyle,
      ]"
    >
      <div style="padding: 1.72rem 1.5rem 0 1.5rem">
        <div class="text-bold-22-black" :style="themeStore.darkmodeStyle">
          {{
            modalStore.caseManagementModal.caseID
              ? Util.getI18NTxt(stores, "I18N/CASE_MODAL/HEADER_EDIT")
              : Util.getI18NTxt(stores, "I18N/CASE_MODAL/HEADER_NEW")
          }}
        </div>
        <div
          class="d-flex justify-space-around mb-5"
          style="margin-top: 1.7188rem"
        >
          <!-- 서비스 유형 -->
          <div class="mr-1" style="flex: 1">
            <div class="text-400-12-gray mb-1">
              {{ Util.getI18NTxt(stores, "I18N/CASE_MODAL/FORMAT") }}
              <span style="color: #d2416d">*</span>
            </div>
            <Select
              class="mr-1"
              style="height: 2.5rem"
              v-model="formatCodeValue"
              :options="formatCodeOptions"
              :outline-color="Util.getColor(stores, 'PRIMARY')"
              :selectHoverBgColor="Util.getColor(stores, 'TINTED')"
              :optionHoverColor="Util.getColor(stores, 'TINTED')"
              :disabled="isDisabled"
              :selectStyle="{
                fontSize: '0.875rem',
              }"
              downIcon
              show-border
            />
          </div>
          <!-- 업무종류 -->
          <div style="flex: 1">
            <div class="text-400-12-gray mb-1 ml-1">
              {{ Util.getI18NTxt(stores, "I18N/CASE_MODAL/WORK_TYPE") }}
              <span style="color: #d2416d">*</span>
            </div>
            <Select
              class="ml-1"
              style="height: 2.5rem"
              v-model="workTypeValue"
              :options="workTypeOptions"
              :disabled="isDisabled"
              :outline-color="Util.getColor(stores, 'PRIMARY')"
              :optionHoverColor="Util.getColor(stores, 'TINTED')"
              :selectHoverBgColor="Util.getColor(stores, 'TINTED')"
              :selectStyle="{
                fontSize: '0.875rem',
              }"
              downIcon
              show-border
            />
          </div>
        </div>
        <!-- 케이스 관리번호 -->
        <div class="text-400-12-gray mb-1">
          {{ Util.getI18NTxt(stores, "I18N/CASE_MODAL/REFNO") }}
          <span style="color: #d2416d">*</span>
        </div>
        <TextField
          id="refno-input"
          class="mb-5"
          placeholder="e.g. IPEDIT-1004"
          :outline-color="Util.getColor(stores, 'PRIMARY')"
          v-model="refNo"
          :isShowMsg="refNoShowMsg"
          :isValid="refNoValid"
          :failedMsg="refNoFailedMsg"
        />
        <!-- 케이스 명칭 -->
        <div class="text-400-12-gray mb-1" :style="themeStore.darkmodeStyle">
          {{ Util.getI18NTxt(stores, "I18N/CASE_MODAL/TITLE") }}
          <span style="color: #d2416d">*</span>
        </div>
        <TextField
          id="title-input"
          class="mb-5"
          placeholder="e.g. Display device"
          :outline-color="Util.getColor(stores, 'PRIMARY')"
          v-model="title"
          :isShowMsg="titleShowMsg"
          :isValid="titleValid"
          :failedMsg="titleFailedMsg"
        ></TextField>
        <div class="d-flex justify-space-around mb-5">
          <!-- 마감일 -->
          <div class="mr-2" style="flex: 1">
            <div class="text-400-12-gray mb-1">
              {{ Util.getI18NTxt(stores, "I18N/CASE_MODAL/DUEDATE") }}
            </div>
            <Datepicker
              dateIcon
              clearable
              v-model="dueDate"
              :placeholder="datepickerPlaceholder"
              :inputFormat="datepickerInputFormat"
              :lang="datepickerLang"
              :typeable="false"
            />
          </div>
          <!-- 의뢰인 -->
          <div style="flex: 1">
            <div class="text-400-12-gray mb-1 ml-1">
              {{ Util.getI18NTxt(stores, "I18N/CASE_MODAL/CLIENT") }}
            </div>
            <TextField
              class="ml-1"
              id="client-input"
              placeholder="e.g. Google LLC"
              :outline-color="Util.getColor(stores, 'PRIMARY')"
              v-model="client"
              :isShowMsg="clientShowMsg"
              :isValid="clientValid"
              :failedMsg="clientFailedMsg"
            />
          </div>
        </div>
        <!-- 작업화면 구성 -->
        <div v-if="!modalStore.caseManagementModal.caseID" class="mb-5">
          <div class="text-400-12-gray d-flex mb-1">
            <span class="mr-1">{{
              Util.getI18NTxt(stores, "I18N/CASE_MODAL/WORKSPACE_TYPE")
            }}</span>
            <span style="color: #d2416d">*</span>
          </div>
          <VBtns
            v-model="workspaceTypeValue"
            :borderColor="themeStore.darkmodeBorder"
            :options="workspaceTypeOptions"
            :disabled="isDisabled || shouldBeMerged"
            :btn-color="Util.getColor(stores, 'PRIMARY')"
          ></VBtns>
          <div
            class="text-400-12-gray mt-1"
            style="width: 100%; height: 2rem"
            v-html="workspaceTypeDesc"
          ></div>
        </div>
        <!-- 데이터 저장 위치(신규로 생성할 때나, 워크스페이스에서 수정하려고 열었을 때만 표시) -->
        <div
          v-if="
            !modalStore.caseManagementModal.caseID ||
            router.currentRoute.value.path === '/draft/workspace'
          "
          class="mb-5"
        >
          <div class="text-400-12-gray d-flex mb-1">
            <span class="mr-1">{{
              Util.getI18NTxt(stores, "I18N/CASE_MODAL/SAVE_LOCATION")
            }}</span>
            <span style="color: #d2416d">*</span>
          </div>
          <VBtns
            v-model="saveLocationValue"
            :options="saveLocationOptions"
            :btn-color="Util.getColor(stores, 'PRIMARY')"
          ></VBtns>
          <div
            class="text-400-12-gray mt-1"
            style="width: 100%; min-height: 6.25rem"
            v-html="saveLocationDesc"
          />
        </div>

        <!-- 안내 문구들 -->
        <div v-if="modalStore.caseManagementModal.caseID">
          <div
            v-if="router.currentRoute.value.path === '/draft/dashboard'"
            class="text-400-12-gray d-flex mb-1"
          >
            <span style="color: #d2416d">{{
              Util.getI18NTxt(stores, "I18N/CASE_MODAL/NOT_DISPLAY_2")
            }}</span>
          </div>
          <div v-else class="text-400-12-gray d-flex mb-1">
            <span style="color: #d2416d">{{
              Util.getI18NTxt(stores, "I18N/CASE_MODAL/NOT_DISPLAY_1")
            }}</span>
          </div>
        </div>
        <Divider
          class="my-4"
          :bd-color="stores.ts.darkmodeBorder.substring(10)"
        />

        <div class="d-flex justify-end my-4">
          <div>
            <!-- 닫기 버튼 -->
            <v-btn
              class="mr-2"
              flat
              border="none"
              :style="{
                border: 'none',
                color: Util.getColor(stores, 'BUTTON'),
              }"
              @click="modalStore.caseManagementModal.isOpen = false"
              >{{ Util.getI18NTxt(stores, "I18N/BUTTON/CLOSE") }}</v-btn
            >

            <!-- 저장 버튼 -->
            <v-btn
              color="#5c6bc0"
              text-color="white"
              style="color: white"
              flat
              :style="{
                color: Util.getColor(stores, 'BUTTON_TEXT'),
                backgroundColor: Util.getColor(stores, 'BUTTON'),
              }"
              @click="asyncSaveClickSpiner"
              >{{ Util.getI18NTxt(stores, "I18N/BUTTON/SAVE") }}</v-btn
            >
          </div>
        </div>
      </div>
      <IComponentSpinner ref="spinner" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import api from "@/api/api";
import { extractError } from "@/api/error";
import type { AxiosError } from "axios";
import * as Util from "@/assets/javascripts/ipedit_util";
import { asyncDebounce } from "@/assets/javascripts/utils/asyncDebounce";
import Datepicker from "@/components/common/Datepicker.vue";
import Select from "@/components/common/Select.vue";
import TextField from "@/components/common/TextField.vue";
import VBtns from "@/components/VBtns.vue";
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { TwoLayeredDexie, tldexie, SlotType } from "@/assets/javascripts/dexie";
import Divider from "../../Divider.vue";
import { BC_CHANNEL_WORKSPACE_ACTIVATION } from "@/assets/javascripts/common";
import type { IIComponentSpinner } from "@/types/component";
import IComponentSpinner from "@/components/IComponentSpinner.vue";

// 변수 선언 필수
const router = useRouter();
const appStore = useAppStore();
const userStore = useUserStore();
const themeStore = useThemeStore();
const i18nStore = useI18NStore();
const modalStore = useModalStore();
const workspaceStore = useWorkspaceStore();

const stores = {
  as: appStore,
  us: userStore,
  ms: modalStore,
  is: i18nStore,
  ts: themeStore,
};

type optionType = {
  text: string;
  value: string;
};

const formatCodeValue = ref<optionType>({
  text: "",
  value: "",
});
const formatCodeOptions = ref<optionType[]>([]);
const workTypeValue = ref<optionType>({ text: "", value: "" });
const workTypeOptions = ref<optionType[]>([]);

const refNo = ref("");
const refNoValid = ref(true);
const refNoShowMsg = ref(false);
const refNoFailedMsg = ref("");
const title = ref("");
const titleValid = ref(true);
const titleShowMsg = ref(false);
const titleFailedMsg = ref("");
const dueDate = ref(new Date());
dueDate.value.setDate(dueDate.value.getDate() + 30);
dueDate.value.setHours(0, 0, 0, 0);
const datepickerInputFormat = ref("yyyy-MM-dd");
const datepickerPlaceholder = ref("");
const datepickerLang = ref("");
const client = ref("");
const clientValid = ref(true);
const clientShowMsg = ref(false);
const clientFailedMsg = ref("");

const workspaceTypeValue = ref<optionType>({ text: "dummy", value: "dummy" });
const workspaceTypeOptions = ref<optionType[]>([
  {
    text: Util.getI18NTxt(
      stores,
      "SETTING/DRAFT/WORKSPACE_TYPE/SPLIT",
      "setting_titles"
    ),
    value: "SETTING/DRAFT/WORKSPACE_TYPE/SPLIT",
  },
  {
    text: Util.getI18NTxt(
      stores,
      "SETTING/DRAFT/WORKSPACE_TYPE/MERGED",
      "setting_titles"
    ),
    value: "SETTING/DRAFT/WORKSPACE_TYPE/MERGED",
  },
]);
const workspaceTypeDesc = ref("");

const saveLocationValue = ref<optionType>({
  text: "dummy",
  value: "dummy",
});
const saveLocationOptions = ref<optionType[]>([
  {
    text: Util.getI18NTxt(
      stores,
      "SETTING/GENERAL/SAVE_LOCATION/CLOUD",
      "setting_titles"
    ),
    value: "SETTING/GENERAL/SAVE_LOCATION/CLOUD",
  },
  {
    text: Util.getI18NTxt(
      stores,
      "SETTING/GENERAL/SAVE_LOCATION/LOCAL",
      "setting_titles"
    ),
    value: "SETTING/GENERAL/SAVE_LOCATION/LOCAL",
  },
]);
const saveLocationDesc = ref("");
// 케이스 저장위치가 바뀌었는지를 판단하기 위한 변수
const originalSaveLocation = ref("");

// 수정인 경우 component 비활성화를 위한 변수
const isDisabled = ref(false);

// 특정 문서 종류인 경우 레이아웃을 통합으로 강제
const shouldBeMerged = ref(false);

const saveParams = ref<{
  id: number;
  format_code_path: string;
  work_type_code_path: string;
  workspace_type_code_path: string;
  case_status_code_path: string;
  case_save_location_code_path: string;
  ref_no: string;
  title: string;
  client: string | null;
  due_date: string | null;
  active_save_slot: number;
}>({
  id: 0,
  format_code_path: "",
  work_type_code_path: "",
  workspace_type_code_path: "",
  case_status_code_path: "",
  case_save_location_code_path: "",
  ref_no: "",
  title: "",
  client: "",
  due_date: "",
  active_save_slot: 1,
});

const caseData = ref({
  id: 0,
  format_code_path: "",
  work_type_code_path: "",
  workspace_type_code_path: "",
  case_status_code_path: "",
  case_save_location_code_path: "",
  ref_no: "",
  title: "",
  client: "",
  due_date: "",
  active_save_slot: 1,
  regist_time: "",
  update_time: "",
});

const isLoading = ref(false);
const caseCreateLock = ref(false);

// 케이스 데이터 가져오기
async function getCaseMasterData(caseID: string) {
  try {
    const caseReadResponse = await api.draft.caseRead({
      case_id: parseInt(caseID),
    });
    caseData.value = caseReadResponse.data.object;
  } catch (e: AxiosError | Error | any) {
    const error = extractError(e);
    Util.openAlertModal(stores, error.status);
  }
}

// 업무 종류 코드 가져오기
async function getWorkTypeCodes() {
  try {
    console.log("getWorkTypeCodes");
    const nodeReadChildrenResponse = await api.management.nodeReadChildren({
      parent_path: "SETTING/DRAFT/WORK_TYPE",
    });
    // console.log(nodeReadChildrenResponse);
    workTypeOptions.value = [];
    nodeReadChildrenResponse.data.objects.forEach((item) => {
      workTypeOptions.value.push({
        text: Util.getI18NTxt(stores, item.path, "setting_titles"),
        value: item.path,
      });
    });
  } catch (e: AxiosError | Error | any) {
    const error = extractError(e);
    Util.openAlertModal(stores, error.status);
  }
}

onMounted(async () => {
  console.log(
    "casemanagementmodal mounted",
    modalStore.caseManagementModal.caseID
  );

  spinner.value?.onSpin();

  // caseID가 없는 경우에는 새로운 케이스 등록
  if (!modalStore.caseManagementModal.caseID) {
    isDisabled.value = false;
    // 서버 시간 가져와서, 현재 사용기한이 남아 있는 format code 셋팅해줌
    // console.log(appStore.serverTime);
    const currentTime = appStore.serverTime.substring(0, 19);
    // currentTime = "2022-05-31T13:20:59";

    userStore.user.statuses.forEach((item) => {
      // console.log(currentTime);
      // console.log(item.expiration_time);
      if (currentTime <= item.expiration_time) {
        formatCodeOptions.value.push({
          text: item.format_code_path.substring(7),
          value: item.format_code_path,
        });
      }
    });

    // value 기본 값 초기화
    if (formatCodeOptions.value.length)
      formatCodeValue.value = {
        text: formatCodeOptions.value[0].text,
        value: formatCodeOptions.value[0].value,
      };

    // 사용자 설정 중 기본 양식으로 설정
    formatCodeOptions.value.forEach((item) => {
      if (
        item.value ===
        Util.getSettingValue(stores, "SETTING/DRAFT/DEFAULT_FORMAT")
      )
        formatCodeValue.value = item;
    });

    // 업무 종류 코드 가져와서, 기본 값으로 설정
    await getWorkTypeCodes();

    // 사용자 설정 중 DEFAULT_WORK_TYPE 으로 업무 종류 설정
    for (let i = 0; i < workTypeOptions.value.length; i++) {
      if (
        workTypeOptions.value[i].value ===
        "SETTING/DRAFT/WORK_TYPE/" +
          Util.getSettingValue(stores, "SETTING/DRAFT/WORK_TYPE")
      ) {
        workTypeValue.value = workTypeOptions.value[i];
        break;
      }
    }

    // 마감일 표시를 위해, format에 맞는 날짜 양식 설정
    datepickerInputFormat.value = Util.getDateFormat(
      Util.getSettingValue(stores, "SETTING/DRAFT/DEFAULT_FORMAT")
    );
    // 마감일의 placeholder로 오늘부터 한달 후의 날짜를 기본으로 설정
    datepickerPlaceholder.value =
      "e.g. " +
      Util.getDateTimeByFormat(
        datepickerInputFormat.value,
        new Date(new Date().setDate(new Date().getDate() + 30))
      );
    // 마감일의 locale 설정을 위해 현재 언어 내려줌
    datepickerLang.value = Util.getUILang(stores);
    // 초기값은 null로 설정해서 placeholder 표시
    dueDate.value = null;

    // console.log(workTypeValue.value);

    // 사용자 설정 중 기본 작업화면 구성으로 설정
    if (
      workTypeValue.value.value === "SETTING/DRAFT/WORK_TYPE/APPLICATION" ||
      workTypeValue.value.value === "SETTING/DRAFT/WORK_TYPE/PCT_APPLICATION"
    ) {
      workspaceTypeOptions.value.forEach((item) => {
        if (
          item.value ===
          "SETTING/DRAFT/WORKSPACE_TYPE/" +
            Util.getSettingValue(stores, "SETTING/DRAFT/WORKSPACE_TYPE")
        ) {
          workspaceTypeValue.value = item;
          workspaceTypeDesc.value = Util.getI18NTxt(
            stores,
            "SETTING/DRAFT/WORKSPACE_TYPE/" +
              Util.getSettingValue(stores, "SETTING/DRAFT/WORKSPACE_TYPE"),
            "setting_descs"
          );
        }
      });
    } else {
      workspaceTypeOptions.value.forEach((item) => {
        if (item.value === "SETTING/DRAFT/WORKSPACE_TYPE/MERGED") {
          workspaceTypeValue.value = item;
          workspaceTypeDesc.value = Util.getI18NTxt(
            stores,
            "SETTING/DRAFT/WORKSPACE_TYPE/" +
              Util.getSettingValue(stores, "SETTING/DRAFT/WORKSPACE_TYPE"),
            "setting_descs"
          );
        }
      });
    }

    // 사용자 설정 중 기본 저장위치로 설정
    saveLocationOptions.value.forEach((item) => {
      if (
        item.value ===
        "SETTING/GENERAL/SAVE_LOCATION/" +
          Util.getSettingValue(stores, "SETTING/GENERAL/SAVE_LOCATION")
      ) {
        saveLocationValue.value = item;
        saveLocationDesc.value = Util.getI18NTxt(
          stores,
          "SETTING/GENERAL/SAVE_LOCATION/" +
            Util.getSettingValue(stores, "SETTING/GENERAL/SAVE_LOCATION"),
          "setting_descs"
        );
      }
    });
  }
  // caseID가 있는 경우
  else {
    isDisabled.value = true;

    // console.log("케이스 수정", modalStore.caseManagementModal.caseID);
    await getCaseMasterData(modalStore.caseManagementModal.caseID);
    formatCodeValue.value = {
      text: caseData.value.format_code_path.substring(7),
      value: caseData.value.format_code_path,
    };
    workTypeValue.value = {
      text: Util.getI18NTxt(
        stores,
        caseData.value.work_type_code_path,
        "setting_titles"
      ),
      value: caseData.value.work_type_code_path,
    };
    refNo.value = caseData.value.ref_no;
    title.value = caseData.value.title;
    if (caseData.value.client !== null) client.value = caseData.value.client;
    else client.value = "";

    // console.log(caseData.value.due_date);
    // 마감일 표시를 위해, format에 맞는 날짜 양식 설정
    datepickerInputFormat.value = Util.getDateFormat(
      caseData.value.format_code_path
    );
    console.log(datepickerInputFormat.value);
    // 마감일의 placeholder로 오늘부터 한달 후의 날짜를 기본으로 설정
    datepickerPlaceholder.value =
      "e.g. " +
      Util.getDateTimeByFormat(
        datepickerInputFormat.value,
        new Date(new Date().setDate(new Date().getDate() + 30))
      );
    // 마감일의 locale 설정을 위해 현재 언어 내려줌
    datepickerLang.value = Util.getUILang(stores);

    // 케이스 정보에 마감일이 있으면, 해당 데이터로 설정
    if (caseData.value.due_date !== null) {
      dueDate.value = Util.getUserTime(
        caseData.value.due_date,
        Util.getTimezone(stores)
      );
    } else {
      // null로 설정해서 placeholder 표시
      dueDate.value = null;
    }

    // 작업화면 구성 설정
    // console.log(caseData.value.workspace_type_code_path);
    workspaceTypeOptions.value.forEach((item) => {
      if (item.value === caseData.value.workspace_type_code_path) {
        workspaceTypeValue.value = item;
        workspaceTypeDesc.value = Util.getI18NTxt(
          stores,
          caseData.value.workspace_type_code_path,
          "setting_descs"
        );
      }
    });
    // console.log(workspaceTypeValue.value);

    // 저장위치 설정
    // console.log(caseData.value.case_save_location_code_path);
    originalSaveLocation.value = caseData.value.case_save_location_code_path;
    saveLocationOptions.value.forEach((item) => {
      if (item.value === caseData.value.case_save_location_code_path) {
        saveLocationValue.value = item;
        saveLocationDesc.value = Util.getI18NTxt(
          stores,
          caseData.value.case_save_location_code_path,
          "setting_descs"
        );
      }
    });
    // console.log(saveLocationValue.value);
  }

  spinner.value?.offSpin();
});

watch(formatCodeValue, (newValue, oldValue) => {
  // 마감일 표시를 위해, format에 맞는 날짜 양식 설정
  datepickerInputFormat.value = Util.getDateFormat(newValue.value);
  // 마감일의 placeholder로 오늘부터 한달 후의 날짜를 기본으로 설정
  datepickerPlaceholder.value =
    "e.g. " +
    Util.getDateTimeByFormat(
      datepickerInputFormat.value,
      new Date(new Date().setDate(new Date().getDate() + 30))
    );
});

watch(workTypeValue, () => {
  if (
    workTypeValue.value.value === "SETTING/DRAFT/WORK_TYPE/APPLICATION" ||
    workTypeValue.value.value === "SETTING/DRAFT/WORK_TYPE/PCT_APPLICATION"
  ) {
    shouldBeMerged.value = false;

    // 사용자 설정 중 기본 작업화면 구성으로 설정
    workspaceTypeOptions.value.forEach((item) => {
      if (
        item.value ===
        "SETTING/DRAFT/WORKSPACE_TYPE/" +
          Util.getSettingValue(stores, "SETTING/DRAFT/WORKSPACE_TYPE")
      ) {
        workspaceTypeValue.value = item;
        workspaceTypeDesc.value = Util.getI18NTxt(
          stores,
          "SETTING/DRAFT/WORKSPACE_TYPE/" +
            Util.getSettingValue(stores, "SETTING/DRAFT/WORKSPACE_TYPE"),
          "setting_descs"
        );
      }
    });
  } else {
    // 사용자 설정 중 기본 작업화면 구성으로 설정
    workspaceTypeOptions.value.forEach((item) => {
      if (item.value === "SETTING/DRAFT/WORKSPACE_TYPE/MERGED") {
        workspaceTypeValue.value = item;
        workspaceTypeDesc.value = Util.getI18NTxt(
          stores,
          "SETTING/DRAFT/WORKSPACE_TYPE/" +
            Util.getSettingValue(stores, "SETTING/DRAFT/WORKSPACE_TYPE"),
          "setting_descs"
        );
      }
    });

    shouldBeMerged.value = true;
  }
});

watch(workspaceTypeValue, (newValue, oldValue) => {
  workspaceTypeDesc.value = Util.getI18NTxt(
    stores,
    newValue.value,
    "setting_descs"
  );
});

watch(saveLocationValue, (newValue, oldValue) => {
  saveLocationDesc.value = Util.getI18NTxt(
    stores,
    newValue.value,
    "setting_descs"
  );
});

const spinner = ref<IIComponentSpinner>();

// 저장 버튼 눌렀을 때 액션
async function saveClick() {
  console.log("saveClick");
  if (!refNo.value.trim()) {
    refNoShowMsg.value = true;
    refNoValid.value = false;
    document.getElementById("refno-input")?.focus();
    refNoFailedMsg.value = Util.getI18NTxt(
      stores,
      "I18N/COMMON/MESSAGE/REQUEST_DATA_ALERT"
    );
    return;
  } else if (refNo.value.length > 200) {
    refNoShowMsg.value = true;
    refNoValid.value = false;
    document.getElementById("refno-input")?.focus();
    refNoFailedMsg.value = Util.getI18NTxt(
      stores,
      "I18N/COMMON/MESSAGE/MAX_LENGTH_ALERT"
    ).replace("$NUMBER$", "200");
    return;
  } else {
    refNoShowMsg.value = false;
    refNoValid.value = true;
    refNoFailedMsg.value = "";
  }
  if (!title.value.trim()) {
    titleShowMsg.value = true;
    titleValid.value = false;
    document.getElementById("title-input")?.focus();
    titleFailedMsg.value = Util.getI18NTxt(
      stores,
      "I18N/COMMON/MESSAGE/REQUEST_DATA_ALERT"
    );
    return;
  } else if (title.value.length > 200) {
    titleShowMsg.value = true;
    titleValid.value = false;
    document.getElementById("title-input")?.focus();
    titleFailedMsg.value = Util.getI18NTxt(
      stores,
      "I18N/COMMON/MESSAGE/MAX_LENGTH_ALERT"
    ).replace("$NUMBER$", "200");
    return;
  } else {
    titleShowMsg.value = false;
    titleValid.value = true;
    titleFailedMsg.value = "";
  }

  if (client.value.length > 200) {
    clientShowMsg.value = true;
    clientValid.value = false;
    document.getElementById("client-input")?.focus();
    clientFailedMsg.value = Util.getI18NTxt(
      stores,
      "I18N/COMMON/MESSAGE/MAX_LENGTH_ALERT"
    ).replace("$NUMBER$", "200");
    return;
  } else {
    clientShowMsg.value = false;
    clientValid.value = true;
    clientFailedMsg.value = "";
  }

  // 신규 케이스 등록
  if (!modalStore.caseManagementModal.caseID) {
    await requestCaseCreate();
  }
  // 케이스 정보 수정
  else {
    await requestCaseUpdate();
  }
}
const asyncSaveClick = asyncDebounce(saveClick);
const asyncSaveClickSpiner = () =>
  spinner.value?.setSpinner(asyncSaveClick, "translucent")(); // 저장 스피너

async function requestCaseCreate() {
  console.log("requestCaseCreate");
  if (!caseCreateLock.value) {
    // 다중 요청 방지
    caseCreateLock.value = true;

    // 워크스페이스 다중 접속 방지, 브로드캐스팅
    localStorage.removeItem(BC_CHANNEL_WORKSPACE_ACTIVATION);
    localStorage.setItem(BC_CHANNEL_WORKSPACE_ACTIVATION, "who's there?");
    workspaceStore.postBcWorkspaceActivation();

    try {
      saveParams.value.format_code_path = formatCodeValue.value.value;
      saveParams.value.work_type_code_path = workTypeValue.value.value;
      saveParams.value.ref_no = refNo.value.trim();
      saveParams.value.title = title.value.trim();
      saveParams.value.case_status_code_path = "DR_CASE_STATUS/S01";
      if (dueDate.value)
        saveParams.value.due_date = dueDate.value.toISOString();
      else saveParams.value.due_date = null;
      if (client.value) saveParams.value.client = client.value.trim();
      else saveParams.value.client = null;
      saveParams.value.workspace_type_code_path =
        workspaceTypeValue.value.value;
      saveParams.value.case_save_location_code_path =
        saveLocationValue.value.value;

      // 워크스페이스 다중 접속 방지
      // 브로드캐스팅 완료까지 1초 기다림
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
      const dangling = localStorage.getItem(BC_CHANNEL_WORKSPACE_ACTIVATION);
      if (dangling !== null) {
        const caseCreateResponse = await api.draft.caseCreate(saveParams.value);
        if (caseCreateResponse.status === 201) {
          modalStore.caseManagementModal.hide();

          // 케이스 캐시 데이터 등록
          workspaceStore.id = caseCreateResponse.data.object.id;
          workspaceStore.reviewID = undefined;
          workspaceStore.context = "general";
          workspaceStore.active_save_slot = 1; // 초기값 고정
          workspaceStore.case_save_location_code_path =
            saveLocationValue.value.value;

          appStore.setIsNewCase(true);
          appStore.setGotoWorkspace(true);
        } else {
          // TODO: 에러 리포팅, 201 코드 말고는 반환되면 안됨
          console.error(caseCreateResponse);
        }
      } else {
        // TODO: i18n
        Util.openAlertModal(stores, "Only one workspace allowed.");
      }
    } catch (e: AxiosError | Error | any) {
      // TODO: i18n
      // TODO: 에러 리포팅, 백엔드 에러
      Util.openAlertModal(stores, "케이스 생성에 실패했습니다.");
    }

    // 락 해제
    caseCreateLock.value = false;
  }
}

async function requestCaseUpdate() {
  appStore.onSpin();

  try {
    saveParams.value.id = parseInt(modalStore.caseManagementModal.caseID);
    saveParams.value.case_status_code_path =
      caseData.value.case_status_code_path;
    saveParams.value.format_code_path = formatCodeValue.value.value;
    saveParams.value.work_type_code_path = workTypeValue.value.value;
    saveParams.value.ref_no = refNo.value.trim();
    saveParams.value.title = title.value.trim();
    if (dueDate.value) saveParams.value.due_date = dueDate.value.toISOString();
    else saveParams.value.due_date = null;
    if (client.value) saveParams.value.client = client.value.trim();
    else saveParams.value.client = null;
    saveParams.value.case_save_location_code_path =
      saveLocationValue.value.value;
    saveParams.value.active_save_slot = caseData.value.active_save_slot;

    // 저장위치가 변경되었을 경우에, 서버에 케이스 데이터 저장 또는 삭제 요청 & 로컬 데이터 저장 또는 삭제 요청
    if (originalSaveLocation.value !== saveLocationValue.value.value) {
      console.log("save location changed!");
      const response = await api.draft.readSlotsOfCase({
        case_id: workspaceStore.id,
      });
      const slots = response.data.objects;
      const backupSlots = [
        SlotType.basic_1,
        SlotType.basic_2,
        SlotType.basic_3,
      ];

      if (saveLocationValue.value.value === appStore.saveLocal) {
        console.log("save to local");
        // 로컬 재오픈 해야함
        await tldexie.open(workspaceStore.id, appStore.saveLocal);

        // 클라우드에서 데이터 이전
        for (const slot of backupSlots) {
          const slotInfo = slots[slot - 1];
          if (slotInfo.save_time) {
            await tldexie.downloadFromCloudAll(slot);
            const keys = await tldexie.getCacheKeys();
            await tldexie.saveToLocalAll(slot, keys);
          }
        }

        // 클라우드 데이터 삭제
        await TwoLayeredDexie.deleteAllCloud(workspaceStore.id, true);
      } else if (saveLocationValue.value.value === appStore.saveCloud) {
        console.log("save to cloud");

        // 로컬에서 데이터 이전
        for (const slot of backupSlots) {
          const slotInfo = slots[slot - 1];
          if (slotInfo.save_time) {
            await tldexie.readFromLocalAll(slot);
            const keys = await tldexie.getCacheKeys();
            await tldexie.uploadToCloudAll(slot, keys);
          }
        }

        // 로컬 데이터 삭제
        await TwoLayeredDexie.deleteAllLocal(workspaceStore.id);
      }
    }

    // 케이스 데이터 업데이트
    const caseUpdateResponse = await api.draft.caseUpdate(saveParams.value);
    if (caseUpdateResponse.status === 200) {
      // appStore.isLoading = false;
      // 케이스 수정 성공. 성공 코드는 200밖에 없음. 나머지는 exception이어서 else 탈일 없음

      // 케이스 캐시 데이터 등록
      const caseCacheUpdateResponse = await api.draft.createOrUpdateCacheOfCase(
        {
          case_master_id: caseUpdateResponse.data.object.id,
          save_slot: caseUpdateResponse.data.object.active_save_slot,
          case_save_location_code_path:
            caseUpdateResponse.data.object.case_save_location_code_path,
        }
      );

      if (caseCacheUpdateResponse.status === 200) {
        workspaceStore.id = caseUpdateResponse.data.object.id;
        workspaceStore.active_save_slot =
          caseUpdateResponse.data.object.active_save_slot;
        workspaceStore.case_save_location_code_path =
          caseUpdateResponse.data.object.case_save_location_code_path;

        appStore.isNewCase = false;
      } else {
        // appStore.isLoading = false;
        Util.openAlertModal(stores, caseCacheUpdateResponse.status);
      }

      modalStore.caseManagementModal.hide();

      Util.openInfoModal(
        stores,
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/CASE_UPDATED"),
        true
      );

      // 새로 고침에 경우, 새로고침 시나리오에서 appStore.offSpin() 동작
      if (router.currentRoute.value.path === "/draft/workspace")
        workspaceStore.forceRefreshWorkspace();
      else appStore.setRefreshDashboard(true);
    } else {
      Util.openAlertModal(stores, caseUpdateResponse.status);
    }
  } catch (e: AxiosError | Error | any) {
    appStore.offSpin();
    console.error(e); // TODO: 스낵바, 로거 수정
  } finally {
    appStore.offSpin();
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/stylesheets/draft/main";
.modal-wrapper {
  position: fixed;
  z-index: 9999;
  display: grid;
  place-content: center;
  width: 100vw;
  height: 100vh;
  .modal-backgrounds {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 9999;
  }
  .modal-contents {
    position: relative;
    z-index: 9999;
    background-color: white;
    border-radius: 0.5rem;
    width: 36.25rem;
    opacity: 1;
    .description {
      font-weight: 500;
      font-size: 1.125rem;
      line-height: 1.5rem;
      color: #1b1a1b;
    }
    .checkBox {
      width: 1rem;
      height: 1rem;
      border: 2px solid #bcbcbc;
      border-radius: 0.25rem;
    }
  }
}
</style>
