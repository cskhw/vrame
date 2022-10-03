<template>
  <div class="case-folders">
    <template v-if="!isLoading">
      <template v-if="clientFolderItems.length !== 0">
        <div class="folder-wrapper">
          <template v-for="(item, index) in clientFolderItems" :key="item">
            <Folder
              v-model="selectedFolderIdx"
              :item="item"
              :index="index"
              @click="onClickFolder"
            />
            <!-- (row 넘버 + 1) * columnsCount === index + 1
        클릭한 줄의 마지막 폴더 뒤의 인덱스 ===  index + 1-->
            <!-- 폴더가 마지막 줄에 있을 땐 맨 마지막 폴더 뒤에 있는 caseCards를 true -->
            <template v-if="isOpenFolder && setupOpenFolder(index)">
              <div style="grid-column: 1 / -1">
                <div
                  v-if="showLoadingMessage"
                  class="px-6 d-flex align-center justify-center"
                  style="height: 9.75rem; color: #bdbdbd; fontsize: 1.375rem"
                >
                  <v-progress-circular
                    indeterminate
                    color="#5c6bc0"
                    width="7"
                    :size="50"
                    style="margin-bottom: 4rem"
                  />
                </div>
                <div class="case-cards-wrapper">
                  <CaseCard
                    v-for="(item2, index2) in clientItems"
                    :key="index2"
                    :item="item2"
                  />
                </div>
                <!-- 최근 케이스 페이지네이션 -->
                <div class="d-flex justify-center pt-5">
                  <div class="d-flex" style="gap: 1rem">
                    <div
                      class="case-card-pagination-btn"
                      v-for="n in caseCardPageLength"
                      :key="n"
                      style=""
                      :style="{
                        backgroundColor:
                          caseCardPage === n ? '#5c6bc0' : '#d9d9d9',
                      }"
                      @click="() => asyncOnClickRecentCasePageBtn(n - 1)"
                    ></div>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </div>
        <!-- 폴더 페이지네이션 -->
        <v-pagination
          class="mt-1"
          v-if="!isOpenFolder"
          v-model="folderPage"
          :length="folderPageLength"
          color="#5c6bc0"
        />
      </template>
      <template v-else>
        <!-- 펜딩중인 케이스가 없는 경우 -->
        <div
          class="px-6 d-flex align-center justify-center"
          style="height: 5.5rem; color: #bdbdbd; fontsize: 1.375rem"
        >
          {{ pandingCaseTxt }}
        </div>
      </template>
    </template>
    <div
      v-else
      class="d-flex align-center justify-center"
      style="width: 100%; height: 14rem"
    >
      <v-progress-circular
        indeterminate
        color="#5c6bc0"
        width="7"
        :size="50"
        style="margin-bottom: 4rem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import api from "@/api/api";
import { extractError } from "@/api/error";
import * as Util from "@/assets/javascripts/ipedit_util";
import {
  asyncDebounce,
  asyncDelay,
} from "@/assets/javascripts/utils/asyncDebounce";
import CaseCard from "@/components/dashboard/CaseCard.vue";
import Folder from "@/components/dashboard/Folder.vue";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import type { CaseMasterDataType } from "@/types/case";
import type { AxiosError } from "axios";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const props = withDefaults(
  defineProps<{
    clientCaseStatus?: string[];
    folderCaseStatus?: string[];
  }>(),
  {
    clientCaseStatus: () => [
      "DR_CASE_STATUS/S01",
      "DR_CASE_STATUS/S02",
      "DR_CASE_STATUS/S03",
      "DR_CASE_STATUS/S04",
      "DR_CASE_STATUS/S11",
      "DR_CASE_STATUS/S12",
      // "DR_CASE_STATUS/S13",
    ],
    folderCaseStatus: () => [
      "DR_CASE_STATUS/S01",
      "DR_CASE_STATUS/S02",
      "DR_CASE_STATUS/S03",
      "DR_CASE_STATUS/S04",
      "DR_CASE_STATUS/S11",
      "DR_CASE_STATUS/S12",
      // "DR_CASE_STATUS/S13",
    ],
  }
);

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

const isLoading = ref(true);

