<template>
  <v-app-bar
    class="appbar"
    app
    elevation="0"
    height="64"
    :color="Util.getColor(stores, 'HEADER')"
  >
    <!-- IPEDIT 로고 -->
    <router-link class="ml-1" to="/" @click="onClickLogo">
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
    </router-link>
    <v-spacer></v-spacer>
    <!-- 알림 버튼 -->
    <div class="d-flex align-center justify-center" style="position: relative">
      <img
        class="mr-4"
        src="@/assets/images/notification.png"
        alt="notification"
        :style="{ cursor: 'pointer', padding: '0.75rem' }"
        @click="openNotificationModal"
      />
      <!-- 알람 갯수 -->
      <div
        class="appbar-review-count d-flex align-center justify-center"
        :style="{ backgroundColor: Util.getColor(stores, 'SECONDARY') }"
      >
        <div
          style="font-size: 0.6875rem; font-weight: bold"
          :style="{
            color: Util.getColor(stores, 'SECONDARY_TEXT'),
          }"
        >
          {{ notReadNoticeCount }}
        </div>
      </div>
    </div>

    <!-- 유저 셀렉트 -->
    <v-menu v-model="isShowMenu" offset-y transition="none">
      <template v-slot:activator="{ props }">
        <!-- 유저 셀렉트 버튼 -->
        <v-btn
          class="pa-0 pr-2"
          color="#4857AB"
          :style="{
            width: 'max-content',
            minWidth: '12.5rem',
            height: '3.125rem',
            color: Util.getColor(stores, 'HEADER_TEXT'),
            whiteSpace: 'nowrap',
            fontSize: '0.875rem',
            fontWeight: '400',
          }"
          v-bind="props"
        >
          <img
            :src="stores.us.profileThumbnailSrc"
            class="appbar-profile mr-2"
            alt="profile"
          />
          <span
            style="font-weight: bold"
            :style="{ color: Util.getColor(stores, 'HEADER_TEXT') }"
            >{{ userStore?.user?.detail?.name }}</span
          >

          <img
            class="ml-4"
            src="@/assets/images/arrow-down.png"
            alt="arrow-down"
          />
        </v-btn>
      </template>
      <!-- 유저 셀렉트 옵션 리스트 -->
      <v-list
        :style="{
          position: 'absolute',
          right: '0',
          height: 'max-content',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 0.0625rem 0.3125rem 0rem #e0e0e0',
        }"
        @click="isShowMenu = false"
      >
        <!-- 옵션 리스트 아이템 -->
        <v-list-item
          @click="() => onClickDropDown(item)"
          v-for="(item, index) in dropdownItems"
          :key="index"
          :style="{
            backgroundColor:
              isHoverDropdown && curDropdownLstItemIdx === index
                ? Util.getColor(stores, 'TINTED')
                : 'rgba(255,255,255,0.12)',
            minHeight: '2.25rem !important',
          }"
          @mouseenter="
            isHoverDropdown = true;
            curDropdownLstItemIdx = index;
          "
          @mouseleave="isHoverDropdown = false"
        >
          <!-- 리스트 아이콘-->
          <v-icon
            class="mr-2"
            style="color: #7c7f90"
            :icon="item.icon"
          ></v-icon>
          <!-- 리스트 타이틀 -->
          <v-list-item-title
            :style="{
              color: '#1B1A1B',
              fontSize: '0.875rem',
            }"
            >{{ item.title }}</v-list-item-title
          >
        </v-list-item>
        <div
          style="
            height: 0.0625rem;
            margin: 0.5rem 0;
            background-color: lightgray;
          "
        />
        <!-- 로그아웃 버튼 -->
        <v-list-item
          :style="{
            backgroundColor: isLogoutHover
              ? Util.getColor(stores, 'TINTED')
              : 'rgba(255,255,255,0.12)',
            color: '#1B1A1B',
            minHeight: '2rem',
          }"
          link
          @mouseenter="isLogoutHover = true"
          @mouseleave="isLogoutHover = false"
          @click="asyncOnClickLogoutBtn"
        >
          <v-icon
            class="mr-2"
            :style="{ color: '#7c7f90' }"
            :icon="mdiLogoutVariant"
          ></v-icon>
          <v-list-item-title
            :style="{
              position: 'relative',
              fontSize: '0.875rem',
              color: '#1B1A1B',
            }"
          >
            {{ Util.getI18NTxt(stores, "I18N/HEADER/LOGOUT") }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <teleport to="#modal-area">
      <!-- 공지사항 모달 -->
      <div class="notice-modal" v-if="isShowNoticeModal" v-Init-Notice-Modal>
        <div class="notice-modal-background" @click="closeNoticeModal" />
        <div class="notice-modal-body">
          <!-- 공지사항 모달 헤더 -->
          <div class="notice-modal-header">
            <IconBtn
              class="mr-2"
              width="2.25rem"
              height="2.25rem"
              v-if="isShowNoticeDetailModal"
              :icon="mdiChevronLeft"
              @click="onClickNoticeDetailModalBackBtn"
            ></IconBtn>
            <div
              class="notice-modal-title text-bold-20-black"
              style="height: 2.25rem"
            >
              {{
                isShowNoticeDetailModal
                  ? noticeDetailModalItem.title
                  : Util.getI18NTxt(stores, "I18N/NOTICE/HEADER")
              }}
            </div>
          </div>
          <div class="notice-modal-contents">
            <!-- 공지사항 로딩 -->
            <template v-if="isNoticeLoading">
              <div
                class="d-flex align-center justify-center"
                style="width: 100%; height: 100%"
              >
                <v-progress-circular
                  indeterminate
                  color="#5c6bc0"
                  width="7"
                  :size="50"
                />
              </div>
            </template>
            <!-- 공지사항 모달 -->
            <template v-else-if="!isShowNoticeDetailModal">
              <DraftTable
                scroll
                :style="{
                  width: '37rem',
                  height: '29rem',
                }"
                :column-specs="columnSpecs"
                v-model="noticeItems"
                link
                @click-tr="(e) => onClickNoticeTableTr(e.id)"
              >
              </DraftTable>
              <v-pagination
                v-if="!isShowNoticeDetailModal"
                :length="totalPageCount"
                v-model="pageNum"
              />
            </template>
            <!-- 공지사항 상세 모달 -->
            <template v-else>
              <div
                class="text-400-16-gray mb-4"
                v-html="noticeDetailModalItem.startDate"
              />
              <div
                class="notice-modal-description"
                style="margin-bottom: 1.5rem"
                v-html="noticeDetailModalItem.contents"
              />
            </template>
          </div>
          <div
            class="notice-modal-footer pt-2"
            :class="
              !isShowNoticeDetailModal ? 'justify-space-between' : 'justify-end'
            "
          >
            <CheckBox
              v-if="!isShowNoticeDetailModal"
              v-model="isNoticeModalChecked"
              class="mr-4"
              label="새로운 공지가 있을 때 까지 알림을 띄우지 않습니다."
              :style="{ width: '0.9375rem', height: '0.9375rem' }"
              :labelStyle="{ fontWeight: 'bold' }"
              :color="Util.getColor(stores, 'PRIMARY')"
            />
            <v-btn
              flat
              border="none"
              :style="{
                color: Util.getColor(stores, 'BUTTON'),
              }"
              @click="closeNoticeModal"
              >닫기</v-btn
            >
          </div>
        </div>
      </div>
    </teleport>
  </v-app-bar>
