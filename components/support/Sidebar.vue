<template>
  <div class="support-sidebar d-flex">
    <div
      id="support-sidebar-side"
      class="support-sidebar-side d-flex flex-column"
    >
      <template v-for="(item, i) in sideItems" :key="item.id">
        <!-- 제목 버튼 -->
        <v-btn
          class="sidebar-btn d-flex justify-start"
          flat
          :style="{
            padding: '0.75rem',
            fontSize: '0.875rem',
            minHeight: '2.5rem',
            fontWeight: i === modelValue ? 'bold' : '400',
            color: i === modelValue ? Util.getColor(stores, 'PRIMARY') : '',
            backgroundColor:
              i === modelValue ? Util.getColor(stores, 'TINTED') : '',
            letterSpacing: '0.5px',
            '--color-tinted': Util.getColor(stores, 'TINTED'),
            '--color-primary': Util.getColor(stores, 'PRIMARY'),
          }"
          @mouseenter="isHover = true"
          @mouseleave="isHover = false"
          @click="() => onClickSideItem(i)"
          v-html="Util.removePTag(item.support_title)"
        >
        </v-btn>
        <template v-if="i === modelValue">
          <!-- 부제목 버튼 -->
          <v-btn
            class="sidebar-btn d-flex justify-start"
            v-for="(subItem, j) in item.sub_contents"
            flat
            :style="{
              width: '16.875rem',
              minHeight: '2.5rem',
              padding: '0.75rem 0.75rem 0.75rem 1.25rem',
              fontWeight: '400',
              textAlign: 'left',
              color: curChildIdx === j ? Util.getColor(stores, 'PRIMARY') : '',
              whiteSpace: 'normal',
              '--color-tinted': Util.getColor(stores, 'TINTED'),
              height: 'unset',
              letterSpacing: '0.5px',
            }"
            :key="subItem.id"
            @click="curChildIdx = j"
            v-html="Util.removePTag(subItem.support_title)"
          >
          </v-btn>
        </template>
      </template>
    </div>
    <div class="common-sidebar-contents pa-12">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as Util from "@/assets/javascripts/ipedit_util";
import useThemeStore from "@/store/useThemeStore";
import type { SupportCardItem } from "@/types/draft";
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: number;
  curChildIdx: number;
  sideItems: SupportCardItem[];
}>();
const tabIndex = ref(0);
const isHover = ref(false);
const themeStore = useThemeStore();

const stores = {
  ts: themeStore,
};

const emit = defineEmits(["update:modelValue", "update:curChildIdx"]);
const curChildIdx = ref(props.curChildIdx);

function onClickSideItem(index: number) {
  tabIndex.value = index;
  curChildIdx.value = 0;
}

watch(tabIndex, (newValue) => {
  emit("update:modelValue", newValue);
});
watch(curChildIdx, (newValue) => {
  emit("update:curChildIdx", newValue);
});
watch(props, (newValue) => {
  tabIndex.value = newValue.modelValue;
  curChildIdx.value = newValue.curChildIdx;
});
</script>

<style lang="scss" scoped>
.support-sidebar {
  width: calc(100% - 2.375rem);
  height: 100%;
  background-color: white;
  border: 0.0625rem solid #dfdfdf;
  border-radius: 0 0.5rem 0.5rem 0.5rem;
  .support-sidebar-side {
    width: 17.5rem;
    border-right: 0.0625rem solid #dfdfdf;
    padding: 1.5rem;
    padding-right: 1.5rem;
    overflow: overlay;
    &::-webkit-scrollbar {
      width: 0px;
    }
    &:hover::-webkit-scrollbar {
      width: 6px;
    }
  }
  .common-sidebar-contents {
    width: 100%;
    overflow: overlay;
  }
}
.sidebar-btn {
  &:hover {
    background-color: var(--color-tinted);
    color: var(--color-primary);
    .icon {
      color: var(--color-tinted);
    }
  }
}
</style>