/**폴더 UI 부분 */
// 폴더 클릭
const isClickFolderIdxInLastRow = ref(false);
// 폴더가 마지막 행에 있는지 유무
const onClickFolder = () => {
  // 폴더 열때 1row에 포함된 폴더 개수 카운팅
  columnsCountOnResize();
  if (
    clientFolderItems.value.length - (selectedFolderIdx.value + 1) <
    clientFolderItems.value.length
  )
    isClickFolderIdxInLastRow.value = true;
  else isClickFolderIdxInLastRow.value = false;

  if (clientFolderItems.value[selectedFolderIdx.value]) {
    isOpenFolder.value = true;

    getClientCases(
      clientFolderItems.value[selectedFolderIdx.value].client
    ).then(() => {
      appStore.offSpin();
    });
  } else {
    isOpenFolder.value = false;
  }
};

type clientFolderDataType = {
  client: string;
  total: number;
};

// 최근 케이스 아이템들
const clientItems = ref<CaseMasterDataType[]>([]);

// 클라이언트 폴더 아이템들
const clientFolderItems = ref<clientFolderDataType[]>([]);

// 폴더 레이아웃 변수
const selectedFolderIdx = ref<number>(-1);
const columnsCount = ref(6);
const isOpenFolder = ref(false);
const showLoadingMessage = ref(false);

//  페이지네이션 변수
const caseCardPage = ref(1);
// 페이지 총 갯수
const caseCardPageLength = ref(1);

// 페이지네이션 변수
const folderPage = ref(1);
// 페이지 총 갯수
const folderPageLength = ref(1);
const route = useRoute();

const pandingCaseTxt = computed(() => {
  if (route.path === "/draft/dashboard")
    return Util.getI18NTxt(stores, "I18N/DASHBOARD/CASE_LIST/NO_PENDING_CASE");
  else if (route.path === "/draft/archive")
    return Util.getI18NTxt(stores, "I18N/ARCHIVE/LIST_NO_CASE");
  return Util.getI18NTxt(stores, "I18N/DASHBOARD/CASE_LIST/NO_PENDING_CASE");
});

// 특정 클라이언트의 케이스 가져오기
async function getClientCases(client: string | null, page_number = 0) {
  try {
    clientItems.value = [];
    showLoadingMessage.value = true;

    let client_none = false;
    if (client === null) client_none = true;

    const caseReadPageResponse = await api.draft.caseReadPage({
      case_status_code_path_list: props.clientCaseStatus,
      client_exact: client,
      client_none: client_none,
      order_target: "id",
      order_condition: "desc",
      // 9개 가져와서 뿌려줌
      page_size: 9,
      page_number: page_number,
    });

    // 카드 페이지네이션 페이지 초기화
    caseCardPage.value = caseReadPageResponse.data.page_number + 1;
    // 카드 페이지네이션 페이지 갯수 초기화
    caseCardPageLength.value = Math.ceil(
      caseReadPageResponse.data.total_size / caseReadPageResponse.data.page_size
    );

    showLoadingMessage.value = false;
    clientItems.value = caseReadPageResponse.data.objects;
    // console.log(clientItems.value);
  } catch (e: AxiosError | Error | any) {
    const error = extractError(e);
    Util.openAlertModal(stores, error.status);
  }
}

// 폴더 리스트 가져오기
async function getClientList(page_number = 0) {
  try {
    const caseReadGroupByClientResponse = await api.draft.caseReadGroupByClient(
      {
        case_status_code_path_list: props.folderCaseStatus,
        page_size: 12,
        page_number: page_number,
      }
    );
    // console.log(caseReadGroupByClientResponse.data.objects);
    clientFolderItems.value = caseReadGroupByClientResponse.data.objects;

    // 폴더 페이지네이션 변수 초기화
    folderPage.value = caseReadGroupByClientResponse.data.page_number + 1;
    // 폴더 페이지네이션 페이지 갯수 초기화
    folderPageLength.value = Math.ceil(
      caseReadGroupByClientResponse.data.total_size /
        caseReadGroupByClientResponse.data.page_size
    );
  } catch (e: AxiosError | Error | any) {
    const error = extractError(e);
    // appStore.isLoading = false;
    Util.openAlertModal(stores, error.status);
  }
}

// 폴더 페이지네이션 시 폴더 리스트 가져오고 초기 상태로 초기화
watch(folderPage, (newValue) => {
  getClientList(newValue - 1);
  isOpenFolder.value = false;
  selectedFolderIdx.value = -1;
});

