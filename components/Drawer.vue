<template>
  <v-navigation-drawer
    v-model="isDrawer"
    class="drawer bg-ghostwhite"
    width="256"
    :color="Util.getColor(stores, 'SUB')"
    :style="{ background: Util.getColor(stores, 'SUB') }"
    permanent
  >
    <div class="d-flex flex-row justify-center" fluid>
      <!-- 신규 케이스 버튼 -->
      <v-btn
        class="rounded-pill"
        height="3rem"
        :style="{
          width: '13rem',
          borderRadius: '0.75rem',
          backgroundColor: Util.getColor(stores, 'REVERSE_BUTTON'),
          fontSize: '0.875rem',
          fontWeight: 'bold',
          letterSpacing: '0.05rem',
          color: Util.getColor(stores, 'REVERSE_BUTTON_TEXT'),
          margin: '1.5rem 0 1rem 0',
        }"
        rounded
        flat
        @click="openCaseManagementModal"
      >
        <v-icon
          :icon="mdiPlus"
          :style="{ width: '1.5rem', height: '1.5rem' }"
          :color="Util.getColor(stores, 'REVERSE_BUTTON_TEXT')"
        />
        <div class="ml-1" style="font-weight: bold">
          {{ Util.getI18NTxt(stores, "I18N/SIDEBAR/NEW_CASE") }}
        </div>
      </v-btn>
    </div>
    <v-list class="pa-0" :bg-color="Util.getColor(stores, 'SUB')">
      <v-list-item
        class="mx-2"
        style="
          height: 2.5rem;
          border-radius: 0.75rem;
          color: white;
          font-size: 0.875rem;
          font-weight: bold;
        "
        v-for="item in items"
        :key="item.title"
        link
        :to="item.link"
      >
        <v-icon
          style="margin-right: 0.9375rem"
          :color="Util.getColor(stores, 'SUB_TEXT')"
          :icon="item.icon"
        />
        <div :style="{ color: Util.getColor(stores, 'SUB_TEXT') }">
          {{ item.title }}
        </div>
        <!-- 알람 갯수 -->
        <div
          v-if="item.link === '/draft/review'"
          class="drawer-review-count d-flex align-center justify-center"
          :style="{
            backgroundColor: Util.getColor(stores, 'SECONDARY'),
          }"
        >
          <div
            style="font-size: 0.6875rem; font-weight: bold"
            :style="{ color: Util.getColor(stores, 'SECONDARY_TEXT') }"
          >
            {{ totalReceivedCaseCount }}
          </div>
        </div>
      </v-list-item>

      <v-divider
        class="ma-0 my-3 mx-3"
        :style="{ backgroundColor: Util.getColor(stores, 'DIVIDER') }"
      />
      <v-list-item
        class="mx-2"
        style="
          height: 2.5rem;
          border-radius: 0.75rem;
          color: white;
          font-size: 0.875rem;
          font-weight: bold;
        "
        :style="{
          background: Util.getColor(stores, 'SUB'),
          height: '2.5rem',
        }"
        v-for="item in bottomItems"
        :key="item.title"
        link
        :to="item.link"
      >
        <v-icon
          style="margin-right: 0.9375rem"
          :color="Util.getColor(stores, 'SUB_TEXT')"
          :icon="item.icon"
        />
        <div :style="{ color: Util.getColor(stores, 'SUB_TEXT') }">
          {{ item.title }}
        </div>
      </v-list-item>
    </v-list>
    <v-divider
      class="ma-0 mt-2 mx-3"
      :style="{ backgroundColor: Util.getColor(stores, 'DIVIDER') }"
    />
    <div
      class="drawer-copyright"
      style=""
      :style="{
        color: Util.getColor(stores, 'SUB_TEXT'),
      }"
    >
      ⓒ 2022 IPACTORY Inc.
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import * as Util from "@/assets/javascripts/ipedit_util";
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import { extractError } from "@/api/error";
import {
  mdiArchive,
  mdiCog,
  mdiDelete,
  mdiFileDocument,
  mdiHelpCircleOutline,
  mdiMessageDraw,
  mdiPlus,
  mdiShieldLock,
  mdiViewDashboard,
} from "@mdi/js";
import { computed, onMounted, ref } from "vue";
import api from "@/api/api";

