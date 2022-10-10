<template>
  <v-container
    class="workspace-header d-flex align-center justify-space-between"
    fluid
    :style="{
      backgroundColor: Util.getColor(stores, 'HEADER'),
    }"
  >
    <div class="d-flex align-center">
      <!-- 뒤로가기 버튼 -->
      <IconBtn
        :style="{ color: Util.getColor(stores, 'HEADER_TEXT') }"
        :icon="mdiChevronLeft"
        width="2rem"
        height="2rem"
        @click="onClickBackBtn"
      />
      <!-- 케이스 명칭 -->
      <div class="ml-3">
        <div class="d-flex align-center">
          <!-- 케이스 Ref.no -->
          <div
            class="d-flex text-bold-18-white mr-2"
            style="margin-right: 1.875rem"
            :style="{
              cursor: isReadonlyWindow ? '' : 'pointer',
              color: Util.getColor(stores, 'HEADER_TEXT'),
            }"
            @click="openCaseManagementModal"
          >
            [
            <div v-html="caseRefNoTxt" />
            ]
            <div class="ml-1" v-html="caseTitleTxt" />
          </div>
          <!-- 케이스 상태 -->
          <div
            class="text-bold-12-white mt-1"
            :style="{
              backgroundColor: caseStatusColor,
              height: '1.25rem',
              padding: '0.125rem 0.625rem',
              borderRadius: '0.75rem',
              cursor: isReadonlyWindow ? '' : 'pointer',
              lineHeight: '1rem',
              color: 'white',
            }"
            @click="openStatusModal"
          >
            {{ caseStatus }}
          </div>
          <div
            class="ml-4"
            :style="{ cursor: isReadonlyWindow ? '' : 'pointer' }"
            @click="openCaseManagementModal"
          >
            <v-icon
              v-if="
                workspaceStore.caseMasterData.case_save_location_code_path ===
                'SETTING/GENERAL/SAVE_LOCATION/LOCAL'
              "
              class="save-location ma-0 pa-0"
              :style="{ color: Util.getColor(stores, 'HEADER_TEXT') }"
              :icon="mdiLaptop"
              tooltip="LOCAL"
            />
            <v-icon
              v-else
              class="save-location ma-0 pa-0"
              :style="{ color: Util.getColor(stores, 'HEADER_TEXT') }"
              :icon="mdiCloudCheckOutline"
              tooltip="CLOUD"
            />
          </div>
        </div>
        <div
          class="d-flex align-center"
          :style="{ cursor: isReadonlyWindow ? '' : 'pointer' }"
          @click="openCaseManagementModal"
        >
          <!-- 의뢰인, 마감일 -->
          <div
            class="d-flex align-center text-400-14-white"
            :style="{ color: Util.getColor(stores, 'HEADER_TEXT') }"
          >
            <div style="line-height: 1.5rem">
              {{
                Util.getI18NTxt(stores, "I18N/DASHBOARD/CASE_BOX/CLIENT")
              }}:&nbsp;
            </div>
            <div class="mr-3" v-html="clientTxt" />
            <div style="line-height: 1.5rem">
              {{ Util.getI18NTxt(stores, "I18N/DASHBOARD/CASE_BOX/DUEDATE") }}:
            </div>
            <div style="line-height: 1.5rem">
              {{ duedate }}
            </div>
            <!-- 마감 경과 기간 -->
            <span
              v-if="!isReadonlyWindow"
              class="ml-2 text-red font-weight-bold"
              :style="{ fontSize: '1rem' }"
              >{{ pastDuedate }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex align-center">
      <span
        class="mr-4 text-white"
        v-if="appStore.isReview"
        :style="{ color: Util.getColor(stores, 'HEADER_TEXT') }"
        >{{
          Util.getI18NTxt(stores, "I18N/WORKSPACE/HEADER/COMPLETE_REVIEW")
        }}</span
      >
      <v-btn
        v-if="appStore.isReview"
        class="mr-8"
        :style="{
          height: '2.5rem',
          color: 'white',
          backgroundColor: '#3ccfcf',
          fontWeight: 'bold',
          lineHeight: '100%',
          fontSize: '1rem',
        }"
        @click="openReviewEndModal"
        color="#5c6bc0"
        flat
        >{{
          Util.getI18NTxt(
            stores,
            "I18N/WORKSPACE/HEADER/COMPLETE_REVIEW_BUTTON"
          )
        }}</v-btn
      >
      <img
        v-if="Util.getColor(stores, 'HEADER_TEXT') === '#717171FF'"
        src="@/assets/images/draft-logo-gray.svg"
        alt="LOGO"
        width="153"
        height="16"
      />
      <img
        v-else-if="Util.getColor(stores, 'HEADER_TEXT') === '#574457FF'"
        src="@/assets/images/draft-logo-maroon.svg"
        alt="LOGO"
        width="153"
        height="16"
      />
      <img
        v-else
        src="@/assets/images/draft.svg"
        alt="LOGO"
        width="153"
        height="16"
      />
    </div>
  </v-container>

  <teleport to="#modal-area">
    <Modal
      ref="reviewEndModal"
      title="리뷰 완료하기"
      description="리뷰를 종료하고 유저(이메일)님 에게 케이스 편집 권한을 보내시겠습니까?"
      buttonType="NY"
      noTxt="닫기"
      yesTxt="리뷰 완료"
      :yesFunc="closeReviewEndModal"
    >
    </Modal>

    <!-- status-modal -->
    <Modal
      ref="statusModal"
      :title="
        Util.getI18NTxt(
          stores,
          'I18N/DASHBOARD/CASE_STATUS_MODAL/HEADER'
        ).replace('$REFNO$', workspaceStore.caseMasterData.ref_no)
      "
      buttonType="NY"
      :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CLOSE')"
      :yesTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/SAVE')"
      :yesFunc="
        () => {
          changeStatus();
        }
      "
    >
      <div class="mb-4">
        <div
          class="text-500-18-black"
          :style="{ width: '37rem', color: themeStore.darkmodeColor }"
          v-html="
            Util.getI18NTxt(
              stores,
              'I18N/DASHBOARD/CASE_STATUS_MODAL/CONTENT'
            ).replace('$REFNO$', workspaceStore.caseMasterData.ref_no)
          "
        ></div>

        <VBtns
          class="mt-5"
          :borderColor="themeStore.darkmodeBorder"
          :btnColor="themeStore.workspacePrimary"
          v-model="caseStatusModalValue"
          :options="caseStatusModalOptions"
        ></VBtns>
      </div>
    </Modal>
  </teleport>