</template>

<script setup lang="ts">
import api from "@/api/api";
import { asyncDebounce } from "@/assets/javascripts/utils/asyncDebounce";
import DraftTable from "@/components/draft/Table.vue";
import useAppStore from "@/store/useAppStore";
import useAuthStore from "@/store/useAuthStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useI18NStore from "@/store/useI18NStore";
import {
  mdiAccountCircle,
  mdiCreditCardMultipleOutline,
  mdiHistory,
  mdiLogoutVariant,
  mdiChevronLeft,
} from "@mdi/js";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import * as Util from "@/assets/javascripts/ipedit_util";
import type { TableColumnSpecType } from "@/types/table";
import CheckBox from "@/components/common/CheckBox.vue";
import IconBtn from "@/components/IconBtn.vue";
import type { Notice } from "@/types/user";
import { SERVICE_CODE_PATH_DR } from "@/assets/javascripts/common";
import { setProfileImage } from "@/api/utils";

const userStore = useUserStore();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const appStore = useAppStore();
const modalStore = useModalStore();
const i18nStore = useI18NStore();

const stores = {
  as: appStore,
  us: userStore,
  ts: themeStore,
  ms: modalStore,
  is: i18nStore,
};

const router = useRouter();

const isShowMenu = ref<boolean>(false);
const isNoticeLoading = ref<boolean>(true);

