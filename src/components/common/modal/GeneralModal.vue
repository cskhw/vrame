<template>
  <div class="modal-wrapper">
    <div
      class="modal-backgrounds"
      @click="uncloseClickBack ? false : backFunc()"
    />
    <!-- content-area -->
    <div class="modal-contents" :style="{ width: width }">
      <div :style="{ padding: '0.75rem 0 0.75rem 0' }">
        <v-container class="pa-0">
          <div class="d-flex justify-center">
            <v-icon
              v-if="info"
              class="mt-4"
              :icon="mdiCheckCircle"
              style="width: 3rem; height: 3rem"
              color="#3AB272"
            />
            <v-icon
              v-if="alert"
              class="mt-4"
              :icon="mdiAlertOctagon"
              style="width: 3rem; height: 3rem"
              color="#EA5243"
            />
          </div>
          <div class="d-flex align-center justify-space-between mb-4 mx-5">
            <!-- alert 아이콘, 타이틀 -->
            <div
              class="text-bold-20-black mr-2"
              style="line-height: 1.875rem"
              :style="[info || alert ? { flex: '1', textAlign: 'center' } : {}]"
              v-html="title"
            />
            <!-- 닫기 버튼 -->
            <IconBtn v-if="closeBtn" :icon="mdiClose" @click="noFunc" />
          </div>
          <div
            class="description d-flex flex-column justify-center mx-5 text-400-16-black"
            style="
              line-height: 1.8rem;
              min-width: 18.75rem;
              max-width: 50rem;
              text-align: center;
            "
            :style="{
              width: !appStore.isMobile
                ? description?.length * widthUnit + 'px'
                : '18.75rem',
            }"
            v-html="description"
          />

          <div :style="{ padding: '0 1rem' }"><slot /></div>
          <v-divider class="pa-0 my-3" />
          <!-- button-area -->
          <!-- no버튼일 때 -->
          <div
            class="d-flex"
            :class="{ 'justify-space-between': check, 'justify-end': !check }"
            v-if="buttonType === 'N'"
            :style="{ padding: '0 1rem' }"
          >
            <div class="d-flex align-center mr-4" v-if="check">
              <input
                class="mr-2"
                :style="{ width: '0.9375rem', height: '0.9375rem' }"
                type="checkbox"
                v-model="isChecked"
              />
              <span :style="{ fontSize: '0.875rem' }">{{ checkTxt }}</span>
            </div>
            <v-btn
              flat
              border="none"
              :style="{
                color: '#5c6bc0',
              }"
              @click="noFunc"
              >{{ noTxt }}</v-btn
            >
          </div>
          <!-- yes버튼일 때 -->
          <div
            class="d-flex mx-4"
            :class="{ 'justify-space-between': check, 'justify-end': !check }"
            v-else-if="buttonType === 'Y'"
          >
            <div class="d-flex align-center mr-4" v-if="check">
              <input
                class="mr-4"
                :style="{ width: '0.9375rem', height: '0.9375rem' }"
                type="checkbox"
                v-model="isChecked"
              />
              <span :style="{ fontSize: '0.875rem' }">{{ checkTxt }}</span>
            </div>

            <v-btn
              :style="{
                backgroundColor: Util.getColor(stores, 'BUTTON')
                  ? Util.getColor(stores, 'BUTTON')
                  : colors.MAIN,
              }"
              text-color="white"
              style="color: white"
              flat
              @click="yesFunc(yesFuncParams)"
              >{{ yesTxt }}</v-btn
            >
          </div>
          <!-- buttonType === NY모드일 때 -->
          <div
            class="d-flex"
            :class="{
              'justify-space-between': check,
              'align-center': check,
              'justify-end': !check,
            }"
            v-else-if="buttonType === 'NY'"
            :style="{ padding: '0 1rem' }"
          >
            <div class="d-flex align-center mr-4" v-if="check">
              <input class="mx-1" type="checkbox" v-model="isChecked" />
              <span :style="{ fontSize: '0.875rem' }">{{ checkTxt }}</span>
            </div>
            <div>
              <v-btn
                @click="noFunc"
                class="mr-2"
                flat
                border="none"
                :style="{
                  color: Util.getColor(stores, 'BUTTON'),
                }"
                >{{ noTxt }}</v-btn
              >
              <v-btn
                :style="{
                  backgroundColor: Util.getColor(stores, 'BUTTON'),
                  color: Util.getColor(stores, 'BUTTON_TEXT'),
                }"
                flat
                @click="yesFunc(yesFuncParams)"
                >{{ yesTxt }}</v-btn
              >
            </div>
          </div>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconBtn from "@/components/common/IconBtn.vue";
import * as Util from "@/assets/javascripts/ipedit_util";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { mdiAlertOctagon, mdiCheckCircle, mdiClose } from "@mdi/js";
import { ref } from "vue";
import colors from "@/assets/javascripts/colors";

defineProps<{
  info?: boolean;
  alert?: boolean;
  title?: string;
  description?: string;
  buttonType?: string;
  noTxt?: string;
  yesTxt?: string;
  yesFunc?: (e?: any) => void;
  noFunc?: (e?: any) => void;
  check?: boolean;
  checkTxt?: string;
  yesFuncParams?: object;
  width?: string;
  closeBtn?: boolean;
  // 모달 밖을 눌렀을 때 실행될 함수
  backFunc?: (e?: any) => void;
  // 모달 밖을 눌렀을 때 닫을 것인가? true -> 안닫음. false(기본) -> 닫음
  uncloseClickBack?: boolean;
}>();

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

const isChecked = ref(false);

// 자동으로 창 크기 조절을 위한 단위값. 영어인 경우에는 12, 나머지 경우에는 15
let widthUnit = ref(15);
if (appStore.lang === "EN") widthUnit.value = 12;
</script>

<style lang="scss" scoped>
@import "@/styles/draft/text";
.modal-wrapper {
  z-index: 999999999999999 !important;
  display: grid;
  place-content: center;
  width: 100vw;
  height: 100vh;
  .modal-backgrounds {
    z-index: 99999999999999 !important;
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    opacity: 0.6;
  }
  .modal-contents {
    z-index: 99999999999999 !important;
    height: max-content !important;
    max-width: max-content;
    opacity: 1;
    border: 0.0625rem solid #eeeeee;
    background-color: white;
    box-shadow: 0rem 0.25rem 1.25rem rgba(0, 0, 0, 0.25);
    border-radius: 0.5rem;
    opacity: 1;
    .title {
      font-weight: 600;
      font-size: 1.5rem;
      line-height: 1.8125rem;
      color: #1b1a1b;
    }
    .description {
      line-height: 1.5rem;
    }
    .checkBox {
      width: 1rem;
      height: 1rem;
      border: 0.125rem solid #bcbcbc;
      border-radius: 0.25rem;
    }
  }
}
</style>
