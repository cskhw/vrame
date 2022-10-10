<template>
  <div
    class="modal moda-login"
    v-bind:class="{ 'is-active': modalStore.loginModal.isOpen }"
    style="animation: fadein 0.5s"
  >
    <div
      class="modal-background"
      :style="{ backgroundColor: '#0a0a0a1a' }"
      @click="modalStore.loginModal.hide()"
    ></div>
    <div
      class="modal-content"
      :style="[
        modalSignup || modalResetPass || modalFindEmail
          ? { display: 'none' }
          : { display: 'block' },
      ]"
    >
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="modalStore.loginModal.hide"
      ></button>
      <div class="logo">
        <img
          :style="[
            {
              width: '12.5rem',
              height: 'auto',
              filter:
                'invert(0%) sepia(87%) saturate(7459%) hue-rotate(172deg) brightness(0%) contrast(108%)',
            },
          ]"
          :src="logo"
          alt="@/assets/images/ipedit.svg"
        />
      </div>

      <p class="signup-title mb-2">
        {{ Util.getLocaleTxt(t, "common_login") }}
      </p>

      <form method="post">
        <!-- Input email -->
        <div class="field" style="max-height: 4.6875rem">
          <div style="width: 100%; position: relative">
            <div class="omrs-input-group" style="position: relative">
              <label class="omrs-input-filled">
                <!-- 비정상 Submit 방지 -->
                <input hidden />
                <!-- 비정상 Submit 방지 -->
                <input
                  required
                  class="input"
                  v-model="data.email"
                  id="email-input"
                  autocomplete="off"
                  name="email-input"
                  :style="[
                    emailValidationCheckResult
                      ? { borderColor: '#f1f1f1' }
                      : { borderColor: '#d2416d' },
                  ]"
                  type="text"
                  @blur="checkInputValidity('email')"
                  @keydown="handleEnter('email', $event)"
                />
                <span class="omrs-input-label">{{
                  Util.getLocaleTxt(t, "common_email")
                }}</span>
              </label>
            </div>
            <div
              v-if="!emailValidationCheckResult"
              style="
                margin: -0.375rem 0rem 0.625rem;
                font-size: 0.75rem;
                color: #d2416d;
              "
            >
              <span class="omrs-input-helper">{{
                emailCheckResultMessage
              }}</span>
            </div>
          </div>
        </div>

        <!-- Input password -->
        <div class="field" style="max-height: 4.6875rem">
          <div style="width: 100%; position: relative">
            <div class="omrs-input-group" style="position: relative">
              <label class="omrs-input-filled">
                <!-- 비정상 Submit 방지 -->
                <input hidden />
                <!-- 비정상 Submit 방지 -->
                <input
                  required
                  class="input"
                  v-model="data.password"
                  id="password-input"
                  autocomplete="off"
                  name="password-input"
                  :style="[
                    passwordValidationCheckResult
                      ? { borderColor: '#f1f1f1' }
                      : { borderColor: '#d2416d' },
                  ]"
                  type="password"
                  @blur="checkInputValidity('password')"
                  @keydown="handleEnter('password', $event)"
                />
                <span class="omrs-input-label">{{
                  Util.getLocaleTxt(t, "common_password")
                }}</span>
              </label>
            </div>
            <div
              v-if="!passwordValidationCheckResult"
              style="
                margin: -0.375rem 0rem 0.625rem;
                font-size: 0.75rem;
                color: #d2416d;
              "
            >
              <span class="omrs-input-helper">{{
                passwordCheckResultMessage
              }}</span>
            </div>
          </div>
        </div>
      </form>

      <!-- 이메일 저장하기 및 이메일, 패스워드 찾기 -->
      <div class="d-flex align-center checkbox-control">
        <CheckBox
          v-model="autoEmailValue"
          color="#5c6bc0"
          :label="Util.getLocaleTxt(t, 'login_emailCookie')"
          v-on:click="onClickSaveEmailCheckBox"
        />
        <div class="d-flex mt-2">
          <div class="forget-pass mr-2" v-on:click="onClickFindEmailBtn">
            {{ Util.getLocaleTxt(t, "login_findEmailBtn") }}
          </div>
          <div class="forget-pass" v-on:click="onClickFindPasswordwBtn">
            {{ Util.getLocaleTxt(t, "login_findPasswordBtn") }}
          </div>
        </div>
      </div>

      <!-- login with Email -->
      <Button
        style="width: 100%; color: #ffffff"
        :style="[
          data.email !== '' &&
            data.password !== '' && {
              background: '#5C6BC0',
              color: '#fff',
            },
        ]"
        :text="Util.getLocaleTxt(t, 'common_login')"
        @click="checkValidationAndLogin"
      >
      </Button>

      <div class="or">{{ Util.getLocaleTxt(t, "common_or") }}</div>

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
            width: '100%',
            'margin-top': '0.625rem',
          }"
        ></div>
      </div>

      <p class="signup">
        {{ Util.getLocaleTxt(t, "login_requestSignUp")
        }}<span
          v-on:click="
            modalStore.loginModal.hide();
            modalStore.signUpEnteranceModal.show();
          "
          >{{ Util.getLocaleTxt(t, "common_signUp") }}</span
        >
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/login_outsourcing.scss";
@import "@/styles/signUp_outsourcing.scss";
</style>