</template>

<script lang="ts" setup>
import api from "@/api/api";
import { extractError } from "@/api/error";
import * as Util from "@/assets/javascripts/ipedit_util";
import { asyncDebounce } from "@/assets/javascripts/utils/asyncDebounce";
import IconBtn from "@/components/common/IconBtn.vue";
import Modal from "@/components/common/modal/Modal.vue";
import VBtns from "@/components/VBtns.vue";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import type { ModalType } from "@/types/modal";
import { mdiChevronLeft, mdiLaptop, mdiCloudCheckOutline } from "@mdi/js";
import type { AxiosError } from "axios";
import { onMounted, ref, onBeforeMount, watch, computed } from "vue";
import { useRouter } from "vue-router";

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

// 상태 정보 변경/완료처리/삭제용
const saveParams = ref({
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

// 의뢰인 설정
const client = ref("-");

// 마감일 설정 -> 해당 케이스의 양식(format_code)에 따른 날짜표시 유형으로 셋팅(케이스 생성할 때에도 이렇게 보여줌)
const duedate = ref("-");

// 마감일 경과 설정
const pastDuedate = ref("");

// 케이스 상태 표시 text
const caseStatus = ref("");

// 케이스 상태 표시 색상: 기본(작성중)
const caseStatusColor = ref("#2196f3");

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

// 헤더 텍스트
let cutLength = 120;
if (Util.isKIPO(stores)) cutLength = 100;
const caseRefNoTxt = computed(() =>
  Util.cutString(workspaceStore.caseMasterData.ref_no, cutLength).replaceAll(
    " ",
    "&nbsp;"
  )
);
const caseTitleTxt = computed(() =>
  Util.cutString(workspaceStore.caseMasterData.title, cutLength).replaceAll(
    " ",
    "&nbsp;"
  )
);
const clientTxt = computed(() =>
  Util.cutString(client.value, cutLength).replaceAll(" ", "&nbsp;")
);

type optionType = {
  text: string;
  value: string;
};

// 상태 변경 모달에서 띄울 값 설정
const caseStatusModalValue = ref<optionType>({
  text: "",
  value: "",
});
const caseStatusModalOptions = ref<optionType[]>([
  {
    text: Util.getI18NTxt(stores, "DR_CASE_STATUS/S01"),
    value: "DR_CASE_STATUS/S01",
  },
  {
    text: Util.getI18NTxt(stores, "DR_CASE_STATUS/S02"),
    value: "DR_CASE_STATUS/S02",
  },
  {
    text: Util.getI18NTxt(stores, "DR_CASE_STATUS/S03"),
    value: "DR_CASE_STATUS/S03",
  },
  {
    text: Util.getI18NTxt(stores, "DR_CASE_STATUS/S04"),
    value: "DR_CASE_STATUS/S04",
  },
]);

const statusModal = ref<ModalType>();

const router = useRouter();

function onClickBackBtn() {
  modalStore.confirmModal.title = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/HEADER/BACK_ALERT_HEADER"
  );
  modalStore.confirmModal.desc = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/HEADER/BACK_ALERT_CONTENT"
  );
  modalStore.confirmModal.noButtonText = Util.getI18NTxt(
    stores,
    "I18N/BUTTON/NO"
  );
  modalStore.confirmModal.yesButtonText = Util.getI18NTxt(
    stores,
    "I18N/BUTTON/YES"
  );

  modalStore.confirmModal.yesButtonFunc = () => {
    // 케이스 상태가 완료이면 archive로
    if (
      workspaceStore.caseMasterData.case_status_code_path ===
      "DR_CASE_STATUS/S77"
    )
      router.push("/draft/archive");
    // 케이스 상태가 삭제이면 review로
    else if (
      workspaceStore.caseMasterData.case_status_code_path ===
      "DR_CASE_STATUS/S99"
    )
      router.push("/draft/trash");
    // 케이스 상태가 나머지면 dashboard로
    else router.push("/draft/dashboard");
    modalStore.confirmModal.hide();
  };
  modalStore.confirmModal.show();
}

