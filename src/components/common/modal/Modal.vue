<template>
  <div
    class="modal-wrapper"
    v-if="isOpen"
    :style="{ opacity: modalOpaSliderValue }"
  >
    <div class="modal-backgrounds" @click="isOpen = false" />
    <div
      class="modal-contents"
      :style="{
        width: width,
        maxWidth: width,
        backgroundColor:
          ($route.path === '/draft/workspace' ||
            $route.path === '/draft/wtab') &&
          stores.ts.isDarkmode
            ? stores.ts.darkmodePalette.backgroundColor
            : 'white',
        color: stores.ts.darkmodeColor,
      }"
    >
      <div>
        <div
          class="d-flex align-center justify-space-between mb-5"
          style="padding: 0 1.5rem"
        >
          <div
            class="text-bold-20-black"
            :style="{
              color: themeStore.darkmodeColor,
            }"
          >
            {{ title }}
          </div>
          <div
            class="d-flex justify-end align-center"
            :style="{ width: '10rem' }"
          >
            <IconBtn
              v-if="opacityBar && !disabled"
              class="mr-2"
              :color="Util.getColor(stores, 'PRIMARY')"
              :icon="mdiCircleOpacity"
            />
            <v-slider
              class="mr-4"
              v-if="opacityBar && !disabled"
              :style="{ width: '5rem', height: '1.875rem' }"
              v-model="modalOpaSliderValue"
              track-color="#7C7F90"
              :color="Util.getColor(stores, 'PRIMARY')"
              max="1"
              step="0.01"
              min="0.2"
            />

            <IconBtn
              v-if="closeBtn && !disabled"
              :icon="mdiClose"
              @click="isOpen = false"
            />
          </div>
        </div>

        <div
          class="text-400-14-black"
          style="margin: 0.5rem 1.5rem"
          :style="{
            color: themeStore.darkmodeColor,
          }"
          v-html="description"
        ></div>
        <div style="padding: 0 1.5rem">
          <slot />
        </div>
        <Divider
          class="ma-0 mb-4"
          :bd-color="stores.ts.darkmodeBorder.substring(10)"
          v-if="buttonType"
        />
        <!-- button-area -->
        <!-- no버튼일 때 -->
        <div
          class="d-flex"
          :class="{ 'justify-space-between': check, 'justify-end': !check }"
          v-if="buttonType === 'N'"
          :style="{ padding: '0 1.5rem' }"
        >
          <div class="d-flex align-center mr-4" v-if="check">
            <CheckBox
              v-model="isChecked"
              class="mr-4"
              :style="{ width: '0.9375rem', height: '0.9375rem' }"
            />
            <div
              v-html="checkTxt"
              class="modal-checkbox-text text-400-14-gray mt-1"
              style="cursor: pointer"
              @click="isChecked = !isChecked"
            />
          </div>
          <v-btn
            flat
            border="none"
            :style="{
              border: '1px solid ' + Util.getColor(stores, 'BUTTON'),
              color: Util.getColor(stores, 'BUTTON'),
              fontWeight: '400',
              backgroundColor: stores.ts.darkmodeBackgroundColor,
            }"
            @click="isOpen = false"
            :disabled="disabled"
            >{{ noTxt }}</v-btn
          >
        </div>
        <!-- yes버튼일 때 -->
        <div
          class="d-flex"
          :class="{ 'justify-space-between': check, 'justify-end': !check }"
          v-else-if="buttonType === 'Y'"
          :style="{ padding: '0 1.5rem' }"
        >
          <div class="d-flex align-center mr-4" v-if="check">
            <CheckBox
              v-model="isChecked"
              class="mr-4"
              :style="{ width: '0.9375rem', height: '0.9375rem' }"
            />
            <span :style="{ fontSize: '0.875rem' }">{{ checkTxt }}</span>
          </div>

          <v-btn
            color="#5c6bc0"
            text-color="white"
            style="color: white"
            flat
            :disabled="disabled"
            @click="yesFunc"
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
          :style="{ padding: '0 1.5rem' }"
        >
          <div class="d-flex align-center mr-4" v-if="check">
            <CheckBox
              v-model="isChecked"
              class="mr-4"
              :style="{ width: '0.9375rem', height: '0.9375rem' }"
            />
            <span :style="{ fontSize: '0.875rem' }">{{ checkTxt }}</span>
          </div>
          <div>
            <v-btn
              class="mr-2"
              flat
              border="none"
              :style="{
                color: Util.getColor(stores, 'BUTTON'),
                fontWeight: '400',
                backgroundColor: stores.ts.darkmodeBackgroundColor,
              }"
              :disabled="disabled"
              @click="isOpen = false"
              >{{ noTxt }}</v-btn
            >
            <v-btn
              color="#5c6bc0"
              flat
              :style="{
                color: Util.getColor(stores, 'BUTTON_TEXT'),
                backgroundColor: Util.getColor(stores, 'BUTTON'),
                fontWeight: '400',
              }"
              :disabled="yesBtnDisabled"
              @click="yesFunc(yesFuncParams)"
              >{{ yesTxt }}</v-btn
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CheckBox from "@/components/common/CheckBox.vue";
import IconBtn from "@/components/common/IconBtn.vue";
import * as Util from "@/assets/javascripts/ipedit_util";
import useThemeStore from "@/store/useThemeStore";
import { mdiCircleOpacity, mdiClose } from "@mdi/js";
import { ref, watch } from "vue";
import Divider from "@/components/Divider.vue";

const props = defineProps<{
  title?: string;
  description?: string;
  check?: boolean;
  checkValue?: boolean;
  checkTxt?: string;
  buttonType?: string;
  noTxt?: string;
  yesTxt?: string;
  yesFunc?: (e: any) => void;
  yesFuncParams?: object;
  yesBtnDisabled?: boolean;
  width?: string;
  opacityBar?: boolean;
  closeBtn?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits(["update:checkValue"]);

const themeStore = useThemeStore();

const stores = {
  ts: themeStore,
};
const isOpen = ref(false);
const show = () => (isOpen.value = true);
const hide = () => (isOpen.value = false);
const modalOpaSliderValue = ref(1);
const isChecked = ref(false);

// 모달이 열리면 스크롤이 안되게 클래스 부착
watch(isOpen, (newValue: any, _) => {
  if (isOpen.value) {
    document.querySelector("html")?.classList.add("disable-scroll");
  } else {
    window.onscroll = function () {};
    document.querySelector("html")?.classList.remove("disable-scroll");
  }
});
watch(props, (newValue) => {
  isChecked.value = newValue.checkValue;
});

watch(isChecked, (newValue) => {
  emit("update:checkValue", newValue);
});

defineExpose({ isOpen, show, hide });
</script>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.modal-wrapper {
  z-index: 1001 !important;
  display: grid !important;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  .modal-backgrounds {
    z-index: 1001 !important;
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
  }
  .modal-contents {
    z-index: 1001 !important;
    position: relative;
    height: max-content !important;
    max-width: max-content;
    padding: 2rem 0 1rem 0;
    opacity: 1;
    background-color: white;
    box-shadow: 0rem 0.25rem 1.25rem rgba(0, 0, 0, 0.25);
    border-radius: 0.5rem;
  }
}
</style>
