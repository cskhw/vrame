<template>
  <div
    class="common-sidebar d-flex"
    :style="[
      themeStore.darkmodeStyle,
      {
        border: themeStore.darkmodeBorder,
        borderRadius:
          route.path === '/draft/workspace' ? '' : '0 0.5rem 0.5rem 0.5rem',
      },
    ]"
  >
    <div
      class="common-sidebar-btns d-flex flex-column"
      :style="[
        {
          borderRight: themeStore.darkmodeBorder,
        },
        themeStore.darkmodeStyle,
      ]"
    >
      <template v-for="(side, index) in sideItems" :key="side.name">
        <v-btn
          class="d-flex justify-start align-start sidebar-btn py-2"
          flat
          :style="{
            whiteSpace: 'normal',
            wordBreak: 'keep-all',
            minHeight: '2.5rem',
            height: 'max-content',
            fontSize: '0.875rem',
            fontWeight: '400',
            textAlign: 'start',
            color:
              index === appStore.settingSidemenuIndex
                ? Util.getColor(stores, 'PRIMARY')
                : '',
            backgroundColor:
              index === appStore.settingSidemenuIndex
                ? Util.getColor(stores, 'TINTED')
                : themeStore.darkmodeBackgroundColor,
            '--color': rgbToRgba(Util.getColor(stores, 'MAIN'), '1'),
            '--color-hover': rgbToRgba(Util.getColor(stores, 'MAIN'), '0.2'),
          }"
          @mouseenter="isHoverIndices[index] = true"
          @mouseleave="isHoverIndices[index] = false"
          @click="changeSideitem(index)"
        >
          <div>
            <v-icon
              v-if="side.icon"
              class="icon mr-2"
              :icon="side.icon"
              :color="
                index === appStore.settingSidemenuIndex || isHoverIndices[index]
                  ? Util.getColor(stores, 'PRIMARY')
                  : '#7C7F90'
              "
              :style="{ width: '1.5rem', height: '1.5rem' }"
            />
          </div>
          <div style="margin-top: 0.0625rem">
            {{ side.title }}
          </div>
        </v-btn>
      </template>
    </div>
    <div
      class="common-sidebar-content pa-6"
      :style="[
        { width: '100%', height: 'max-content' },
        themeStore.darkmodeStyle,
      ]"
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
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import {
  mdiAlert,
  mdiArrowSplitVertical,
  mdiAutorenew,
  mdiCardSearch,
  mdiCloudDownload,
  mdiDockLeft,
  mdiFileMultipleOutline,
  mdiThemeLightDark,
  mdiFormatLineSpacing,
  mdiFormatBold,
  mdiFormatIndentIncrease,
  mdiFormatTextVariantOutline,
  mdiFormTextbox,
  mdiImageAutoAdjust,
  mdiImageText,
  mdiLightbulb,
  mdiMarker,
  mdiNfcSearchVariant,
  mdiNumeric,
  mdiPaletteSwatch,
  mdiPuzzle,
  mdiSetCenter,
  mdiShape,
  mdiTextBoxCheck,
  mdiTextLong,
  mdiTooltipCheckOutline,
  mdiViewComfy,
  mdiViewDay,
  mdiViewSplitVertical,
  mdiViewWeek,
  mdiWeb,
  mdiFormatListNumbered,
} from "@mdi/js";
import type { AxiosError } from "axios";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const appStore = useAppStore();
const userStore = useUserStore();
const modalStore = useModalStore();
const i18nStore = useI18NStore();
const themeStore = useThemeStore();

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
  "SETTING/GENERAL",
  "SETTING/EDITOR",
  "SETTING/DOWNLOAD",
  "SETTING/DRAFT",
  "SETTING/TRANSLATE",
]);

