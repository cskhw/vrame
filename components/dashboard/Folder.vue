<template>
  <div
    class="folder d-flex flex-column align-center justify-center"
    :style="{
      border:
        modelValue === index
          ? '0.0625rem solid ' + Util.getColor(stores, 'PRIMARY')
          : '0.0625rem solid #dfdfdf',
      backgroundColor:
        modelValue === index
          ? Util.getColor(stores, 'TINTED')
          : isHover
          ? '#dfdfdf'
          : 'white',
    }"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
    @click="setIndex"
  >
    <div
      class="folder-image"
      :style="{
        backgroundImage:
          modelValue === index
            ? `url(${folderOpenImgHref})`
            : `url(${folderImgHref})`,
      }"
    ></div>
    <div class="folder-title text-bold-14-black">
      {{ item?.client ? item?.client : "-" }}
    </div>
    <div class="folder-total-case text-400-12-gray">
      {{ item?.total }} {{ Util.getI18NTxt(stores, "I18N/UNIT/CASE") }}
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Util from "@/assets/javascripts/ipedit_util";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { computed, ref } from "vue";

// 전역 변수
const appStore = useAppStore();
const userStore = useUserStore();
const modalStore = useModalStore();
const i18nStore = useI18NStore();
const themeStore = useThemeStore();
const workspaceStore = useWorkspaceStore();

const stores = {
  as: appStore,
  us: userStore,
  ms: modalStore,
  is: i18nStore,
  ts: themeStore,
  ws: workspaceStore,
};

// 폴더 이미지 url
const folderImgHref = computed(() => {
  const color = Util.getColor(stores, "PRIMARY");
  let url = "folder.svg";
  if (color === "#1B1A1BFF") url = "folder-gray.svg";
  else if (color === "#112E51FF") url = "folder-navy.svg";
  else if (color === "#544538FF") url = "folder-maroon.svg";
  else if (color === "#E46651FF") url = "folder-orange.svg";
  else if (color === "#ED8FA5FF") url = "folder-pink.svg";
  else if (color === "#413A53FF") url = "folder-yellow.svg";
  return Util.getImgUrl(url);
});

// 폴더 열린 이미지 url
const folderOpenImgHref = computed(() => {
  const color = Util.getColor(stores, "PRIMARY");
  let url = "folder-open.svg";
  if (color === "#1B1A1BFF") url = "folder-open-gray.svg";
  else if (color === "#112E51FF") url = "folder-open-navy.svg";
  else if (color === "#544538FF") url = "folder-open-maroon.svg";
  else if (color === "#E46651FF") url = "folder-open-orange.svg";
  else if (color === "#ED8FA5FF") url = "folder-open-pink.svg";
  else if (color === "#413A53FF") url = "folder-open-yellow.svg";
  return Util.getImgUrl(url);
});

const props = defineProps<{
  item: {
    client?: string;
    total?: number;
  };
  index: number;
  modelValue: number;
}>();
const emit = defineEmits(["update:modelValue"]);

const isHover = ref<boolean>(false);
const setIndex = () => {
  if (props.modelValue === props.index) {
    emit("update:modelValue", -1);
  } else {
    emit("update:modelValue", props.index);
  }
};
</script>

<style lang="scss" scoped>
.folder {
  height: 14rem;
  border-radius: 0.5rem;
  cursor: pointer;
  .folder-image {
    width: 7.5rem;
    height: 7.5rem;
  }
}
</style>
