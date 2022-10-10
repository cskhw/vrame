<template>
  <div
    class="casecard d-flex flex-column align-start"
    :style="{
      '--color-hover': '#fafafa',
    }"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <!-- 호버 버튼 영역 -->
    <div class="casecard-btns-hover d-flex align-center" v-if="isHover">
      <v-icon
        class="right-btn ma-0 pa-0 mr-3"
        :style="{ width: '1.5rem' }"
        :icon="mdiPencil"
        @click="onClickIcon('edit')"
      />
      <v-icon
        class="right-btn ma-0 pa-0 mr-3"
        :style="{ width: '1.5rem' }"
        :icon="mdiDelete"
        @click="onClickIcon('delete')"
      />
      <v-btn
        v-if="$route.path !== '/draft/archive'"
        :color="Util.getColor(stores, 'BUTTON')"
        flat
        :style="{
          fontSize: '0.875rem',
          color: Util.getColor(stores, 'BUTTON_TEXT'),
          height: '1.75rem',
        }"
        @click="onClickIcon('complete')"
        >{{
          Util.getI18NTxt(
            stores,
            "I18N/DASHBOARD/CASE_BOX/CHECK_COMPLETE_BUTTON"
          )
        }}</v-btn
      >
    </div>
    <!-- refNo -->
    <span class="casecard-refno mb-1 text-400-12-gray2" @click="goWorkspace">
      {{ refNo }}
    </span>
    <!-- workType -->
    <span class="d-flex justify-center align-center mb-2" @click="goWorkspace"
      ><div class="casecard-worktype text-bold-11-white">
        {{ workType }}
      </div>
      <!-- 제목 -->
      <span class="casecard-title text-bold-16-black pl-2 mr-4"
        >{{ title }}
      </span>
      <v-icon
        v-if="
          item.case_save_location_code_path ===
          'SETTING/GENERAL/SAVE_LOCATION/LOCAL'
        "
        class="save-location ma-0 pa-0 mr-3"
        :icon="exists ? mdiLaptop : mdiLaptopOff"
        :color="exists ? '#bcbdc6' : colors.CASECARD_NONE_DB"
        tooltip="LOCAL"
      />

      <v-icon
        v-else
        class="save-location ma-0 pa-0 mr-3"
        :icon="mdiCloudCheckOutline"
        tooltip="CLOUD"
      />
    </span>
    <!-- 의뢰인 -->
    <span
      class="casecard-client d-flex text-400-12-gray2"
      style="margin-bottom: 0.125rem"
    >
      {{ Util.getI18NTxt(stores, "I18N/DASHBOARD/CASE_BOX/CLIENT") }}: &nbsp;
      <div v-html="client"></div>
    </span>
    <!-- 마감일 -->
    <span class="text-400-12-gray2" style="margin-bottom: 0.125rem">
      {{ Util.getI18NTxt(stores, "I18N/DASHBOARD/CASE_BOX/DUEDATE") }}:
      {{ duedate
      }}<span
        class="ml-2 text-red font-weight-bold"
        style="font-size: 0.75rem"
        >{{ pastDuedate }}</span
      ></span
    >
    <!-- 마지막 저장 시간 -->
    <div class="status d-flex justify-space-between align-end">
      <span class="text-400-12-gray2">
        {{ Util.getI18NTxt(stores, "I18N/DASHBOARD/CASE_BOX/LAST_SAVE_TIME") }}:
        {{ updateTime }}
      </span>
      <div
        class="status"
        :class="caseStatusStyle"
        @click="onClickIcon('status')"
      >
        {{ caseStatus }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from "@/api/api";
import colors from "@/assets/javascripts/colors";
import { tldexie } from "@/assets/javascripts/dexie";
import * as Util from "@/assets/javascripts/ipedit_util";
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import type { CaseMasterDataType } from "@/types/case";
import {
  mdiDelete,
  mdiPencil,
  mdiLaptop,
  mdiLaptopOff,
  mdiCloudCheckOutline,
} from "@mdi/js";
import { computed, onMounted, ref } from "vue";

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
  ws: workspaceStore,
};

const props = defineProps<{
  item: CaseMasterDataType;
}>();

// 관리번호 설정
const refNo = computed(() =>
  stores.as.lang.includes("KO")
    ? Util.cutString(props.item.ref_no, 50)
    : stores.as.lang.includes("EN")
    ? Util.cutString(props.item.ref_no, 30)
    : stores.as.lang.includes("JA")
    ? Util.cutString(props.item.ref_no, 50)
    : Util.cutString(props.item.ref_no, 50)
);

// 케이스 명칭 설정
const title = computed(() =>
  stores.as.lang.includes("KO")
    ? Util.cutString(props.item.title, 45)
    : stores.as.lang.includes("EN")
    ? Util.cutString(props.item.title, 30)
    : stores.as.lang.includes("JA")
    ? Util.cutString(props.item.title, 45)
    : Util.cutString(props.item.title, 45)
);
// 작업 종류 설정
const workType = ref(
  Util.getI18NTxt(stores, props.item.work_type_code_path, "setting_titles")
);

// 의뢰인 설정
const client = ref("-");

if (props.item.client) {
  client.value = stores.as.lang.includes("KO")
    ? Util.cutString(props.item.title, 72)
    : stores.as.lang.includes("EN")
    ? Util.cutString(props.item.title, 72)
    : stores.as.lang.includes("JA")
    ? Util.cutString(props.item.title, 72)
    : Util.cutString(props.item.title, 72);
}