// 사이드메뉴별 아이콘 매칭
const sidebarIcons = ref({
  "SETTING/GENERAL/UI_LANGUAGE": mdiWeb,
  "SETTING/GENERAL/THEME": mdiPaletteSwatch,
  "SETTING/GENERAL/SAVE_LOCATION": mdiCloudDownload,
  "SETTING/GENERAL/AUTOSAVE_INTERVAL": mdiAutorenew,
  "SETTING/GENERAL/DASHBOARD_TYPE": mdiViewComfy,
  "SETTING/GENERAL/ALERT_DURATION": mdiAlert,
  "SETTING/GENERAL/SHOW_TIP": mdiLightbulb,
  "SETTING/EDITOR/DARK_MODE": mdiThemeLightDark,
  "SETTING/EDITOR/LINE_HEIGHT": mdiFormatLineSpacing,
  "SETTING/EDITOR/AUTOCOMPLETE_WEIGHT": mdiFormatBold,
  "SETTING/EDITOR/AUTOCOMPLETE_FORMAT": mdiImageAutoAdjust,
  "SETTING/EDITOR/AUTOCOMPLETE_COLOR": mdiMarker,
  "SETTING/EDITOR/ANTECEDENT": mdiFormTextbox,
  "SETTING/EDITOR/ANTECEDENT_ERROR_COLOR": mdiMarker,
  "SETTING/EDITOR/AUTO_INDENT": mdiFormatIndentIncrease,
  "SETTING/DOWNLOAD/AUTOCOMPLETE_HIGHLIGHT": mdiFormatTextVariantOutline,
  "SETTING/DOWNLOAD/ABSTRACT_GENERATION": mdiTextBoxCheck,
  "SETTING/DOWNLOAD/SOLUTION_GENERATION": mdiPuzzle,
  "SETTING/DOWNLOAD/ELEMENTS_LIST": mdiImageText,
  "SETTING/DOWNLOAD/CLAIM_SHOW_NUMBER": mdiNumeric,
  "SETTING/DRAFT/DEFAULT_FORMAT": mdiShape,
  "SETTING/DRAFT/WORK_TYPE": mdiFileMultipleOutline,
  "SETTING/DRAFT/WORKSPACE_TYPE": mdiViewSplitVertical,
  "SETTING/DRAFT/APPLICATION_SPLIT_LAYOUT": mdiViewWeek,
  "SETTING/DRAFT/APPLICATION_SPLIT_BASIC_LAYOUT": mdiTextLong,
  "SETTING/DRAFT/APPLICATION_MERGED_LAYOUT": mdiViewDay,
  "SETTING/DRAFT/BASIC_SHOW_NUMBER": mdiNumeric,
  "SETTING/DRAFT/CLAIM_SHOW_NUMBER": mdiNumeric,
  "SETTING/DRAFT/CLAIM_WIZARD_POSITON": mdiDockLeft,
  "SETTING/DRAFT/CLAIM_WIZARD_WIDTH": mdiArrowSplitVertical,
  "SETTING/DRAFT/CLAIM_CHECK_ANTECEDENT_ERROR": mdiTooltipCheckOutline,
  "SETTING/DRAFT/DESCRIPTION_CHECK_ANTECEDENT_ERROR": mdiTooltipCheckOutline,
  "SETTING/DRAFT/SIMILARITY": mdiSetCenter,
  "SETTING/DRAFT/SEARCH_RESULT_COUNT": mdiNfcSearchVariant,
  "SETTING/DRAFT/INITIAL_CLAIM_COUNT": mdiFormatListNumbered,
  "SETTING/TRANSLATE/DEFAULT_FORMAT": mdiShape,
  "SETTING/TRANSLATE/SHOW_ELEMET_TRANSLATION": mdiCardSearch, // TODO: 아이콘 지정 필요
});

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

// 언어 변경 감지를 위한 현재 언어 저장 변수
const currentLang = ref("");
currentLang.value = userStore.getLang;

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
          icon: sidebarIcons.value[
            nodeReadChildrenResponse.data.objects[i].path
          ],
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

watch(userStore, () => {
  if (currentLang.value !== userStore.getLang) {
    getCodeNodes().then(() => {
      changeSideitem(0);
    });
    currentLang.value = userStore.getLang;
  }
});

watch(props, () => {
  getCodeNodes().then(() => {
    // console.log(sideItems.value);
    changeSideitem(appStore.settingSidemenuIndex);
  });
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
  width: 1280px;
  height: max-content;
  overflow: hidden;
  .common-sidebar-btns {
    padding: 1.5rem;
    padding-right: 1.5rem;
    min-width: 31rem;
    max-width: 31rem;
    height: 44.25rem; // 사이드바 아이템 개수 15개 대응
    white-space: normal;
    word-break: keep-all;
  }
  .common-sidebar-content {
    position: relative;
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
</style>