const user = ref({});
// 유저 데이터 초기화
user.value = authStore.user;

/** 앱바 구현부분 */
// 드롭다운에 호버 되었는지
const isHoverDropdown = ref(false);
// 드롭다운 리스트 인덱스
const curDropdownLstItemIdx = ref(-1);
// 로그아웃에 호버 되었는지
const isLogoutHover = ref(false);
// 유저 드롭다운 옵션 아이템
const dropdownItems = computed(() => {
  return [
    {
      id: 0,
      title: Util.getI18NTxt(stores, "I18N/HEADER/ACCOUNT_SETTING"),
      href: "/draft/usermanage",
      icon: mdiAccountCircle,
    },
    {
      id: 1,
      title: Util.getI18NTxt(stores, "I18N/HEADER/PLAN_MANAGEMENT"),
      href: "/draft/servicemanage",
      icon: mdiCreditCardMultipleOutline,
    },
    {
      id: 2,
      title: Util.getI18NTxt(stores, "I18N/HEADER/USAGE_HISTORY"),
      href: "/draft/usagehistory",
      icon: mdiHistory,
    },
  ];
});

interface DropDownItem {
  id: number;
  title: string;
  href: string;
  icon: string;
}

// TODO: 이용 서비스 내역 개발 필요
async function onClickDropDown(item: DropDownItem) {
  if (item.id === 2) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/PREPARING")
    );
  } else {
    router.push(item.href);
  }
}

// IPEDIT 로고 클릭 시 글로벌 모달 다 닫음
const onClickLogo = () => modalStore.closeAll();

// 로그아웃
const onClickLogoutBtn = async () => {
  try {
    authStore.logoutAndPushTo("/", true);
  } catch (e) {
    Util.openAlertModal(stores, "Fail to logout!");
  }
};
const asyncOnClickLogoutBtn = asyncDebounce(onClickLogoutBtn);

/** 공지사항 모달 구현 부분 */
// 테이블 공지사항 타입
interface tableNotice {
  id: number;
  title: string;
  start_date: string;
}

const OLD_NOTICE_COUNTS = "OLD_NOTICE_COUNTS";
const IS_NEW_NOTICE = "IS_NEW_NOTICE";

const isShowNoticeModal = ref(false);
const openNotificationModal = () => (isShowNoticeModal.value = true);
const isNoticeModalChecked = ref<boolean>(false);
let notices: Notice[];
const notReadNoticeCount = ref(0);
const noticeItems = ref<tableNotice[]>([]);

// 공지사항 모달 테이블 컬럼 스펙
const columnSpecs = ref<TableColumnSpecType[]>([
  { header: "번호", dataKey: "id", width: "3.75rem", cursor: "pointer" },
  { header: "제목", dataKey: "title", width: "25.75rem", cursor: "pointer" },
  {
    header: "게시일자",
    dataKey: "start_date",
    width: "7.5rem",
    cursor: "pointer",
  },
]);

