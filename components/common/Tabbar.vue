<template>
  <div class="tabbar">
    <div class="d-flex menu-btns">
      <button
        class="menu-btn"
        v-for="(item, index) in menu"
        :style="{
          backgroundColor: modelValue !== index ? '#dfdfdf' : 'white',
          opacity: modelValue !== index && isHoverIndices[index] ? '.8' : '1',
          color: modelValue !== index ? '#7C7F90' : '',
          cursor: modelValue !== index ? 'pointer' : 'unset',
        }"
        flat
        @click="tabIndex = index"
        :key="item.menu"
        @mouseenter="isHoverIndices[index] = true"
        @mouseleave="isHoverIndices[index] = false"
      >
        <div class="d-flex align-center">
          <img
            v-if="item?.icon && item?.icon.includes('.png')"
            src="@/assets/images/ipedit-symbol.png"
          />
          <v-icon v-else-if="item?.icon" :icon="item.icon"></v-icon>
          <span class="ml-2">{{ item.menu }}</span>
        </div>
      </button>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const isHoverIndices = ref([]);
const hoverIndex = ref(0);

interface Props {
  modelValue: number;
  menu: Array<{
    menu: string;
    icon?: string;
  }>;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);
const tabIndex = ref(props.modelValue);
const menu = ref(props.menu);
watch(tabIndex, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>

<style lang="scss" scoped>
.tabbar {
  position: relative;
  .menu-btns {
    position: relative;
    & > button {
      margin-right: 0.375rem;
      position: relative;
      top: 0.0625rem;
      border-top: 0.0625rem solid #dfdfdf;
      border-left: 0.0625rem solid #dfdfdf;
      border-right: 0.0625rem solid #dfdfdf;
      border-radius: 0.5rem 0.5rem 0 0;
      padding: 0 1rem;
      font-size: 1.25rem;
      height: 4.0625rem;
      z-index: 999;
    }
  }
}
</style>
