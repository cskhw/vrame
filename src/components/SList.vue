<template>
  <div
    class="s-list"
    :style="[_listStyle]"
    @mouseenter="isHoverList = true"
    @mouseleave="isHoverList = false"
    @click="onClickSList"
  >
    <div style="margin-right: 0.5rem">
      <slot name="icon">
        <s-icon v-if="icon" :icon="icon.icon" :color="listIconColor" />
      </slot>
    </div>
    <div :style="_titleStyle">
      <slot name="title"></slot>
    </div>
    fdsa
    {{ children }}
    <SIcon v-if="children" class="s-list-downicon" :icon="mdiMenuDown" />
  </div>
</template>
<script setup lang="ts">
import type { TSList } from "@/types/component";
import { mdiMenuDown } from "@mdi/js";
import type { CSSProperties } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  listStyle?: CSSProperties;
  icon?: { icon: string; color: string };
  hoverColor?: string;
  hoverBgColor?: string;
  link?: boolean;
  to?: string;
  children?: () => TSList[];
}>();

const isHoverList = ref(false);
const listHoverBgColor = computed(() => {
  if (props.hoverBgColor) {
    if (isHoverList.value) return props.hoverBgColor;
    return "";
  } else {
    if (isHoverList.value) return "rgba(0,0,0,0.05)";
    return "";
  }
});

const listHoverColor = computed(() => {
  if (props.hoverColor) {
    if (isHoverList.value) {
      return props.hoverColor;
    } else return "";
  } else {
    if (isHoverList.value) {
      return "gray";
    } else return "";
  }
});

const listIconColor = computed(() => {
  if (props.icon) {
    if (isHoverList.value) {
      return props.icon.color;
    } else return "gray";
  } else {
    if (isHoverList.value) {
      return "rgba(0,0,0,0.1)";
    } else return "gray";
  }
});

const _listStyle = computed(() => ({
  backgroundColor: listHoverBgColor.value,
  cursor: props.link ? "pointer" : "",
  ...props.listStyle,
}));

const _titleStyle = computed(() => ({
  color: listHoverColor.value,
}));

function onClickSList() {
  if (props.to) {
    router.push(props.to);
  }
}
</script>
<style lang="scss">
@import "@/assets/stylesheets/components/s-list";
</style>