<script lang="ts" setup>
import { extractError, responseStatus } from "@/api/error";
import Logo from "@/assets/images/draft.svg";
import * as Util from "@/assets/javascripts/ipedit_util";
import { asyncDebounce } from "@/assets/javascripts/utils/asyncDebounce";
import {
  pushToDashboardAfterLogin,
  requestAppleLogin,
  requestEmailLogin,
  requestGoogleLogin,
  setAppleApi,
  setGoogleApi,
  unsetAppleApi,
} from "@/assets/javascripts/utils/authUtil";
import Button from "@/components/Button.vue";
import CheckBox from "@/components/common/CheckBox.vue";
// import Input from "@/components/Inputs.vue";
import useAppStore from "@/store/useAppStore";
import useAuthStore from "@/store/useAuthStore";
import useModalStore from "@/store/useModalStore";
import type { AxiosError } from "axios";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { GlobalCookies } from "@/assets/javascripts/cookie";
import breakpoints from "@/assets/javascripts/breakpoints";

const { t } = useI18n();

const router = useRouter();

// 스토어 생성
const appStore = useAppStore();
const modalStore = useModalStore();
const authStore = useAuthStore();

const stores = {
  as: appStore,
  ms: modalStore,
};

// 컴포넌트 Ref 정의
const data = ref<any>({
  email: "",
  password: "",
});

const autoEmailValue = ref(true);
const modalSignup = ref(false);
const logo = Logo;

// 이메일 유효성 체크 결과
const emailValidationCheckResult = ref(true);
// 이메일 유효성 체크 결과 메시지
const emailCheckResultMessage = ref("");

// 비밀번호 유효성 체크 결과
const passwordValidationCheckResult = ref(true);
// 비밀번호  유효성 체크 결과 메시지
const passwordCheckResultMessage = ref("");

const modalResetPass = ref(false);
const modalFindEmail = ref(false);

// 이메일 저장하기 체크박스 선택 시 동작
function onClickSaveEmailCheckBox() {
  // input으로 구현된게 아니라, 클릭하는 시점에서 autoEmailValue의 true/false는 체크 상태랑 반대
  autoEmailValue.value
    ? GlobalCookies.remove("email")
    : GlobalCookies.set("email", data.value.email);
}

function onClickFindEmailBtn() {
  modalStore.loginModal.hide();
  modalStore.findEmailModal.show();
}

function onClickFindPasswordwBtn() {
  modalStore.loginModal.hide();
  modalStore.findPasswordModal.show();
}

// 이메일 로그인 에러 처리
// TODO: 500 에러
function handleEmailLoginError(e: AxiosError | Error | any) {
  const error = extractError(e);

  // 없는 이메일
  if (error.status === responseStatus.notFoundError) {
    emailValidationCheckResult.value = false;
    emailCheckResultMessage.value = Util.getLocaleTxt(t, "login_noEmailError");
  }
  // 비밀번호 잘못된 경우
  else if (error.status === responseStatus.invalidAuthenticationRequestError) {
    passwordValidationCheckResult.value = false;
    passwordCheckResultMessage.value = Util.getLocaleTxt(
      t,
      "login_passwordError"
    );
  }
  // 클라이언트 전송 데이터와 백앤드 스키마 (엔티티) 불일치
  else if (error.status === responseStatus.unprocessableEntityError) {
    emailValidationCheckResult.value = false;
    emailCheckResultMessage.value = Util.getLocaleTxt(
      t,
      "login_wrongDataError"
    );
    passwordValidationCheckResult.value = false;
    passwordCheckResultMessage.value = Util.getLocaleTxt(
      t,
      "login_wrongDataError"
    );
  }
  // 살아있는 세션이 있음
  else if (error.status === responseStatus.invalidUserSessionRequestError) {
    console.log("on Session");

    setupSessionModalData();
    // 세션 모달 "예" 버튼 함수 설정
    modalStore.sessionModal.yesButtonFunc = async () => {
      // 세션 끊고 강제 로그인 요청
      // 로그인정보 임시 저장 및 로그인
      authStore.storeEmailLoginInfo(data.value.email, data.value.password);
      await requestEmailLogin(data.value.email, data.value.password, true);

      // 로그인 성공 시 임시저장정보 삭제
      authStore.removeEmailLoginInfo();

      // 타이머 설정
      authStore.setAuthTimer();

      // 로그인 성공 시 대시보드로 이동
      await pushToDashboardAfterLogin(stores, router);
    };
    modalStore.sessionModal.title = "";
    modalStore.sessionModal.show();
  } else {
    console.log("Email Login Error: ", e);
  }
}