// 스토어 생성
const appStore = useAppStore();
const userStore = useUserStore();
const modalStore = useModalStore();
const i18nStore = useI18NStore();
const themeStore = useThemeStore();

const stores = {
  as: appStore,
  us: userStore,
  ms: modalStore,
  is: i18nStore,
  ts: themeStore,
};

// 케이스 관리 모달 확실히 닫기
modalStore.caseManagementModal.hide();

function openCaseManagementModal() {
  const currentTime = appStore.serverTime.substring(0, 19);
  // currentTime = "2022-05-31T13:20:59";

  // 사용자 status에서 현재 사용기한이 남아 있는 format code 셋팅해줌
  let availableServiceCnt = 0;
  userStore.user.statuses.forEach((item) => {
    // console.log(currentTime);
    // console.log(item.expiration_time);
    if (currentTime.substring(0, 19) <= item.expiration_time) {
      availableServiceCnt++;
    }
  });
  // availableServiceCnt = 0;
  if (availableServiceCnt > 0) {
    modalStore.caseManagementModal.caseID = "";
    modalStore.caseManagementModal.show();
  } else {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/SIDEBAR/NO_AVAILABLE_SERVICE")
    );
  }
}

const isDrawer = true;

const items = computed(() => {
  return [
    {
      icon: mdiViewDashboard,
      title: Util.getI18NTxt(stores, "I18N/SIDEBAR/DASHBOARD"),
      link: "/draft/dashboard",
    },
    {
      icon: mdiMessageDraw,
      title: Util.getI18NTxt(stores, "I18N/SIDEBAR/REVIEW"),
      link: "/draft/review",
    },
    {
      icon: mdiArchive,
      title: Util.getI18NTxt(stores, "I18N/SIDEBAR/ARCHIVE"),
      link: "/draft/archive",
    },
    {
      icon: mdiDelete,
      title: Util.getI18NTxt(stores, "I18N/SIDEBAR/TRASH"),
      link: "/draft/trash",
    },
    {
      icon: mdiCog,
      title: Util.getI18NTxt(stores, "I18N/SIDEBAR/SETTINGS"),
      link: "/draft/setting",
    },
    {
      icon: mdiHelpCircleOutline,
      title: Util.getI18NTxt(stores, "I18N/SIDEBAR/SUPPORT"),
      link: "/draft/support",
    },
  ];
});

const bottomItems = computed(() => {
  return [
    {
      icon: mdiFileDocument,
      title: Util.getI18NTxt(stores, "I18N/SIDEBAR/TERMS"),
      link: "/draft/terms",
    },
    {
      icon: mdiShieldLock,
      title: Util.getI18NTxt(stores, "I18N/SIDEBAR/PRIVACY_POLICY"),
      link: "/draft/privacy",
    },
  ];
});

const totalReceivedCaseCount = ref(0);

async function getCasesCount() {
  try {
    // 케이스 갯수 초기화
    const reviewCountsResponse = (await api.draft.caseReviewCounts()).data
      .object;
    totalReceivedCaseCount.value = reviewCountsResponse.reviews;
  } catch (e) {
    const error = extractError(e);
    Util.openAlertModal(stores, error.message);
  }
}

/**created */
getCasesCount();

onMounted(() => {
  console.log("drawer mounted");
});
</script>

<style lang="scss">
.drawer {
  background-color: white;
  .drawer-copyright {
    position: absolute;
    left: 1.75rem;
    bottom: 1.25rem;
    font-size: 0.75rem !important;
    font-weight: 400;
  }
  .drawer-review-count {
    position: absolute;
    right: 1rem;
    width: 1rem;
    height: 1rem;
    background-color: #3ccfcf;
    border-radius: 50%;
  }
}
.v-list-item {
  :hover {
  }
  &:focus-visible {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
}
</style>
