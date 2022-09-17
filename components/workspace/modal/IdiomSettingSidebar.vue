<template>
  <div class="common-sidebar d-flex">
    <div
      v-if="modelValue === 0"
      class="common-sidber-wrapper d-flex flex-column"
      :style="[
        themeStore.darkmodeStyle,
        { borderRight: themeStore.darkmodeBorder },
      ]"
    >
      <template v-for="(side, index) in sideItems" :key="side.name">
        <v-btn
          class="d-flex justify-start sidebar-btn"
          flat
          :style="{
            height: 'max-content',
            whiteSpace: 'normal !important',
            wordBreak: 'break-all',
            minHeight: '2.5rem',
            fontSize: '0.875rem',
            fontWeight: '400',
            color:
              index === appStore.settingSidemenuIndex
                ? rgbToRgba(Util.getColor(stores, 'PRIMARY'), '1')
                : '',
            backgroundColor:
              index === appStore.settingSidemenuIndex
                ? Util.getColor(stores, 'TINTED')
                : themeStore.darkmodeBackgroundColor,
            whiteSpace: 'nowrap',
            '--color': rgbToRgba(Util.getColor(stores, 'PRIMARY'), '1'),
            '--color-hover': rgbToRgba(Util.getColor(stores, 'PRIMARY'), '0.2'),
          }"
          @mouseenter="isHoverIndices[index] = true"
          @mouseleave="isHoverIndices[index] = false"
          @click="changeSideitem(index)"
        >
          <v-icon
            v-if="side.icon"
            class="icon mr-2"
            :icon="side.icon"
            :color="
              index === appStore.settingSidemenuIndex || isHoverIndices[index]
                ? '#5c6bc0'
                : '#7C7F90'
            "
          ></v-icon
          >{{ side.title }}
        </v-btn>
      </template>
    </div>
    <div
      class="common-sidebar-content pa-6 pr-0"
      :style="themeStore.darkmodeStyle"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import api from "@/api/api";
import { extractError } from "@/api/error";
import * as Util from "@/assets/javascripts/ipedit_util";
import { rgbToRgba } from "@/assets/javascripts/utils/css";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useAuthStore from "@/store/useAuthStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import type { AxiosError } from "axios";
import { onMounted, ref, watch } from "vue";
import * as ElementHandler from "@/assets/javascripts/ipedit_element_handler";

const appStore = useAppStore();
const userStore = useUserStore();
const modalStore = useModalStore();
const i18nStore = useI18NStore();
const themeStore = useThemeStore();
const authStore = useAuthStore();

const stores = {
  as: appStore,
  us: userStore,
  ms: modalStore,
  is: i18nStore,
  ts: themeStore,
};

const isHoverIndices = ref<boolean[]>([]);

const props = defineProps<{
  modelValue: number;
}>();

// console.log(props.modelValue);

// 데이터 조회를 위한 TAB 항목 코드들
const tabMenus = ref([
  "DR_IDIOM/TEMPLATE",
  "DR_IDIOM/AUTOCOMPLETE",
  "DR_IDIOM/CUSTOM",
]);

type settingType = {
  title: string;
  value: string;
  desc: string;
  icon: string;
  isDefault: boolean;
};

// 사이드메뉴로 뿌려질 배열
// 얘는 동적으로 생성되는 변수라 여기에 바로 computed를 붙일 수가 없네...
const sideItems = ref<settingType[]>([
  {
    title: "",
    value: "",
    desc: "",
    icon: "",
    isDefault: false,
  },
]);

function changeSideitem(index: number) {
  appStore.settingSidemenuIndex = index;
  appStore.settingTitle = sideItems.value[index].title;
  appStore.settingDesc = sideItems.value[index].desc;
  appStore.settingCodeNode = sideItems.value[index].value;
  appStore.settingRefresh = true;
}

// 사이드메뉴로 뿌려질 코드 가져오기
async function getCodeNodes() {
  try {
    const nodeReadChildrenResponse = await api.management.nodeReadChildren({
      parent_path: tabMenus.value[props.modelValue],
    });
    // console.log(nodeReadChildrenResponse);
    sideItems.value = [];
    for (let i = 0; i < nodeReadChildrenResponse.data.objects.length; i++) {
      // 폰트 스타일, 크기, 라인 HEIGHT는 옵션값으로 관리하지 않음
      if (
        !(
          nodeReadChildrenResponse.data.objects[i].path ==
            "SETTING/EDITOR/FONT_STYLE" ||
          nodeReadChildrenResponse.data.objects[i].path ==
            "SETTING/EDITOR/FONT_SIZE"
        )
      )
        sideItems.value.push({
          title: Util.getI18NTxt(
            stores,
            nodeReadChildrenResponse.data.objects[i].path,
            "setting_titles"
          ),
          value: nodeReadChildrenResponse.data.objects[i].path,
          icon: "", // 관용어구에서는 icon 사용 안함
          desc: Util.getI18NTxt(
            stores,
            nodeReadChildrenResponse.data.objects[i].path,
            "setting_descs"
          ),
          isDefault: nodeReadChildrenResponse.data.objects[i].is_default,
        });
    }
  } catch (e: AxiosError | Error | any) {
    const error = extractError(e);
    console.log(e);
    Util.openAlertModal(stores, error.status);
  }
}

watch(props, () => {
  if (props.modelValue === 0) {
    getCodeNodes().then(() => {
      // console.log(sideItems.value);
      changeSideitem(appStore.settingSidemenuIndex);
    });
  }
});

onMounted(() => {
  getCodeNodes().then(() => {
    // console.log(sideItems.value);
    changeSideitem(appStore.settingSidemenuIndex);
  });
});
</script>

<style lang="scss" scoped>
.common-sidebar {
  width: 100%;
  height: 100%;
  .common-sidber-wrapper {
    padding: 1.5rem 0 1.5rem 1.5rem;
    width: 28.125rem;
    height: 100%; // 사이드바 아이템 개수 15개 대응
  }
}
.sidebar-btn {
  &:hover {
    background-color: var(--color-hover) !important;
    color: var(--color);
    .icon {
      color: var(--color);
    }
  }
}
.common-sidebar-content {
  width: 100%;
  height: max-content;
}
</style>
