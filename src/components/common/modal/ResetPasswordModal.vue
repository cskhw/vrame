<template>
  <div
    class="modal"
    ref="modal"
    v-bind:class="{ 'is-active': modalStore.resetPasswordModal.isOpen }"
  >
    <div class="modal-background is-clipped"></div>
    <div class="modal-content">
      <button
        class="modal-close is-large"
        aria-label="close"
        v-on:click="modalStore.resetPasswordModal.hide()"
      ></button>

      <h1>{{ Util.getLocaleTxt(t, "resetpassword_title") }}</h1>
      <p class="">{{ Util.getLocaleTxt(t, "resetpassword_desc") }}</p>
      <!-- password -->
      <div class="field mb-5">
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
                  v-model="formData.password"
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
                  @keydown="handleKeydown('password', $event)"
                />
                <span
                  class="omrs-input-label"
                  @click="placeholderClick('password')"
                  >{{
                    Util.getLocaleTxt(t, "signupform_passwordPlaceholder")
                  }}</span
                >
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
      </div>

      <!-- password confirm-->
      <div class="field">
        <div class="field" style="height: 4.6875rem">
          <div style="width: 100%; position: relative">
            <div class="omrs-input-group" style="position: relative">
              <label class="omrs-input-filled">
                <!-- 비정상 Submit 방지 -->
                <input hidden />
                <!-- 비정상 Submit 방지 -->
                <input
                  required
                  class="input"
                  v-model="formData.passwordConfirm"
                  id="password-confirm-input"
                  autocomplete="off"
                  name="password-confirm-input"
                  :style="[
                    passwordConfirmValidationCheckResult
                      ? { borderColor: '#f1f1f1' }
                      : { borderColor: '#d2416d' },
                  ]"
                  type="password"
                  @blur="checkInputValidity('passwordConfirm')"
                  @keydown="handleKeydown('passwordConfirm', $event)"
                />
                <span
                  class="omrs-input-label"
                  @click="placeholderClick('passwordConfirm')"
                  >{{
                    Util.getLocaleTxt(
                      t,
                      "signupform_passwordConfirmPlaceholder"
                    )
                  }}</span
                >
              </label>
            </div>
            <div
              v-if="!passwordConfirmValidationCheckResult"
              style="
                margin: -0.375rem 0rem 0.625rem;
                font-size: 0.75rem;
                color: #d2416d;
              "
            >
              <span class="omrs-input-helper">{{
                passwordConfirmCheckResultMessage
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Reset -->
      <Button
        class="ma-0 mt-8"
        :text="Util.getLocaleTxt(t, 'resetpassword_title')"
        style="width: 10rem"
        v-on:click="requestResetPassword"
        :disabled="submitDisabled"
      >
      </Button>
    </div>
    <template v-if="isLoading">
      <div
        class="modal-content d-flex align-center justify-center"
        style="
          position: absolute;
          height: 28.8125rem;
          z-index: 2;
          background: rgb(0, 0, 0, 0.5);
        "
      />
      <div
        class="modal-content d-flex align-center justify-center"
        style="
          position: absolute;
          height: 28.8125rem;
          z-index: 2;
          background: transparent;
        "
      >
        <v-progress-circular
          indeterminate
          color="#5c6bc0"
          width="7"
          :size="50"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import api from "@/api/api";
import Button from "@/components/Button.vue";
import useAppStore from "@/store/useAppStore";
import useModalStore from "@/store/useModalStore";
import { extractError, responseStatus } from "@/api/error";
import { asyncDebounce } from "@/assets/javascripts/utils/asyncDebounce";
import { onMounted, ref, watch } from "vue";

import { useI18n } from "vue-i18n";

import * as Util from "@/assets/javascripts/ipedit_util";

const { t } = useI18n();

const modalStore = useModalStore();
const appStore = useAppStore();

const stores = {
  ms: modalStore,
  as: appStore,
};

const sendEmail = ref(false);
const successPopup = ref(false);

const formData = ref<{
  password: string;
  passwordConfirm: string;
}>({
  password: "",
  passwordConfirm: "",
});

// 비밀번호 유효성 체크 결과
const passwordValidationCheckResult = ref(true);
// 비밀번호 유효성 체크 결과 메시지
const passwordCheckResultMessage = ref("");

// 비밀번호 재입력 유효성 체크 결과
const passwordConfirmValidationCheckResult = ref(true);
// 비밀번호 재입력 유효성 체크 결과 메시지
const passwordConfirmCheckResultMessage = ref("");

const submitDisabled = ref(true);

const isLoading = ref(false);

// 인풋 유효성 체크
function checkInputValidity(target: string) {
  // console.log(props.validationType, modelValue.value);
  // 비밀번호 유효성 체크
  if (target == "password" && formData?.value.password.trim() != "") {
    let regExp =
      /^(?=.*[a-zA-Z])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?=.*[0-9]).{8,20}$/;
    if (!regExp.test(formData.value.password)) {
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

  // 비밀번호 재입력 유효성 체크
  if (
    target == "passwordConfirm" &&
    formData.value.passwordConfirm.trim() != ""
  ) {
    let regExp =
      /^(?=.*[a-zA-Z])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?=.*[0-9]).{8,20}$/;
    if (!regExp.test(formData.value.passwordConfirm)) {
      passwordConfirmValidationCheckResult.value = false;
      passwordConfirmCheckResultMessage.value = Util.getLocaleTxt(
        t,
        "common_passwordFormatError"
      );
    } else if (formData.value.password != formData.value.passwordConfirm) {
      passwordConfirmValidationCheckResult.value = false;
      passwordConfirmCheckResultMessage.value = Util.getLocaleTxt(
        t,
        "signupform_passwordConfirmError"
      );
    } else {
      passwordConfirmValidationCheckResult.value = true;
      passwordConfirmCheckResultMessage.value = "";
    }
  }
}

// 각 입력창에서 키보드 이벤트 들어오는거 핸들링
function handleKeydown(target: string, e: KeyboardEvent) {
  // 입력창에서는 Esc 눌러도 안나감
  if (e.key == "Escape") {
    e.preventDefault();
    e.stopPropagation();
  }

  // 비밀번호인 경우, 키입력 있으면 상태를 정상으로 바꿔줌. 엔터치면 blur시켜서 유효성 체크하게 동작
  if (target == "password") {
    passwordValidationCheckResult.value = true;
    passwordCheckResultMessage.value = "";
    if (e.key == "Enter") {
      document.getElementById("password-confirm-input")?.focus();
    }
  }

  // 비밀번호재입력인 경우, 키입력 있으면 상태를 정상으로 바꿔줌. 엔터치면 blur시켜서 유효성 체크하게 동작
  if (target == "passwordConfirm") {
    passwordConfirmValidationCheckResult.value = true;
    passwordConfirmCheckResultMessage.value = "";
    if (e.key == "Enter") {
      document.getElementById("password-confirm-input")?.blur();
    }
  }
}

// UI상 placeholder 위치가 커서, placeholder 누르면 입력창으로 이동시켜 줌
function placeholderClick(target: string) {
  console.log(target);
  if (target == "password") {
    document.getElementById("password-input")?.focus();
  }

  if (target == "passwordConfirm") {
    document.getElementById("password-confirm-input")?.focus();
  }
}

// 비밀번호 재설정 버튼 활성화 제어
function checkSubmitStatus() {
  // console.log("바뀌었다");
  if (
    formData.value.password &&
    formData.value.passwordConfirm &&
    formData.value.password === formData.value.passwordConfirm &&
    passwordValidationCheckResult.value &&
    passwordConfirmValidationCheckResult.value
  )
    submitDisabled.value = false;
  else submitDisabled.value = true;
}

// 비밀번호 재설정 버튼 클릭
async function requestResetPassword() {
  try {
    isLoading.value = true;

    let body = {
      user_pwd: formData.value.password,
    };
    // 임시 토큰 발급
    await asyncResetPassword(body);

    // 성공 결과 메시지 보여주고, 다시 로그인 유도
    modalStore.infoModal.alert = false;
    modalStore.infoModal.title = Util.getLocaleTxt(
      t,
      "resetpassword_result_title"
    );
    modalStore.infoModal.desc = Util.getLocaleTxt(
      t,
      "resetpassword_result_desc"
    );
    modalStore.infoModal.buttonType = "Y";
    modalStore.infoModal.yesButtonText = "OK";
    modalStore.infoModal.yesButtonFunc = () => {
      modalStore.infoModal.hide();
      modalStore.loginModal.show(); // 로그인 모달로 유도
    };
    modalStore.infoModal.closeBtn = false;
    modalStore.resetPasswordModal.hide();
    modalStore.infoModal.show();
  } catch (e) {
    const error = extractError(e);
    // appStore.isLoading = false;
    Util.openAlertModal(stores, error.status);
  } finally {
    isLoading.value = false;
  }
}
const asyncResetPassword = asyncDebounce(api.auth.requestResetPassword);

// formData의 상태를 보고 가입하기 버튼 상태 변경
watch(formData.value, (newValue, oldValue) => {
  checkSubmitStatus();
});
</script>

<style lang="scss" scoped>
@import "@/styles/login_outsourcing.scss";
@import "@/styles/resetPassword_outsourcing.scss";
@import "@/styles/global_outsourcing.scss";

.modal-content {
  overflow: visible;
}
.navbar-dropdown {
  margin-top: 0.0625rem;
  border: none;
  padding-top: 0.375rem;
  padding-left: 0.375rem;
  padding-right: 0.375rem;
  overflow-y: scroll;
  height: 10.375rem;
  background: #fff !important;
  z-index: 100000000000000000;
  position: absolute;
  width: max-content;

  .navbar-item {
    display: flex;
    flex-direction: column;
    padding: 0.375rem;
    height: 2rem;
    &:hover {
      background: #f6f7f9 !important;
      border-radius: 0.25rem;
    }
    p {
      width: 100%;
      text-align: left;
      font-size: 0.875rem;
      padding-bottom: 0 !important;
      color: #212037;
      margin: 0;
    }
  }
  .item__country {
    // margin-bottom: 0.625rem;
    border: none;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    height: 2rem;
    @media only screen and (max-width: 36.375rem) {
      width: 2.8125rem;
    }

    img {
      position: relative !important;
      top: 0 !important;
      left: 0 !important;
      // width: 100%;
      // height: 100%;
      // object-fit: cover;
      // @media only screen and (max-width: 36.375rem) {
      //   width: auto;
      //   height: auto;
      //   margin-top: -0.625rem;
      // }
    }
    span {
      font-weight: 400;
      font-size: 0.875rem;
    }
    .nameCountry {
      color: #212037;
      margin: 0 0.625rem;
    }
    .dial_code {
      color: #7c7f90;
    }
  }
}

.navbar-item,
.navbar-link {
  img {
    left: 0.25rem !important;
    top: 30% !important;
  }

  line-height: 100%;
  padding: 0.3125rem;
  background-color: rgba(255, 255, 255, 0) !important;

  // &:hover {
  //   background-color: #fff !important;
  // }
}
.navbar-link:not(.is-arrowless)::after {
  border-color: #212037;
  margin-top: -0.25rem;
  right: 0.625rem;
}
.field:not(:last-child) {
  margin-bottom: 0;
}
.navbar-item,
.has-dropdown,
.is-hoverable {
  border: 0.0625rem solid #f1f1f1;
  border-radius: 0.375rem;
  height: 3.25rem;
  width: 100%;
  a {
    width: 100% !important;
    display: flex;
    color: #7c7f917a;
    font-size: 0.875rem;
    height: 100%;
    align-items: center;
    // &:hover {
    //   color: #7c7f90 !important;
    // }
  }
}
.select__cout {
  &:hover {
    color: #7c7f90 !important;
  }
}
.selected__cout {
  &:hover {
    color: rgb(33, 32, 55) !important;
  }
}
.select__cout:active {
  box-shadow: none !important;
  border-color: #5c6bc0 !important;
}

.select-signupEmail {
  color: #13131599 !important;
  padding-left: 0.625rem !important;
  &:hover {
    color: #13131599 !important;
  }
}
.selected-signupEmail {
  color: #000 !important;
  &:hover {
    color: #000 !important;
  }
}
.px-2 {
  text-align: left;
  padding: 0 !important;
  .services {
    padding-top: 1.25rem;
    // padding-top: 0.4375rem;
    h3 {
      padding-bottom: 0.5rem;
    }
  }
  .content-data {
    .field {
      .select,
      select {
        height: 3.25rem;
        width: 100%;
        color: #7c7f91 !important;
      }
      .select:not(.is-multiple):not(.is-loading)::after {
        border-color: #7c7f91;
      }
    }
    .field-doubles {
      display: flex;
      justify-content: space-between;
      .control {
        width: 100%;
        input {
          border-color: #dbdbdb;
          padding-left: 0.625rem;
          color: #7c7f91;
        }
      }
      .control-button {
        position: absolute;
        right: 0.625rem;
        text-align: right;
        top: 0.625rem;
        width: max-content;
      }
      button {
        width: max-content;
        background: #e0e0e0;
        border-radius: 0.25rem;
        color: #bdbdbd;
        font-size: 0.875rem;
        width: 6.25rem;
        height: 2.25rem;
      }
    }
  }
  .select-country {
    display: flex;
    justify-content: space-between;
    // margin-bottom: 0.625rem;
    .navbar-item {
      border-radius: 0.375rem;
      .selected__cout {
        &:hover {
          color: rgb(33, 32, 55) !important;
        }
      }
      .navbar-link {
        &:hover {
          color: #7c7f90;
        }
      }
    }
    @media only screen and (max-width: 36.375rem) {
      flex-direction: column;
    }
    option {
      span:nth-child(1) {
        // color: #212037 !important;
        &:hover {
        }
      }
      span:nth-child(2) {
        // color: #7c7f90 !important;
      }
    }
    .field {
      width: 27%;
      @media only screen and (max-width: 36.375rem) {
        width: 100% !important;
      }
    }
    .field-doubles {
      width: 70%;
      @media only screen and (max-width: 36.375rem) {
        width: 100%;
      }
    }
  }
}
</style>
