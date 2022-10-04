<template>
  <div class="s-list">
    <div
      class="s-list-body"
      :style="[_listStyle]"
      @mouseenter="isHoverList = false"
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
      <Transition :name="downIconAnimeName">
        <s-icon
          v-if="children?.length && isShowDownIcon"
          class="s-list-downicon"
          :icon="sListDownIcon"
        />
      </Transition>
    </div>

    <template v-if="isShowChildren">
      <template v-for="child in children" :key="children">
        <s-list
          style="padding-left: 1rem"
          link
          :to="child.to"
          :icon="{ icon: child.icon?.icon, color: child.icon?.color }"
          :hover-color="child.hoverColor"
          ><template #title>s-appbar</template></s-list
        >
      </template>
    </template>
  </div>
</template>
<script setup lang="ts">
import type { TSList } from "@/types/components";
import { mdiMenuDown, mdiMenuUp } from "@mdi/js";
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
  children?: TSList[];
}>();

const isHoverList = ref(false);
const isShowChildren = ref(false);
const isShowDownIcon = ref(true);
const isDownIconDown = ref(true);

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

const sListDownIcon = computed(() => {
  if (isDownIconDown.value) {
    return mdiMenuUp;
  } else {
    return mdiMenuDown;
  }
});

const downIconAnimeName = computed(() =>
  isDownIconDown.value ? "rotate180" : "rotate-180"
);

function setDownIcon() {
  isShowChildren.value = !isShowChildren.value;
  isShowDownIcon.value = false;
  isDownIconDown.value = !isDownIconDown.value;
  setTimeout(() => {
    isShowDownIcon.value = true;
  }, 300);
}

function onClickSList(e: Event) {
  if (props.children?.length) {
    e.stopPropagation();
    setDownIcon();
  }
  if (props.to) {
    router.push(props.to);
  }
}
</script>
<style lang="scss">
@import "@/assets/stylesheets/components/s-list";
</style>