// SNS 로그인 에러 처리
// TODO: 500 에러
function handleSnsLoginError(e: AxiosError | Error | any) {
  const error = extractError(e);

  // 존재하지 않는 아이디. 회원가입으로 유도
  if (error.status === responseStatus.notFoundError) {
    modalStore.loginModal.hide();
    modalStore.signUpFormsModal.show();
  }
  // 살아있는 세션이 있음
  else if (error.status === responseStatus.invalidUserSessionRequestError) {
    modalStore.loginModal.hide();

    setupSessionModalData();
    modalStore.sessionModal.yesButtonFunc = async () => {
      console.log("session yes btn");
      try {
        if (authStore.loginInfo.signupType == "google")
          await requestGoogleLogin(authStore.loginInfo.token, true);
        else if (authStore.loginInfo.signupType == "apple")
          await requestAppleLogin(authStore.loginInfo.token, true);
        // 타이머 설정
        authStore.setAuthTimer();
        // 로그인 성공 시 대시보드로 이동
        await pushToDashboardAfterLogin(stores, router);
      } catch (e) {
        console.log(e);
      } finally {
        //
      }
    };

    modalStore.sessionModal.title = "";
    modalStore.sessionModal.show();
  } else {
    console.log("SNS Login Error: ", e);
  }
}

// 이메일 로그인 실행
async function requestLogin() {
  try {
    // 로그인정보 임시 저장 및 로그인
    authStore.storeEmailLoginInfo(data.value.email, data.value.password);
    await requestEmailLogin(data.value.email, data.value.password, false);

    // 로그인 성공 시 임시저장 정보 삭제
    authStore.removeEmailLoginInfo();

    // 타이머 설정
    authStore.setAuthTimer();

    // 대시보드 이동
    await pushToDashboardAfterLogin(stores, router);
  } catch (e) {
    handleEmailLoginError(e);
  } finally {
    //
  }
}

// 로그인 신청 전에 마지막으로 전체 유효성 체크
function checkValidationAndLogin() {
  // 입력값 없거나 유효성 체크 통과 못했으면 빠져나감
  if (data.value.email.trim() == "" || !emailValidationCheckResult.value) {
    document.getElementById("email-input")?.focus();
    return;
  }

  if (
    data.value.password.trim() == "" ||
    !passwordValidationCheckResult.value
  ) {
    document.getElementById("password-input")?.focus();
    return;
  }

  if (autoEmailValue.value == true) {
    // console.log("이메일 쿠키 저장함");
    GlobalCookies.remove("email");
    GlobalCookies.set("email", data.value.email);
  }

  // console.log("여기 오나");

  asyncLogin();
}

// 로그인 반복 호출 방지
const asyncLogin = asyncDebounce(requestLogin);

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

// 인풋 유효성 체크
function checkInputValidity(target: string) {
  // console.log(props.validationType, modelValue.value);
  // 이메일 유효성 체크
  if (target == "email" && data.value.email.trim() != "") {
    let regExp =
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (!regExp.test(data.value.email)) {
      emailValidationCheckResult.value = false;
      emailCheckResultMessage.value = Util.getLocaleTxt(
        t,
        "common_emailFormatError"
      );
    } else {
      emailValidationCheckResult.value = true;
      emailCheckResultMessage.value = "";
    }
  }
  // 비밀번호 유효성 체크
  else if (target == "password" && data.value.password.trim() != "") {
    let regExp =
      /^(?=.*[a-zA-Z])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?=.*[0-9]).{8,20}$/;
    if (!regExp.test(data.value.password)) {
      passwordValidationCheckResult.value = false;
      passwordCheckResultMessage.value = Util.getLocaleTxt(
        t,
        "common_passwordFormatError"
      );
    } else {
      passwordValidationCheckResult.value = true;
      passwordCheckResultMessage.value = "";
    }
  }
}

function handleEnter(target: string, e: KeyboardEvent) {
  if (target == "email" && e.key == "Enter") {
    document.getElementById("password-input")?.focus();
  } else if (target == "password" && e.key == "Enter") {
    checkValidationAndLogin();
  }
}

function setupSessionModalData() {
  modalStore.sessionModal.desc = Util.getLocaleTxt(
    t,
    "login_sessionExistWarning"
  );
  modalStore.sessionModal.noButtonText = Util.getLocaleTxt(t, "common_no");
  modalStore.sessionModal.yesButtonText = Util.getLocaleTxt(t, "common_login");
}
/**created */
const appleLoginBtnWidth = (() => {
  if (window.innerWidth < breakpoints.mobile) {
    return 260;
  } else {
    return 375;
  }
})();

onMounted(() => {
  // 쿠키에 저장된 이메일 있으면 불러와서 셋팅
  if (GlobalCookies.get("email")) {
    data.value.email = GlobalCookies.get("email");
    autoEmailValue.value = true;
  } else {
    autoEmailValue.value = false;
  }

  // SNS 콜백 초기화
  setGoogleApi(handleGoogleCallback);
  setAppleApi(handleAppleCallback);
});

onBeforeUnmount(() => {
  // Apple 콜백 제거
  unsetAppleApi(handleAppleCallback);
});
</script>
