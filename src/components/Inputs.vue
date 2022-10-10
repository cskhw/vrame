<template>
  <div style="width: 100%; position: relative">
    <div class="omrs-input-group" style="position: relative">
      <form>
        <label class="omrs-input-filled">
          <!-- 비정상 Submit 방지 -->
          <input hidden />
          <!-- 비정상 Submit 방지 -->
          <input
            required
            class="input"
            v-model="modelValue"
            :id="inputId"
            :autocomplete="autocomplete ? autocomplete : 'off'"
            :name="name"
            :style="[
              !inputValidationCheckResult
                ? { borderColor: '#d2416d' }
                : { height: height ? height : '' },
            ]"
            :type="type"
            @blur="checkInputValidity"
          />

          <span class="omrs-input-label" @click="onClickPlaceholder">{{
            placeHolder
          }}</span>
        </label>
      </form>
      <div
        style="
          position: absolute;
          top: 43%;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-5%, -50%);
        "
        :style="[!buttonRequire ? { display: 'none' } : {}]"
      >
        <button
          :class="{ disable: !modelValue?.length }"
          :style="[
            modelValue?.length
              ? {
                  background: colors.MAIN,
                  color: '#fff',
                }
              : { background: 'gray', cursor: 'not-allowed' },
          ]"
          class="button"
          @click="onClickBtn"
        >
          {{ buttonRequire }}
        </button>
      </div>
    </div>
    <div
      v-if="!inputValidationCheckResult"
      style="
        margin: -0.375rem 0rem 0.625rem;
        font-size: 0.75rem;
        color: #d2416d;
      "
      @click="onClickPlaceholder"
    >
      <span class="omrs-input-helper">{{ checkResultMessage }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import colors from "@/assets/javascripts/colors";

// 전달받는 인자
const props = defineProps<{
  inputId?: string;
  // 자동완성 이용할지 여부, on/off
  autocomplete?: string;
  fatherClass?: string;
  className?: string;
  type?: string;
  placeHolder?: string;
  name?: string;
  // 입력된 데이터
  modelValue: string;
  Style?: string;
  // errorText?: string;
  successText?: string;
  buttonRequire?: string;
  buttonFunc?: (...args: any[]) => void;
  oldPass?: string;

  // 서버에서의 체크 결과
  serverCheckResult?: string;

  // 유효성체크 타입
  validationType?: string;
  // 입력 유효성 체크 결과 (부모로 올려줌)
  inputValidationCheckResult?: boolean;

  // 액션 실행 flag (부모로 올려줌)
  doAction?: boolean;

  height?: string;
  time?: number;
}>();
// 부모의 v-model에 붙은 데이터 업데이트용
const emit = defineEmits([
  "update:modelValue",
  "update:inputValidationCheckResult",
  "update:doAction",
]);
// v-model로 전달받은 데이터
const modelValue = ref(props.modelValue);
// 입력 데이터 서버 체크결과
const serverCheckResult = ref(props.serverCheckResult);

function onClickPlaceholder() {
  if (props?.inputId) {
    const input = document.getElementById(props?.inputId);
    if (input) input?.focus();
  }
}

// 부모로 올려줄 인풋 유효성 체크 결과 flag
const inputValidationCheckResult = ref(true);

// 유효성 체크 결과 메시지
const checkResultMessage = ref("");

const onClickBtn = () => {
  if (props?.buttonFunc) props.buttonFunc(modelValue.value);
};

// 유효성 체크
const checkInputValidity = () => {
  // console.log(props.validationType, modelValue.value);
  // 이메일 유효성 체크
  if (props.validationType == "email") {
    let regExp =
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (!regExp.test(modelValue.value)) {
      inputValidationCheckResult.value = false;
      checkResultMessage.value = "유효한 이메일 형식을 입력해 주세요.";
    } else {
      inputValidationCheckResult.value = true;
      checkResultMessage.value = "";
    }
  }
  // 비밀번호 유효성 체크
  else if (props.validationType == "password") {
    let regExp =
      /^(?=.*[a-zA-Z])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?=.*[0-9]).{8,20}$/;
    if (!regExp.test(modelValue.value)) {
      inputValidationCheckResult.value = false;
      checkResultMessage.value =
        "영문, 숫자, 특수기호를 조합하여 8-20자리로 입력해 주세요.";
    } else {
      inputValidationCheckResult.value = true;
      checkResultMessage.value = "";
    }
  }
};

watchEffect(() => {
  // console.log(serverCheckResult.value);
  // 데이터 변경 시 부모 데이터 업데이트
  emit("update:modelValue", modelValue.value);
  emit("update:inputValidationCheckResult", inputValidationCheckResult.value);
});
</script>

<style lang="scss" scoped>
@import "@/styles/signUp_outsourcing.scss";
</style>