// 리뷰 완료 모달
const reviewEndModal = ref<any>(null);

const openReviewEndModal = () => reviewEndModal.value.show();
const closeReviewEndModal = () => reviewEndModal.value.hide();

// 케이스 관리모달 오픈
function openCaseManagementModal() {
  if (isReadonlyWindow.value) return;
  const currentTime = appStore.serverTime.substring(0, 19);
  // currentTime = "2022-05-31T13:20:59";

  // 사용자 status에서 현재 사용기한이 남아 있는 format code 셋팅해줌
  let availableServiceCnt = 0;
  userStore.user.statuses.forEach((item) => {
    if (currentTime.substring(0, 19) <= item.expiration_time) {
      availableServiceCnt++;
    }
  });
  // availableServiceCnt = 0;
  if (availableServiceCnt > 0) {
    if (workspaceStore.id > -1)
      modalStore.caseManagementModal.caseID = workspaceStore.id + "";
    else modalStore.caseManagementModal.caseID = "";
    modalStore.caseManagementModal.show();
  } else {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/SIDEBAR/NO_AVAILABLE_SERVICE")
    );
  }
}

function openStatusModal() {
  if (isReadonlyWindow.value) return;

  statusModal.value?.show();
}

// 상태변경 요청
function changeStatus() {
  asyncChangeCaseStatus();
}
const asyncChangeCaseStatus = asyncDebounce(requestChangeCaseStatus);
async function requestChangeCaseStatus() {
  try {
    saveParams.value.id = workspaceStore.id;
    saveParams.value.ref_no = workspaceStore.caseMasterData.ref_no;
    saveParams.value.title = workspaceStore.caseMasterData.title;
    saveParams.value.case_save_location_code_path =
      workspaceStore.caseMasterData.case_save_location_code_path;
    saveParams.value.due_date = workspaceStore.caseMasterData.due_date;
    saveParams.value.client = workspaceStore.caseMasterData.client;
    saveParams.value.active_save_slot =
      workspaceStore.caseMasterData.active_save_slot;

    // 상태값 설정
    saveParams.value.case_status_code_path = caseStatusModalValue.value.value;

    const caseUpdateResponse = await api.draft.caseUpdate(saveParams.value);
    // 케이스 상태 변경 성공. 성공 코드는 200밖에 없음. 나머지는 exception이어서 else 탈일 없음
    if (caseUpdateResponse.status === 200) {
      statusModal.value.isOpen = false;

      Util.openInfoModal(
        stores,
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/CASE_STATUS_UPDATED"),
        true
      );

      // // 스토어 데이터 수정
      // workspaceStore.caseMasterData.case_status_code_path =
      //   caseStatusModalValue.value.value;

      appStore.onSpin();
      workspaceStore.forceRefreshWorkspace();
    } else {
      Util.openAlertModal(stores, caseUpdateResponse.status);
    }
  } catch (e: AxiosError | Error | any) {
    const error = extractError(e);
    Util.openAlertModal(stores, error.status);
  } finally {
    //
  }
}