// 총 페이지 수
const totalPageCount = ref(1);
// 페이지 번호
const pageNum = ref(1);
// 페이지당 아이템 수
const pageSize = 20;

// noticeItems 가공
function setNoticeItem(item: Notice) {
  if (item?.read_marks?.length <= 0)
    item.notice_title = `
    <div class="d-flex align-center">
      ${item.notice_title}
      <div class="d-flex align-center justify-center ml-2 mt-1" style="width: 1.375rem; height: 0.625rem; padding-bottom: 0.125rem; background-color: #3ccfcf; font-family: Montserrat; font-size: 0.625rem; border-radius: 0.125rem; color: white; font-weight: bold">new</div>
    </div>
    `;

  noticeItems.value.push({
    id: item.id,
    title: item.notice_title,
    start_date: item.notice_start_time.slice(0, 10),
  });
}

// 공지사항 불러오고 페이지네이션 총 페이지 갯수 초기화
async function getNoticesAndTotalPageCount(pageNumber?: number) {
  // 공지사항 불러옴
  const noticeResponse = await api.management.noticeReadPage({
    service_code_path: "SERVICE/DR",
    page_number: pageNumber ? pageNumber : 0,
    page_size: pageSize,
  });

  // 총 페이지 갯수 초기화
  totalPageCount.value = Math.ceil(
    noticeResponse.data.total_size / noticeResponse.data.page_size
  );

  return noticeResponse.data.objects;
}

// 안 읽은 공지사항 갯수 가져오기
async function getCountsNoticeNotRead(onMounted = false) {
  // 읽지 않은 공지사항 갯수 초기화,
  const countsNotReadResponse = await api.management.noticeCountsNotRead({
    service_code_path: SERVICE_CODE_PATH_DR,
  });
  // 이전 안읽은 공지사항 갯수 초기화
  if (!onMounted)
    localStorage.setItem(
      OLD_NOTICE_COUNTS,
      notReadNoticeCount.value.toString()
    );
  return countsNotReadResponse.data.object.total;
}

// noticeModal 테이블 클릭 시 상세 모달 띄움
async function onClickNoticeTableTr(id: string) {
  console.log("test");
  // 선택한 공지사항 불러옴
  let noticeResponse = await api.management.noticeRead({ id: parseInt(id) });
  let noticeData = noticeResponse.data.object;
  noticeDetailModalItem.value = {
    title: noticeData.notice_title,
    startDate: noticeData.notice_start_time.substring(0, 10),
    contents: noticeData.notice_contents,
  };
  // 안읽은 공지사항 갯수 초기화
  notReadNoticeCount.value = await getCountsNoticeNotRead();

  isShowNoticeDetailModal.value = true;
}

// 공지사항 모달 뜰 때 공지사항 변수들 초기화
const vInitNoticeModal = {
  async mounted() {
    notices = await getNoticesAndTotalPageCount();

    // 읽지 않은 공지사항 갯수 불러옴
    notReadNoticeCount.value = await getCountsNoticeNotRead();

    isNoticeLoading.value = false;
    noticeItems.value.length = 0;
    // 테이블에 맞게 notices 가공
    notices.forEach((item) => setNoticeItem(item));
  },
};

// 페이지네이션 버튼 클릭 시 페이지의 공지사항 데이터 요청
watch(pageNum, async (newValue) => {
  let noticeResponse = await api.management.noticeReadPage({
    service_code_path: SERVICE_CODE_PATH_DR,
    page_number: newValue - 1,
    page_size: pageSize,
  });

  let noticeData = noticeResponse.data.objects;
  // 테이블에 맞게 notices 가공
  noticeItems.value.length = 0;
  noticeData.forEach((item) => setNoticeItem(item));
});

// 공지사항 모달 체크 값 바뀌면 쿠키 값 변경
watch(isNoticeModalChecked, (newValue) => {
  if (newValue) localStorage.setItem(IS_NEW_NOTICE, "true");
  else localStorage.removeItem(IS_NEW_NOTICE);
});

