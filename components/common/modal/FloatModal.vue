<template>
  <div class="modal-wrapper">
    <!-- content-area -->
    <div class="modal-background" @click="noFunc" />
    <div
      class="modal-contents"
      :style="{
        left: right ? '' : left ? left + 'px' : '',
        right: right ? '0' : '',
        top: top + 'px',
        opacity: modalOpaSliderValue,
      }"
    >
      <div class="pa-4">
        <div class="d-flex align-center justify-space-between">
          <div class="text-400-22-black">{{ title }}</div>
          <div class="d-flex align-center justify-space-between">
            <IconBtn
              v-if="opacityBar"
              class="mr-2"
              color="#5c6bc0"
              :icon="mdiCircleOpacity"
            />
            <v-slider
              v-if="opacityBar"
              class="mr-4"
              :style="{ width: '5rem', height: '1.875rem' }"
              v-model="modalOpaSliderValue"
              track-color="#7C7F90"
              color="#5c6bc0"
              max="1"
              step="0.01"
              min="0.2"
            />
            <IconBtn
              v-if="closeBtn"
              color="gray"
              :icon="mdiClose"
              @click="noFunc"
            />
          </div>
        </div>
        <div class="description">{{ description }}</div>
        <slot />
      </div>
      <!-- button-area -->
      <div class="pa-2 px-4" :style="{ borderTop: '0.0625rem solid #eeeeee' }">
        <div class="mt-1"></div>
        <!-- no버튼일 때 -->
        <div
          class="d-flex"
          :class="{ 'justify-space-between': check, 'justify-end': !check }"
          v-if="buttonType === 'N'"
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
          class="d-flex"
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
            color="#5c6bc0"
            text-color="white"
            style="color: white"
            flat
            @click="yesFunc"
            >{{ yesTxt }}</v-btn
          >
        </div>
        <!-- buttonType === NY모드일 때 -->
        <div
          class="d-flex"
          :class="{
            'justify-space-between': check || deleteBtn,
            'align-center': check,
            'justify-end': !check,
          }"
          v-else-if="buttonType === 'NY'"
        >
          <div class="d-flex align-center mr-4" v-if="check">
            <input class="mx-1" type="checkbox" v-model="isChecked" />
            <span :style="{ fontSize: '0.875rem' }">{{ checkTxt }}</span>
            {{ deleteBtn }}
          </div>
          <v-btn
            v-if="deleteBtn"
            flat
            border="none"
            :style="{
              width: '4rem',
              color: '#5c6bc0',
              fontWeight: '400',
            }"
            @click="deleteFunc"
          >
            {{ deleteTxt }}</v-btn
          >
          <div>
            <v-btn
              flat
              border="none"
              :style="{
                color: '#5c6bc0',
                fontWeight: '400',
              }"
              class="mr-2"
              @click="noFunc"
              >{{ noTxt }}</v-btn
            >
            <v-btn
              color="#5c6bc0"
              text-color="white"
              style="color: white"
              flat
              :style="{ fontWeight: '400' }"
              @click="yesFunc"
              >{{ yesTxt }}</v-btn
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconBtn from "@/components/common/IconBtn.vue";
import { mdiCircleOpacity, mdiClose } from "@mdi/js";
import { ref } from "vue";

interface Props {
  title?: string;
  description?: string;
  check?: boolean;
  checkTxt?: string;
  buttonType?: string;
  noTxt?: string;
  yesTxt?: string;
  deleteTxt?: string;
  yesFunc?: (e?: any) => void;
  deleteFunc?: (e?: any) => void;
  noFunc?: (e?: any) => void;
  deleteBtn?: boolean;
  left?: number;
  top?: number;
  right?: boolean;
  opacityBar?: boolean;
  closeBtn?: boolean;
}

const props = defineProps<Props>();

const isChecked = ref<boolean>(false);
const modalOpaSliderValue = ref<number>(1);
</script>

<style lang="scss" scoped>
.modal-wrapper {
  display: inline-block;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  .modal-background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: transparent;
  }
  .modal-contents {
    position: absolute;
    opacity: 1;
    background-color: white;
    box-shadow: 0rem 0.25rem 1.25rem rgba(0, 0, 0, 0.25);
    border-radius: 0.5rem;
    animation: show-modal 0.2s;
    transition: height 0s;
    @keyframes show-modal {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .description {
      font-weight: 500;
      font-size: 1.125rem;
      line-height: 1.5rem;
      color: #1b1a1b;
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