// 마감일 설정 -> 해당 케이스의 양식(format_code)에 따른 날짜표시 유형으로 셋팅(케이스 생성할 때에도 이렇게 보여줌)
const duedate = ref("-");
if (props.item.due_date) {
  duedate.value = Util.getDateTimeByFormat(
    Util.getDateFormat(props.item.format_code_path),
    Util.getUserTime(props.item.due_date, Util.getTimezone(stores))
  );
}
// 마감일 경과 설정
const pastDuedate = ref("");
if (
  duedate.value !== "-" &&
  Util.getDateTimeByFormat(Util.getDateFormat(props.item.format_code_path)) >
    duedate.value
) {
  pastDuedate.value = Util.getI18NTxt(
    stores,
    "I18N/DASHBOARD/CASE_BOX/PAST_DUEDATE"
  ).replace(
    "$COUNT$",
    Util.getDateDiff(
      Util.getDateTimeByFormat(Util.getDateFormat(props.item.format_code_path)),
      duedate.value,
      Util.getDateFormat(props.item.format_code_path)
    )
  );
}
// 마지막 수정일 설정
const updateTime = ref("-");
if (props.item.update_time) {
  updateTime.value = Util.getDateTimeByFormat(
    Util.getDateFormat(props.item.format_code_path) + " HH:mm:ss",
    Util.getUserTime(props.item.update_time, Util.getTimezone(stores))
  );
}

// 케이스 상태 표시 text
const caseStatus = ref(
  Util.getI18NTxt(stores, props.item.case_status_code_path)
);
// 케이스 상태 표시 style
const caseStatusStyle = ref("writing");
if (props.item.case_status_code_path === "DR_CASE_STATUS/S02")
  caseStatusStyle.value = "send";
else if (props.item.case_status_code_path === "DR_CASE_STATUS/S03")
  caseStatusStyle.value = "modifing";
else if (props.item.case_status_code_path === "DR_CASE_STATUS/S04")
  caseStatusStyle.value = "waiting";
//TODO: 리뷰 중, 리뷰 완료 추가

const isHover = ref(false);

function onClickIcon(type: string) {
  appStore.caseManagementFunction = type;
  appStore.caseManagementLocation = "caseCard";
  appStore.caseManagementData = props.item;
}

const exists = ref(true);

async function goWorkspace() {
  try {
    // 로컬 저장인 경우, Dexie 확인
    if (
      props.item.case_save_location_code_path ===
      "SETTING/GENERAL/SAVE_LOCATION/LOCAL"
    ) {
      console.log("props.item.id: ", props.item.id);
      const msg = Util.getI18NTxt(
        stores,
        "I18N/DASHBOARD/CASE_CANNOT_FIND_MODAL/CONTENT"
      ).replace("$REFNO$", props.item.ref_no);

      if (!exists.value) {
        Util.openInfoModal(stores, msg, true);
        return;
      }
    }

    // 케이스 캐시 데이터 설정
    workspaceStore.id = props.item.id;
    workspaceStore.reviewID = undefined;
    workspaceStore.context = "general";
    workspaceStore.active_save_slot = props.item.active_save_slot;
    workspaceStore.case_save_location_code_path =
      props.item.case_save_location_code_path;

    appStore.setIsNewCase(false);
    appStore.setGotoWorkspace(true);
  } catch (e: any) {
    console.log("casecard, goWorkspace", e);
    Util.openAlertModal(
      stores,
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/DB_ALERT")
    );
  }
}

onMounted(async () => {
  // console.log("casecard mounted");
  if (
    props.item.case_save_location_code_path ===
    "SETTING/GENERAL/SAVE_LOCATION/LOCAL"
  )
    exists.value = await tldexie.existsLocalDexie(props.item.id);
});
</script>

<style lang="scss" scoped>
@import "@/styles/draft/text";

.casecard {
  overflow: hidden;
  position: relative;
  padding: 1.5rem;
  min-width: 22.6875rem;
  max-width: 33rem;
  height: 9.75rem;

  border: 0.0625rem solid #dfdfdf;
  border-radius: 0.5rem;

  background: #ffffff;

  color: #5b5d65;
  white-space: nowrap;
  &:hover {
    background-color: var(--color-hover);
  }
  .casecard-btns-hover {
    position: absolute;
    right: 1.25rem;
    top: 0.75rem;
  }
  .casecard-refno {
    cursor: pointer;
    display: inline-block;
    max-width: 25rem;
  }
  .casecard-worktype {
    cursor: pointer;
    background-color: #7c7f90;
    padding: 0.1875rem 0.25rem;
    border-radius: 0.125rem;
  }
  .casecard-title {
    cursor: pointer;
    display: inline-block;
    max-width: 20.625rem;
    white-space: nowrap;
    overflow: hidden;
  }
}
.right-btn {
  border-radius: 0.25rem;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.2);
  }
}
.save-location {
  border-radius: 0.25rem;
  color: #bcbdc6;
  width: 1.5rem;
}
%status {
  padding: 0.5rem 0.875rem;
  position: absolute;
  width: max-content;
  height: 1.875rem;

  right: 1.25rem;
  bottom: 1.125rem;

  border-radius: 1.25rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 0.875rem;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
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
</style>
