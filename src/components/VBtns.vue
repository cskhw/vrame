<template>
  <div class="multi-buttons" ref="multiButtons">
    <v-btn
      :disabled="disabled"
      v-for="(value, index) in options"
      :key="value.value"
      :style="{
        borderRadius:
          index === 0
            ? '0.25rem 0 0 0.25rem'
            : index === options.length - 1
            ? '0 0.25rem 0.25rem 0'
            : false,
        fontSize: '0.875rem',
        fontWeight: curIdx === index ? 'bold' : '400',
        color: curIdx === index ? 'white' : '#616161',
        border: themeStore.darkmodeBorder,
        borderRight:
          index !== options?.length - 1 ? 'none' : themeStore.darkmodeBorder,
        width: 100 / options.length + '%',
        letterSpacing: 'normal',
        '--color-btn': btnColor ? btnColor : '#5c6bc0',
      }"
      :class="curIdx == index ? 'clicked' : ''"
      @click="onClickVBtn(index, value)"
      flat
    >
      <div style="line-height: 1rem">
        {{ value.text }}
      </div>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import useThemeStore from "@/store/useThemeStore";
import _ from "lodash";
import { onMounted, ref, watch } from "vue";

type ButtonValueType = {
  text?: string;
  value?: any;
};

const props = defineProps<{
  modelValue: ButtonValueType;
  options: ButtonValueType[];
  disabled?: boolean;
  btnColor?: string;
  borderColor?: string;
}>();
const emit = defineEmits(["update:modelValue"]);

const themeStore = useThemeStore();

const multiButtons = ref<HTMLElement>();

const modelValue = ref(props.modelValue);
const curIdx = ref(0);
function onClickVBtn(index: number, value: ButtonValueType) {
  curIdx.value = index;
  modelValue.value = value;
}

watch(props, () => {
  modelValue.value = props.modelValue;
  curIdx.value = _.findIndex(props.options, props.modelValue);
});

watch(modelValue, () => {
  emit("update:modelValue", modelValue.value);
});

onMounted(() => {
  curIdx.value = _.findIndex(props.options, props.modelValue);
});
</script>

<style lang="scss" scoped>
.multi-buttons {
  border-radius: 0.25rem;
  ::v-deep(.v-btn) {
    width: 10.125rem;
    height: 2.5rem;
    background-color: white;
    background: white;
    border-radius: 0rem;
    .v-btn__overlay {
      background: white;
    }
    &:hover {
      background-color: var(--color-btn);
      color: white !important;
    }
    &:focus {
      background-color: var(--color-btn);
      color: white;
    }
    &.clicked {
      background-color: var(--color-btn);
      color: white;
    }
  }
}
</style>