// 그리드의 컬럼 갯수에 따라서 columnsCount의 숫자를 조절하는 함수
function columnsCountOnResize() {
  // 90rem 기준으로 그리드 컬럼 갯수가 4개 이하로 안떨어져서 아이템 갯수에 따라 조정
  if (clientFolderItems.value?.length < 4) {
    columnsCount.value = clientFolderItems.value.length;
    return;
  }
  // 폴더 레퍼를 가져옴
  let grid = document.getElementsByClassName("folder-wrapper")[0];
  // 폴더 레퍼의 계산된 스타일을 가져옴
  if (grid) {
    let gridStyle = window.getComputedStyle(grid);
    // grid-template-columns 속성의 계산된 값을 가져와서 스플릿한 length
    columnsCount.value = gridStyle
      .getPropertyValue("grid-template-columns")
      .split(" ").length;
    // 최대 폴더 갯수에 값 할당
  }
}

// 폴더의 하위 영역별 오픈여부 셋팅
function setupOpenFolder(index: any) {
  // 선택된 폴더보다 이전에 위치하는 것은 모두 false
  if (index < selectedFolderIdx.value) return false;

  // index가 row의 끝인 경우 true 후보가 됨
  if ((index + 1) % columnsCount.value === 0) {
    // 폴더의 위치와 선택된 폴더의 인덱스의 차이가 column 개수보다 작은 경우에만 true임
    if (index < selectedFolderIdx.value + columnsCount.value) return true;
    else return false;
  }
  // index가 row의 끝이 아니고, 최대값인 경우 true 후보가 됨
  else if (index + 1 == clientFolderItems.value.length) {
    // 선택된 폴더가 마지막 행에 속한 경우에만 true임
    if (
      selectedFolderIdx.value >=
      Math.floor(index / columnsCount.value) * columnsCount.value
    )
      return true;
    else return false;
  } else {
    return false;
  }
}

async function onClickRecentCasePageBtn(page_number = 0) {
  getClientCases(
    clientFolderItems.value[selectedFolderIdx.value].client,
    page_number
  );
}

const asyncOnClickRecentCasePageBtn = asyncDebounce(
  onClickRecentCasePageBtn,
  asyncDelay
);

// 폴더 클릭 시 해당 폴더의 케이스를 보여주기 위해서 각 픽셀에 따라 폴더 갯수를 맞춤
onMounted(() => {
  getClientList().then(() => {
    isLoading.value = false;
    columnsCountOnResize();
  });

  // appStore.isLoading = false;

  // columnsCountOnResize();
  window.addEventListener("resize", columnsCountOnResize);
});

// 대시보드를 벗어날 때 이벤트 제거
onUnmounted(() => {
  window.removeEventListener("resize", columnsCountOnResize);
});

watch(appStore, () => {
  // 케이스 상태 변경 등에서 리프레시 되면 케이스 리스트를 새로 요청함
  console.log();
  if (appStore.refresh) {
    appStore.refresh = false;
    // 케이스 가져온 다음 초기 상태로 만들어줌
    getClientList().then(() => {
      isOpenFolder.value = false;
      selectedFolderIdx.value = -1;
      isLoading.value = false;
      columnsCountOnResize();
    });
  }
});
</script>

<style lang="scss" scoped>
.case-folders {
  min-width: 90rem;
}

.folder-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14.375rem, 15.5rem));
  grid-gap: 1.5rem;
  margin: 0 1.5rem;
}

.case-cards-wrapper {
  display: grid;
  grid-template-columns: repeat(3, minmax(240px, 1fr));

  flex-wrap: wrap;
  gap: 1.5rem;
}

.case-card-pagination-btn {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
}

// 폴더 애니메이션 트랜지션
.v-enter-active,
.v-leave-active {
  transition: all 0.35s ease;
  max-height: 62.5rem;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  max-height: 0;
}

// v-pagination css
// 각 아이템의 기본 텍스트 색상
::v-deep(.v-pagination__item) {
  color: black;
}
// 활성화된 버튼 오버레이에 트랜지션, 배경색 입힘
::v-deep(.v-pagination__item.v-pagination__item--is-active
    button
    .v-btn__overlay) {
  background-color: #5c6bc0;
  transition: all 0.1s ease-in;
}
// 활성화된 버튼 텍스트 색상 바꾸기 위해서 사용
::v-deep(.v-pagination__item.v-pagination__item--is-active button) {
  color: gray !important;
  opacity: 1;
}

// 버튼 안의 오버레이 배경색 및 테두리
::v-deep(.v-btn__overlay) {
  background-color: white;
  border: 0.0625rem solid #d5d5d5;
}
</style>