// 케이스 데이터 설정 -> 덱시에서 케이스 정보 읽어와서 표시 정보 셋팅해줌
function initialSetupHeaderData() {
  if (workspaceStore.caseMasterData.client) {
    client.value = workspaceStore.caseMasterData.client;
  }

  if (workspaceStore.caseMasterData.due_date) {
    duedate.value = Util.getDateTimeByFormat(
      Util.getDateFormat(workspaceStore.caseMasterData.format_code_path),
      Util.getUserTime(
        workspaceStore.caseMasterData.due_date,
        Util.getTimezone(stores)
      )
    );
  }

  if (
    duedate.value !== "-" &&
    Util.getDateTimeByFormat(
      Util.getDateFormat(workspaceStore.caseMasterData.format_code_path)
    ) > duedate.value
  ) {
    pastDuedate.value = Util.getI18NTxt(
      stores,
      "I18N/DASHBOARD/CASE_BOX/PAST_DUEDATE"
    ).replace(
      "$COUNT$",
      Util.getDateDiff(
        Util.getDateTimeByFormat(
          Util.getDateFormat(workspaceStore.caseMasterData.format_code_path)
        ),
        duedate.value,
        Util.getDateFormat(workspaceStore.caseMasterData.format_code_path)
      )
    );
  } else {
    pastDuedate.value = "";
  }

  caseStatus.value = Util.getI18NTxt(
    stores,
    workspaceStore.caseMasterData.case_status_code_path
  );

  // 초안 발송 완료
  if (
    workspaceStore.caseMasterData.case_status_code_path === "DR_CASE_STATUS/S02"
  )
    caseStatusColor.value = "#45748a";
  // 수정 중
  else if (
    workspaceStore.caseMasterData.case_status_code_path === "DR_CASE_STATUS/S03"
  )
    caseStatusColor.value = "#ef8050";
  // 제출 대기 중
  else if (
    workspaceStore.caseMasterData.case_status_code_path === "DR_CASE_STATUS/S04"
  )
    caseStatusColor.value = "#25b372";
  // TODO: 리뷰 중, 리뷰 완료 추가

  caseStatusModalValue.value = {
    text: Util.getI18NTxt(
      stores,
      workspaceStore.caseMasterData.case_status_code_path
    ),
    value: workspaceStore.caseMasterData.case_status_code_path,
  };

  console.log("wheader component initialized");
}

watch(workspaceStore, () => {
  // workspace에서 초기화 셋팅 작업이 끝난 다음에 데이터 로딩 진행
  if (workspaceStore.initializeHeader) {
    initialSetupHeaderData();
    workspaceStore.initializeHeader = false;
  }
});

onBeforeMount(() => {
  // initialSetupHeaderData();
});

onMounted(() => {
  console.log("wheader mounted");
});
</script>

<style lang="scss">
@import "@/styles/draft/text";

.workspace-header {
  width: 100%;
  min-width: 90rem;
  height: 4.5rem;
  background-color: #4857ab;
}

%status {
  position: absolute;
  right: 1.25rem;
  bottom: 1.125rem;
  width: max-content;
  height: 2rem;
  padding: 0.3125rem 0.9375rem;
  border-radius: 1.25rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}
.writing {
  @extend %status;
  background: #2196f3;
  /* Inside auto layout */
  flex: none;
  order: 1;
  flex-grow: 0;
}
.send {
  @extend %status;
  color: white;
  background: #45748a;
  /* Inside auto layout */
  flex: none;
  order: 1;
  flex-grow: 0;
}
.modifing {
  @extend %status;
  background: #ef8050;
  /* Inside auto layout */
  flex: none;
  order: 1;
  flex-grow: 0;
}
.waiting {
  @extend %status;
  background: #25b372;
  /* Inside auto layout */
  flex: none;
  order: 1;
  flex-grow: 0;
}
.save-location {
  border-radius: 0.25rem;
  width: 1.5rem;
}
</style>
