<template>
  <div
    class="modal sign-up"
    v-bind:class="{ 'is-active': modalStore.signUpEnteranceModal.isOpen }"
  >
    <div
      class="modal-background"
      :style="{ backgroundColor: '#0a0a0a0d' }"
    ></div>

    <div class="modal-content">
      <button
        class="modal-close is-large"
        aria-label="close"
        v-on:click="modalStore.signUpEnteranceModal.hide()"
      ></button>
      <div class="logo">
        <img
          :src="logo"
          alt="@/assets/images/draft.svg"
          :style="[
            {
              width: '12.5rem',
              height: 'auto',
              filter:
                'invert(0%) sepia(87%) saturate(7459%) hue-rotate(172deg) brightness(0%) contrast(108%)',
            },
          ]"
        />
      </div>

      <p class="signup-title">
        {{ Util.getLocaleTxt(t, "common_signupTitle") }}
      </p>

      <!-- login with Email -->
      <Button
        style="width: 100%"
        v-on:click="onClickSignUpWithEmailBtn"
        :text="Util.getLocaleTxt(t, 'signupenterance_signUpWithEmail')"
      >
      </Button>

      <p class="or">{{ Util.getLocaleTxt(t, "common_or") }}</p>

      <!-- Google 로그인 버튼 -->
      <div
        id="google-login-btn"
        class="google-login-btn d-flex align-center justify-center"
        style="max-height: 2.5rem"
      ></div>

      <!-- Apple 로그인 버튼 -->
      <div class="d-flex justify-center">
        <div
          id="appleid-signin"
          data-color="black"
          data-border="true"
          data-type="sign-in"
          data-mode="center-align"
          data-border-radius="5"
          :data-width="appleLoginBtnWidth"
          data-height="40px"
          data-logo-size="large"
          :style="{
            'margin-top': '0.625rem',
          }"
        ></div>
      </div>

      <p class="signup mt-5">
        {{ Util.getLocaleTxt(t, "signupenterance_isMember")
        }}<span
          v-on:click="
            modalStore.signUpEnteranceModal.hide();
            modalStore.loginModal.show();
          "
          >{{ Util.getLocaleTxt(t, "common_login") }}</span
        >
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/signUp_outsourcing.scss";
</style>

<script lang="ts" setup>
import { extractError, responseStatus } from "@/api/error";
import Logo from "@/assets/images/draft.svg";
import {
  pushToDashboardAfterLogin,
  requestAppleLogin,
  requestGoogleLogin,
  setAppleApi,
  setGoogleApi,
  unsetAppleApi,
} from "@/assets/javascripts/utils/authUtil";
import Button from "@/components/Button.vue";
import useAppStore from "@/store/useAppStore";
import useAuthStore from "@/store/useAuthStore";
import useModalStore from "@/store/useModalStore";
import type { AxiosError } from "axios";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import * as Util from "@/assets/javascripts/ipedit_util";
import breakpoints from "@/assets/javascripts/breakpoints";

const { t } = useI18n();

// 스토어 초기화
const authStore = useAuthStore();
const appStore = useAppStore();
const modalStore = useModalStore();

const stores = {
  as: authStore,
  ms: modalStore,
};

// 컴포넌트 Ref
const logo = ref(Logo);
const router = useRouter();

function onClickSignUpWithEmailBtn() {
  authStore.loginInfo.signupType = "email";
  modalStore.signUpEnteranceModal.hide();
  modalStore.signUpFormsModal.show();
  // console.log(modalStore.signUpFormsModal);
}

// SNS 로그인 에러 처리
function handleSnsLoginError(e: AxiosError | Error | any) {
  const error = extractError(e);

  if (error.status === responseStatus.notFoundError) {
    modalStore.signUpEnteranceModal.hide();
    modalStore.signUpFormsModal.show();
  } else if (error.status === responseStatus.invalidUserSessionRequestError) {
    modalStore.signUpEnteranceModal.hide();
    modalStore.sessionModal.show();
  } else {
    console.log("SNS Login Error: ", e);
  }
}

// Google 로그인 콜백
async function handleGoogleCallback(response: any) {
  try {
    // 로그인정보 임시 저장 및 로그인
    const token = response.credential;
    authStore.loginInfo.signupType = "google";
    authStore.storeSnsLoginInfo(token);
    await requestGoogleLogin(token, authStore.loginInfo.isForce);

    // 타이머 설정
    authStore.setAuthTimer();

    // 로그인 성공 시 대시보드로 이동
    await pushToDashboardAfterLogin(stores, router);
  } catch (e) {
    handleSnsLoginError(e);
  } finally {
    //
  }
}

// Apple 로그인 콜백
async function handleAppleCallback(response: any) {
  try {
    // 로그인정보 임시 저장 및 로그인
    console.log("Apple response: ", response);
    const token = response.detail.authorization.id_token;
    authStore.loginInfo.signupType = "apple";
    authStore.storeSnsLoginInfo(token);
    await requestAppleLogin(token, authStore.loginInfo.isForce);

    // 타이머 설정
    authStore.setAuthTimer();

    // 로그인 성공 시 대시보드로 이동
    await pushToDashboardAfterLogin(stores, router);
  } catch (e) {
    handleSnsLoginError(e);
  } finally {
    //
  }
}

//**created */
const appleLoginBtnWidth = (() => {
  if (window.innerWidth < breakpoints.mobile) {
    return 260;
  } else {
    return 375;
  }
})();

onMounted(() => {
  // SNS 콜백 초기화
  setGoogleApi(handleGoogleCallback);
  setAppleApi(handleAppleCallback);
});

onBeforeUnmount(() => {
  // Apple 콜백 제거
  unsetAppleApi(handleAppleCallback);
});
</script>
