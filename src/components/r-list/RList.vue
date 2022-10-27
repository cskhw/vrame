<template>
  <div class="r-list">
    <div
      class="r-list-body"
      :style="[_listStyle]"
      @mouseenter="isHoverList = true"
      @mouseleave="isHoverList = false"
      @click="onClickSList"
    >
      <!-- icon -->
      <div style="margin-right: 0.5rem">
        <slot name="icon">
          <r-icon v-if="icon" :icon="icon.icon" :color="listIconColor" />
        </slot>
      </div>
      <!-- title -->
      <div :style="_titleStyle">
        <slot name="title"><div v-html="title"></div></slot>
      </div>
      <Transition :name="downIconAnimeName">
        <r-icon
          v-if="children?.length && isShowDownIcon"
          class="r-list-downicon"
          :icon="sListDownIcon"
        />
      </Transition>
    </div>

    <template v-if="isShowChildren">
      <template v-for="child in children" :key="children">
        <slot name="child" :child="child">
          <r-list
            style="padding-left: 1rem"
            :link="child.link"
            :to="child.to"
            :icon="{ icon: child.icon?.icon, color: child.icon?.color }"
            :hover-color="child.hoverColor"
            :children="child.children"
            :title="child.title"
            :click="child.click"
            @click="onClickSList"
          />
        </slot>
      </template>
    </template>
  </div>
</template>
<script setup lang="ts">
import type { TSList } from "vrame";
import { mdiMenuDown, mdiMenuUp } from "@mdi/js";
import { computed, ref, type CSSProperties } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  listStyle?: CSSProperties;
  icon?: { icon: string; color: string };
  title?: string;
  hoverColor?: string;
  hoverBgColor?: string;
  link?: boolean;
  to?: string;
  children?: TSList[];
  click?: (...args: any[]) => any;
}>();

const router = useRouter();

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
    return mdiMenuDown;
  } else {
    return mdiMenuUp;
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
  }, 200);
}

function onClickSList(e: Event) {
  if (props.children?.length) {
    setDownIcon();
  }
  if (props.to) {
    router.push(props.to);
  }
  if (props.click) {
    props.click();
  }
}
</script>
<style lang="scss">
@import "@/styles/components/r-list.scss";
</style>