/** 공지사항 상세 모달 구현 부분 */
// 공지사항 모달
const isShowNoticeDetailModal = ref<boolean>();

// 공지사항 모달 아이템
const noticeDetailModalItem = ref<{
  title: string;
  startDate: string;
  contents: string;
}>({ title: "", startDate: "", contents: "" });

// 공지사항 상세 모달 뒤로가기 버튼 눌렀을 때 공지사항 초기화 시켜주고 공지사항 모달로 변경
async function onClickNoticeDetailModalBackBtn() {
  console.log(pageNum.value);
  notices = await getNoticesAndTotalPageCount(pageNum.value - 1);
  noticeItems.value.length = 0;
  notices.forEach((item) => {
    setNoticeItem(item);
  });

  isShowNoticeDetailModal.value = false;
}

function closeNoticeModal() {
  isShowNoticeModal.value = false;
  isShowNoticeDetailModal.value = false;
  pageNum.value = 1;
}

// 쿠키에 저장된 이전 안읽은 공지사항 갯수와 갱신된 안읽은 공지사항 갯수 비교
function isNewNotice(): boolean {
  // 이전 안읽은 공지사항 갯수 가져옴
  let oldNoticeCountsString = localStorage.getItem(OLD_NOTICE_COUNTS);
  if (oldNoticeCountsString === null) oldNoticeCountsString = "0";
  let oldNoticeCount = parseInt(oldNoticeCountsString);
  // 이전 안읽은 공지사항 갯수보다 갱신된 안읽은 공지사항이 더 많으면
  if (oldNoticeCount < notReadNoticeCount.value) return true;
  else return false;
}

// 썸네일 가져옴
setProfileImage(stores, "thumbnail");

onMounted(() => {
  // console.log("appbar mounted");
  // 안읽은 공지사항 불러옴
  getCountsNoticeNotRead(true).then((newNotReadNoticeCount) => {
    notReadNoticeCount.value = newNotReadNoticeCount;
    const checked = localStorage.getItem(IS_NEW_NOTICE);

    if (checked) {
      // 체크 쿠키가 있고 갯수가 0보다 크고, 갯수 쿠키보다 새로운 쿠키 갯수가 많을 때
      if (isNewNotice()) isShowNoticeModal.value = true;

      // 쿠키 값이 있으면 모달의 체크 값 true로 변경
      isNoticeModalChecked.value = true;
    } else {
      // 체크 쿠키가 없고 새로운 공지사항 갯수가 0보다 클 때
      if (notReadNoticeCount.value > 0) isShowNoticeModal.value = true;
    }
  });
});
</script>

<style lang="scss">
@import "/src/assets/stylesheets/draft/index";

header {
  min-width: 90rem;
}

.appbar {
  .appbar-review-count {
    position: absolute;
    top: 0.5rem;
    left: 1.375rem;
    width: 1rem;
    height: 1rem;
    background-color: #3ccfcf;
    border-radius: 50%;
  }
}

.appbar-profile {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}

.notice-modal {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  .notice-modal-background {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
  }
  .notice-modal-body {
    position: relative;
    width: 40rem;
    height: max-content;
    overflow: hidden;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0rem 0.25rem 1.25rem rgba(0, 0, 0, 0.25);
    .notice-modal-header {
      display: flex;
      align-items: center;
      padding: 2rem 1.5rem 1.5rem 1.5rem;
    }
    .notice-modal-contents {
      overflow: hidden;
      height: 32.5rem;
      padding: 0 1.5rem;
      .notice-modal-description {
        overflow: overlay;
        height: 28rem;
      }
    }
    .notice-modal-footer {
      display: flex;
      padding: 0 1rem 1rem 1rem;
      align-items: center;
      border-top: 0.0625rem solid #e0e0e0;
    }
  }
}
</style>
