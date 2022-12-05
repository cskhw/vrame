<template>
  <div
    class="r-btn"
    :style="[_btnStyle]"
    @mouseenter="isHoverBtn = true"
    @mouseleave="isHoverBtn = false"
    @click="onClickSBtn"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, type CSSProperties } from "vue";
import colors from "@/utils/colors";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  btnStyle?: CSSProperties;
  hoverBgColor?: string;
  hoverColor?: string;
  to?: string;
  href?: string;
}>();

const isHoverBtn = ref(false);

const btnBgColor = computed(() => {
  if (props.hoverBgColor) {
    if (isHoverBtn.value) {
      return props.hoverBgColor;
    } else {
      return props.btnStyle?.backgroundColor;
    }
  } else {
    if (isHoverBtn.value) {
      return colors.hoverBgColor;
    } else {
      return props.btnStyle?.backgroundColor;
    }
  }
});

const btnColor = computed(() => {
  if (props.hoverBgColor) {
    if (isHoverBtn.value) {
      return props.hoverBgColor;
    } else {
      return props.btnStyle?.color;
    }
  } else {
    if (isHoverBtn.value) {
      return colors.hoverColor;
    } else {
      return props.btnStyle?.color;
    }
  }
});

const _btnStyle = computed(() => ({
  ...props.btnStyle,
  backgroundColor: btnBgColor.value,
  color: btnColor.value,
}));

function onClickSBtn() {
  if (props.to) {
    router.push(props.to);
  } else if (props.href) {
    window.open(`${props.href}`);
  }
}
</script>
<style lang="scss">
@import "@/styles/components/r-btn";
</style>
