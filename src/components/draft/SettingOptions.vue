<template>
  <div
    class="setting-options d-flex flex-column"
    :style="themeStore.darkmodeStyle"
  >
    <!-- 일부 설정 항목에 대해서는 초기화 버튼을 보여주지 않음(초기화가 의미가 없음) -->
    <!-- 언어 설정, 선행사 설정, 자동완성양식 설정, Draft 기본 유형 설정 -->
    <v-btn
      v-if="
        appStore.settingCodeNode !== 'SETTING/GENERAL/UI_LANGUAGE' &&
        appStore.settingCodeNode !== 'SETTING/EDITOR/ANTECEDENT' &&
        appStore.settingCodeNode !== 'SETTING/EDITOR/AUTOCOMPLETE_FORMAT' &&
        appStore.settingCodeNode !== 'SETTING/DRAFT/DEFAULT_FORMAT'
      "
      class="ps-lt"
      flat
      border="none"
      :style="{
        color: themeStore.workspaceButton,
        backgroundColor: themeStore.darkmodeBackgroundColor,
      }"
      @click="initializeSettingValue()"
      >{{ Util.getI18NTxt(stores, "I18N/BUTTON/RESET") }}</v-btn
    >
    <div
      class="text-bold-16-black mb-2"
      :style="themeStore.darkmodeStyle"
      v-html="appStore.settingTitle"
    />
    <div
      class="text-400-14-black mb-4"
      :style="themeStore.darkmodeStyle"
      v-html="appStore.settingDesc"
    />
    <!-- 특수 설정들: 색상 선택 -->
    <div
      v-if="
        appStore.settingCodeNode === 'SETTING/EDITOR/AUTOCOMPLETE_COLOR' ||
        appStore.settingCodeNode === 'SETTING/EDITOR/ANTECEDENT_ERROR_COLOR'
      "
    >
      <v-color-picker
        v-model="settingValue"
        hide-mode-switch
        :modes="['hexa']"
      />
    </div>
    <!-- 특수 설정들: 텍스트 입력 -->
    <div
      v-else-if="appStore.settingCodeNode === 'SETTING/EDITOR/ANTECEDENT'"
      style="width: 6.25rem"
    >
      <TextField
        id="setting-value"
        class="mb-5"
        style="width: 30rem"
        placeholder=""
        :outline-color="Util.getColor(stores, 'PRIMARY')"
        v-model="settingValue"
      />
    </div>
    <!-- 특수 설정들: 텍스트 입력 -->
    <div
      v-else-if="
        appStore.settingCodeNode === 'SETTING/DRAFT/CLAIM_WIZARD_WIDTH' ||
        appStore.settingCodeNode === 'SETTING/DRAFT/INITIAL_CLAIM_COUNT'
      "
      style="width: 6.25rem"
    >
      <TextField
        id="setting-value"
        class="mb-5"
        placeholder=""
        :outline-color="Util.getColor(stores, 'PRIMARY')"
        v-model="settingValue"
      />
    </div>
    <!-- 특수 설정들: 분할된 편집 화면 레이아웃 -->
    <div
      v-else-if="
        appStore.settingCodeNode === 'SETTING/DRAFT/APPLICATION_SPLIT_LAYOUT'
      "
    >
      <!-- 레이아웃 온오프 스위치-->
      <div class="d-flex align-center">
        <div
          class="d-flex"
          v-for="(area, index) in areaData"
          :key="area.id"
          style="width: 8.75rem; height: 2.5rem"
        >
          <Switch
            class="mr-5 mt-1"
            v-model="areaToggle[index]"
            :toggleColor="Util.getColor(stores, 'PRIMARY')"
            :body-color="rgbToRgba(Util.getColor(stores, 'PRIMARY'), '.4')"
            :key="index"
            @click="setupAreaShow(area.id)"
          />
          <div
            class="mr-3 mt-1 text-bold-12-black"
            v-if="true"
            :key="index"
            :style="{ color: themeStore.darkmodeColor }"
          >
            {{ setupAreaTitle(area.id) }}
          </div>
        </div>
      </div>
      <!-- 분할된 편집 화면 레이아웃 부분 -->
      <div class="areas d-flex">
        <template
          v-for="(area, index) in areaData.filter((area) => area.isShow)"
        >
          <Layouts
            class="area .handle"
            v-if="area.id === 'element' && area.isShow"
            v-model="areaDragged"
            :id="area.id"
            :key="index"
            :style="{ width: area.width + '%' }"
            style="cursor: move"
          />
          <Layouts
            class="area"
            v-if="area.id === 'basic' && area.isShow"
            v-model="areaDragged"
            :id="area.id"
            :key="index"
            :style="{
              width: area.width + '%',
            }"
            style="cursor: move"
          />
          <Layouts
            class="area"
            v-if="area.id === 'claim' && area.isShow"
            v-model="areaDragged"
            :id="area.id"
            :key="index"
            :style="{
              width: area.width + '%',
            }"
            style="cursor: move"
          />
          <Layouts
            class="area"
            v-if="area.id === 'description' && area.isShow"
            v-model="areaDragged"
            :id="area.id"
            :key="index"
            :style="{
              width: area.width + '%',
            }"
            style="cursor: move"
          />
          <Layouts
            class="area"
            v-if="area.id === 'drawing' && area.isShow"
            v-model="areaDragged"
            :id="area.id"
            :key="index"
            :style="{
              width: area.width + '%',
            }"
            style="cursor: move"
          />
          <div
            :id="'setting-splitter' + index"
            style="position: relative; cursor: pointer"
            class="d-flex align-center justify-center"
            v-if="
              index < areaData.filter((area) => area.isShow).length - 1 &&
              area.isShow
            "
            :style="{ width: splitterWidth + 'px' }"
            :key="index"
            @click="clickSplitter(index)"
            @dragstart="onDragStart(index, $event)"
            @dragend="onDragEnd(index, $event)"
            draggable="true"
          >
            <div
              style="
                width: 0.25rem;
                height: 1.5rem;
                border-left: 0.0625rem solid #9e9e9e;
                border-right: 0.0625rem solid #9e9e9e;
              "
            ></div>
          </div>
        </template>
      </div>
    </div>
    <!-- 특수 설정들: 기본 정보 영역 레이아웃 -->
    <template
      v-else-if="
        appStore.settingCodeNode ===
        'SETTING/DRAFT/APPLICATION_SPLIT_BASIC_LAYOUT'
      "
    >
      <!-- basic일 때 -->
      <div class="basics-body">
        <Draggable
          class="basics-draggable d-flex flex-column justify-space-between"
          v-model="basicCardData"
          item-key="title"
          handle=".handle"
          style="gap: 0.5rem; background-color: #fafafa; padding: 0.5rem"
        >
          <template #item="{ element, index }">
            <div
              class="basic-card"
              :item="element"
              :key="element.title"
              :style="{
                backgroundColor: basicCardBackgroundColor(index, element),
                border: basicCardBorder(element),
              }"
              @mouseenter="basicHoverIndices[index] = true"
              @mouseleave="basicHoverIndices[index] = false"
              @drag="onDragBasicCard"
              @dragend="onDragEndBasicCard"
            >
              <div class="d-flex align-start justify-space-between pa-2">
                <!-- 베이직 카드 -->
                <IconBtn
                  :icon="mdiReorderHorizontal"
                  color="#9E9E9E"
                  class="handle"
                  style="width: 1rem; height: 1rem"
                />
                <div
                  class="d-flex align-center pl-2"
                  style="width: 100%; text-align: start"
                >
                  <div
                    v-if="element.id === 'invention_title'"
                    class="text-400-11-gray"
                    style="width: 100%; text-align: start"
                    v-html="
                      Util.isPCT(stores)
                        ? Util.getI18NTxt(
                            stores,
                            'I18N/WORKSPACE/BASIC/INVENTION_TITLE_PCT'
                          )
                        : Util.getI18NTxt(
                            stores,
                            'I18N/WORKSPACE/BASIC/INVENTION_TITLE'
                          )
                    "
                  />
                  <div
                    v-if="element.id === 'cross_reference'"
                    class="text-400-11-gray"
                    v-html="
                      Util.getI18NTxt(
                        stores,
                        'I18N/WORKSPACE/BASIC/CROSS_REFERENCE'
                      )
                    "
                  />
                  <div
                    v-if="element.id === 'technical_field'"
                    class="text-400-11-gray"
                    v-html="
                      Util.isPCT(stores)
                        ? Util.getI18NTxt(
                            stores,
                            'I18N/WORKSPACE/BASIC/TECHNICAL_FIELD_PCT'
                          )
                        : Util.getI18NTxt(
                            stores,
                            'I18N/WORKSPACE/BASIC/TECHNICAL_FIELD'
                          )
                    "
                  />
                  <div
                    v-if="element.id === 'background'"
                    class="text-400-11-gray"
                    v-html="
                      Util.isPCT(stores)
                        ? Util.getI18NTxt(
                            stores,
                            'I18N/WORKSPACE/BASIC/BACKGROUND_PCT'
                          )
                        : Util.getI18NTxt(
                            stores,
                            'I18N/WORKSPACE/BASIC/BACKGROUND'
                          )
                    "
                  />
                  <div
                    v-if="element.id === 'prior_art'"
                    class="text-400-11-gray"
                    v-html="
                      Util.getI18NTxt(stores, 'I18N/WORKSPACE/BASIC/PRIOR_ART')
                    "
                  />
                  <div
                    v-if="element.id === 'purpose'"
                    class="text-400-11-gray"
                    v-html="
                      Util.isPCT(stores)
                        ? Util.getI18NTxt(
                            stores,
                            'I18N/WORKSPACE/BASIC/PURPOSE_PCT'
                          )
                        : Util.getI18NTxt(
                            stores,
                            'I18N/WORKSPACE/BASIC/PURPOSE'
                          )
                    "
                  />
                  <div
                    v-if="element.id === 'advantages'"
                    class="text-400-11-gray"
                    v-html="
                      Util.isPCT(stores)
                        ? Util.getI18NTxt(
                            stores,
                            'I18N/WORKSPACE/BASIC/ADVANTAGE_PCT'
                          )
                        : Util.getI18NTxt(
                            stores,
                            'I18N/WORKSPACE/BASIC/ADVANTAGE'
                          )
                    "
                  />
                  <div
                    v-if="element.id === 'drawings_description'"
                    class="text-400-11-gray"
                    v-html="
                      Util.isPCT(stores)
                        ? Util.getI18NTxt(
                            stores,
                            'I18N/WORKSPACE/BASIC/DRAWINGS'
                          )
                        : Util.getI18NTxt(
                            stores,
                            'I18N/WORKSPACE/BASIC/DRAWINGS'
                          )
                    "
                  />
                  <div
                    v-if="element.id === 'summary'"
                    class="text-400-11-gray"
                    v-html="
                      Util.getI18NTxt(stores, 'I18N/WORKSPACE/BASIC/SUMMARY')
                    "
                  />
                  <div
                    v-if="element.id === 'industrial_applicability'"
                    class="text-400-11-gray"
                    v-html="
                      Util.getI18NTxt(
                        stores,
                        'I18N/WORKSPACE/BASIC/INDUSTRIAL_APPLICABILITY'
                      )
                    "
                  />
                  <div
                    v-if="element.id === 'sequencelist'"
                    class="text-400-11-gray"
                    v-html="
                      Util.getI18NTxt(
                        stores,
                        'I18N/WORKSPACE/BASIC/SEQUENCELIST'
                      )
                    "
                  />
                </div>
                <div
                  class="d-flex text-bold-11-gray2"
                  style="cursor: pointer; white-space: nowrap"
                  @click="fold(element)"
                >
                  {{
                    element.fold === false
                      ? Util.getI18NTxt(stores, "I18N/BUTTON/FOLD")
                      : Util.getI18NTxt(stores, "I18N/BUTTON/UNFOLD")
                  }}
                </div>
              </div>
              <div
                class="d-flex justify-center text-400-11-gray mb-1"
                v-if="!element.fold"
                v-html="getBasicCardDescriptionText(element.id)"
              ></div>
            </div>
          </template>
        </Draggable>
      </div>
    </template>
    <!-- 특수 설정들: 하나의 편집 화면 레이아웃 -->
    <div
      v-else-if="
        appStore.settingCodeNode === 'SETTING/DRAFT/APPLICATION_MERGED_LAYOUT'
      "
    >
      <!-- 레이아웃 온오프 스위치-->
      <div class="d-flex align-center">
        <div
          class="d-flex"
          v-for="(area, index) in areaData"
          :key="area.id"
          style="width: 8.75rem; height: 2.5rem"
        >
          <Switch
            class="mr-5 mt-1"
            v-model="areaToggle[index]"
            v-if="true"
            :toggleColor="Util.getColor(stores, 'PRIMARY')"
            :body-color="rgbToRgba(Util.getColor(stores, 'PRIMARY'), '.4')"
            :key="index"
            @click="setupAreaShow(area.id)"
          />
          <div
            class="mr-3 mt-1 text-bold-12-black"
            :style="{ color: themeStore.darkmodeColor }"
            v-if="true"
            :key="index"
          >
            {{ setupAreaTitle(area.id) }}
          </div>
        </div>
      </div>
      <!-- 분할된 편집 화면 레이아웃 부분 -->
      <div class="areas d-flex" style="background-color: #fafafa">
        <template
          v-for="(area, index) in areaData.filter((area) => area.isShow)"
        >
          <Layouts
            class="area"
            v-if="area.id === 'element' && area.isShow"
            v-model="areaDragged"
            :id="area.id"
            :key="index"
            :style="{ width: area.width + '%' }"
            style="cursor: move"
          />
          <Layouts
            class="area"
            v-if="area.id === 'structure' && area.isShow"
            v-model="areaDragged"
            :id="area.id"
            :key="index"
            :style="{
              width: area.width + '%',
            }"
            style="cursor: move"
          />
          <Layouts
            class="area"
            v-if="area.id === 'claim' && area.isShow"
            v-model="areaDragged"
            :id="area.id"
            :key="index"
            :style="{
              width: area.width + '%',
            }"
            style="cursor: move"
          />
          <Layouts
            class="area"
            v-if="area.id === 'description' && area.isShow"
            v-model="areaDragged"
            :id="area.id"
            :key="index"
            :style="{
              width: area.width + '%',
            }"
            style="cursor: move"
          />
          <Layouts
            class="area"
            v-if="area.id === 'drawing' && area.isShow"
            v-model="areaDragged"
            :id="area.id"
            :key="index"
            :style="{
              width: area.width + '%',
            }"
            style="cursor: move"
          />
          <div
            :id="'setting-splitter' + index"
            style="position: relative; cursor: pointer"
            class="d-flex align-center justify-center"
            v-if="
              index < areaData.filter((area) => area.isShow).length - 1 &&
              area.isShow
            "
            :style="{ width: splitterWidth + 'px' }"
            :key="index"
            @click="clickSplitter(index)"
            @dragstart="onDragStart(index, $event)"
            @dragend="onDragEnd(index, $event)"
            draggable="true"
          >
            <div
              style="
                width: 0.25rem;
                height: 1.5rem;
                border-left: 0.0625rem solid #9e9e9e;
                border-right: 0.0625rem solid #9e9e9e;
              "
            ></div>
          </div>
        </template>
      </div>
    </div>
    <div v-else>
      <template v-for="item in options" :key="item">
        <div class="d-flex align-center justify-start mt-4">
          <RadioBox
            class="mr-2"
            v-model="settingValue"
            :value="item.value"
            :color="themeStore.workspacePrimary"
            :label="item.title"
            :key="item.value"
          />
        </div>
        <div class="text-400-12-gray ml-7" v-html="item.desc"></div>
      </template>
    </div>
    <div class="mt-8">
      <v-btn
        color="#5c6bc0"
        text-color="white"
        style="color: white"
        flat
        :style="{
          fontWeight: '400',
          color: Util.getColor(stores, 'BUTTON_TEXT'),
          backgroundColor: Util.getColor(stores, 'BUTTON'),
        }"
        @click="updateSettingValue"
        >{{ Util.getI18NTxt(stores, "I18N/BUTTON/SAVE") }}</v-btn
      >
    </div>
    <IComponentSpinner ref="settingModalSpinner" />
  </div>
</template>

<script setup lang="ts">
import api from "@/api/api";
import { extractError } from "@/api/error";
import * as Util from "@/assets/javascripts/ipedit_util";
import { asyncDebounce } from "@/assets/javascripts/utils/asyncDebounce";
import RadioBox from "@/components/common/RadioBox.vue";
import TextField from "@/components/common/TextField.vue";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import type { AxiosError } from "axios";
import { onMounted, ref, watch, onBeforeUnmount } from "vue";
import Layouts from "@/components/draft/Layouts.vue";
import Switch from "@/components/common/Switch.vue";
import { rgbToRgba } from "@/assets/javascripts/utils/css";
import Draggable from "vuedraggable";
import { mdiReorderHorizontal } from "@mdi/js";
import IconBtn from "@/components/common/IconBtn.vue";
import { useRoute } from "vue-router";
import IComponentSpinner from "@/components/IComponentSpinner.vue";
import type { IIComponentSpinner } from "@/types/component";

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

// inWorkspace로 뭐 처리해야할게 있을 거 같은데 생각이 안나네...
const props = defineProps<{ modelValue: number; inWorkspace?: boolean }>();

type settingType = {
  title: string;
  value: string;
  desc: string;
  isDefault: boolean;
};

// 옵션으로 뿌려질 배열
const options = ref<settingType[]>([
  {
    title: "",
    value: "",
    desc: "",
    isDefault: false,
  },
]);

const settingValue = ref("");

// 코드 가져오기
const settingModalSpinner = ref<IIComponentSpinner>();
const getCodeDataSpinner = () =>
  settingModalSpinner.value?.setSpinner(getCodeData, "translucent")();
async function getCodeData() {
  try {
    options.value = [];

    let parentPath = appStore.settingCodeNode;
    let valueUnit = "";
    settingValue.value = "";

    // 특수 설정환경 셋팅
    if (parentPath === "") return;
    // 언어
    else if (parentPath === "SETTING/GENERAL/UI_LANGUAGE") {
      if (Util.getUILang(stores) === "UI_LANGUAGE/KO") {
        options.value = [
          {
            title: "한국어",
            desc: "",
            value: "UI_LANGUAGE/KO",
            isDefault: true,
          },
          {
            title: "English",
            desc: "",
            value: "UI_LANGUAGE/EN",
            isDefault: false,
          },
          {
            title: "日本語",
            desc: "",
            value: "UI_LANGUAGE/JA",
            isDefault: false,
          },
        ];
      } else if (Util.getUILang(stores) === "UI_LANGUAGE/EN") {
        options.value = [
          {
            title: "English",
            desc: "",
            value: "UI_LANGUAGE/EN",
            isDefault: true,
          },
          {
            title: "한국어",
            desc: "",
            value: "UI_LANGUAGE/KO",
            isDefault: false,
          },
          {
            title: "日本語",
            desc: "",
            value: "UI_LANGUAGE/JA",
            isDefault: false,
          },
        ];
      } else if (Util.getUILang(stores) === "UI_LANGUAGE/JA") {
        options.value = [
          {
            title: "日本語",
            desc: "",
            value: "UI_LANGUAGE/JA",
            isDefault: true,
          },
          {
            title: "English",
            desc: "",
            value: "UI_LANGUAGE/EN",
            isDefault: false,
          },
          {
            title: "한국어",
            desc: "",
            value: "UI_LANGUAGE/KO",
            isDefault: false,
          },
        ];
      }

      settingValue.value = Util.getUILang(stores);

      return;
    }
    // 테마
    else if (parentPath === "SETTING/GENERAL/THEME") {
      options.value = [
        {
          title:
            "<div style='width:6.25rem; background-color:#5C6BC0'>&nbsp;</div>",
          desc: "",
          value: "THEME/BLUE",
          isDefault: true,
        },
        {
          title:
            "<div style='width:6.25rem; background-color:#1B1A1B'>&nbsp;</div>",
          desc: "",
          value: "THEME/BLACK",
          isDefault: false,
        },
        {
          title:
            "<div style='width:6.25rem; background-color:#544538'>&nbsp;</div>",
          desc: "",
          value: "THEME/BROWN",
          isDefault: false,
        },
        {
          title:
            "<div style='width:6.25rem; background-color:#ED8FA5'>&nbsp;</div>",
          desc: "",
          value: "THEME/PINK",
          isDefault: false,
        },
        {
          title:
            "<div style='width:6.25rem; background-color:#112E51'>&nbsp;</div>",
          desc: "",
          value: "THEME/NAVY",
          isDefault: false,
        },
        // {
        //   title:
        //     "<div style='width:6.25rem; background-color:#E46651'>&nbsp;</div>",
        //   desc: "",
        //   value: "THEME/ORANGE",
        //   isDefault: false,
        // },
        // {
        //   title:
        //     "<div style='width:6.25rem; background-color:#413A53'>&nbsp;</div>",
        //   desc: "",
        //   value: "THEME/PURPLE",
        //   isDefault: false,
        // },
      ];

      settingValue.value = userStore.user.detail.theme_code_path;

      return;
    }
    // 자동저장 간격
    else if (parentPath === "SETTING/GENERAL/AUTOSAVE_INTERVAL") {
      valueUnit = " " + Util.getI18NTxt(stores, "I18N/UNIT/MINUTE");
    }
    // 알림창/경고창 지속시간
    else if (parentPath === "SETTING/GENERAL/ALERT_DURATION") {
      valueUnit = " " + Util.getI18NTxt(stores, "I18N/UNIT/SECOND");
    }
    // 기본 서비스 유형
    else if (parentPath === "SETTING/DRAFT/DEFAULT_FORMAT") {
      // 서버 시간 가져와서, 현재 사용기한이 남아 있는 format code 셋팅해줌
      console.log(appStore.serverTime);
      const currentTime = appStore.serverTime.substring(0, 19);
      // currentTime = "2022-05-31T13:20:59";

      userStore.user.statuses.forEach((item) => {
        if (currentTime <= item.expiration_time) {
          options.value.push({
            title: item.format_code_path.substring(7),
            desc: "",
            value: item.format_code_path,
            isDefault: true,
          });
        }
      });

      settingValue.value = Util.getSettingValue(
        stores,
        "SETTING/DRAFT/DEFAULT_FORMAT"
      );

      return;
    }
    // 분할된 편집화면 레이아웃
    else if (parentPath === "SETTING/DRAFT/APPLICATION_SPLIT_LAYOUT") {
      // 전체 영역 분할 데이터 셋팅
      areaData.value = JSON.parse(
        Util.getSettingValue(stores, "SETTING/DRAFT/APPLICATION_SPLIT_LAYOUT")
      );

      return;
    }
    // 기본영역 레이아웃
    else if (parentPath === "SETTING/DRAFT/APPLICATION_SPLIT_BASIC_LAYOUT") {
      basicCardData.value = JSON.parse(
        Util.getSettingValue(
          stores,
          "SETTING/DRAFT/APPLICATION_SPLIT_BASIC_LAYOUT"
        )
      );

      return;
    }
    // 통합화면 레이아웃
    else if (parentPath === "SETTING/DRAFT/APPLICATION_MERGED_LAYOUT") {
      // 전체 영역 분할 데이터 셋팅
      areaData.value = JSON.parse(
        Util.getSettingValue(stores, "SETTING/DRAFT/APPLICATION_MERGED_LAYOUT")
      );

      return;
    }

    const nodeReadChildrenResponse = await api.management.nodeReadChildren({
      parent_path: parentPath,
    });
    // console.log(nodeReadChildrenResponse.data.objects);
    nodeReadChildrenResponse.data.objects.forEach((item) => {
      let title = Util.getI18NTxt(stores, item.path, "setting_titles")
        ? Util.getI18NTxt(stores, item.path, "setting_titles")
        : item.path.slice(item.path.lastIndexOf("/") + 1) + valueUnit;
      const desc = Util.getI18NTxt(stores, item.path, "setting_descs");
      const value = item.path;
      const isDefault = item.is_default;
      if (!(parentPath === "SETTING/EDITOR/AUTOCOMPLETE_FORMAT"))
        if (isDefault) title = title + " (Default)";
      options.value.push({
        title: title,
        desc: desc,
        value: value,
        isDefault: item.is_default,
      });
    });

    // 사용자 설정 값으로 현재 값 설정
    if (
      parentPath === "SETTING/EDITOR/AUTOCOMPLETE_COLOR" ||
      parentPath === "SETTING/EDITOR/ANTECEDENT_ERROR_COLOR" ||
      parentPath === "SETTING/EDITOR/ANTECEDENT" ||
      parentPath === "SETTING/DRAFT/CLAIM_WIZARD_WIDTH" ||
      parentPath === "SETTING/DRAFT/INITIAL_CLAIM_COUNT"
    ) {
      // 특수 설정값들
      settingValue.value = userStore.settings[parentPath];
    } else {
      settingValue.value = parentPath + "/" + userStore.settings[parentPath];
    }
    console.log(options.value[0].title);
    console.log(settingValue.value);
  } catch (e: AxiosError | Error | any) {
    const error = extractError(e);
    console.log(e);
    Util.openAlertModal(stores, error.status);
  }
}

// 초기값 설정을 위한 기본 데이터 가져오기
async function getDefaultData() {
  try {
    let nodeReadChildrenResponse = null;

    // 레이아웃 설정인 경우
    if (
      appStore.settingCodeNode === "SETTING/DRAFT/APPLICATION_SPLIT_LAYOUT" ||
      appStore.settingCodeNode ===
        "SETTING/DRAFT/APPLICATION_SPLIT_BASIC_LAYOUT" ||
      appStore.settingCodeNode === "SETTING/DRAFT/APPLICATION_MERGED_LAYOUT"
    ) {
      nodeReadChildrenResponse = await api.management.nodeCombinationReadAll({
        row_condition: appStore.settingCodeNode,
        col_condition: "SETTING/TEMP",
        combination_type: "I18N_CONTENTS",
      });

      settingValue.value =
        nodeReadChildrenResponse.data.objects[0].combination_data;

      // 받아온 초기값으로, 화면 레이아웃 변경
      if (
        appStore.settingCodeNode ===
        "SETTING/DRAFT/APPLICATION_SPLIT_BASIC_LAYOUT"
      )
        basicCardData.value = JSON.parse(settingValue.value);
      else areaData.value = JSON.parse(settingValue.value);
    }
    // 그 외의 일반적인 경우
    else {
      nodeReadChildrenResponse = await api.management.nodeReadChildren({
        parent_path: appStore.settingCodeNode,
      });
      // console.log(nodeReadChildrenResponse.data.objects[0].path);
      settingValue.value = nodeReadChildrenResponse.data.objects[0].path.slice(
        nodeReadChildrenResponse.data.objects[0].path.lastIndexOf("/") + 1
      );
    }

    console.log(settingValue.value);
  } catch (e: AxiosError | Error | any) {
    const error = extractError(e);
    Util.openAlertModal(stores, error.status);
  }
}

function updateSettingValue() {
  if (
    !settingValue.value.trim() &&
    !(
      appStore.settingCodeNode === "SETTING/DRAFT/APPLICATION_SPLIT_LAYOUT" ||
      appStore.settingCodeNode ===
        "SETTING/DRAFT/APPLICATION_SPLIT_BASIC_LAYOUT" ||
      appStore.settingCodeNode === "SETTING/DRAFT/APPLICATION_MERGED_LAYOUT"
    )
  ) {
    Util.openAlertModal(
      stores,
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/DATA_ALERT")
    );
    return;
  }

  if (appStore.settingCodeNode === "SETTING/DRAFT/CLAIM_WIZARD_WIDTH") {
    // 일본어 전자인 경우에는 강제로 반자로 변환
    settingValue.value = Util.toJPHalfWidth(settingValue.value);

    let regExp = /^[0-9]+$/;

    if (!regExp.test(settingValue.value)) {
      Util.openAlertModal(
        stores,
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/ONLY_NUMBER_ALERT")
      );
      return;
    }

    if (
      parseInt(settingValue.value) < 20 ||
      parseInt(settingValue.value) > 40
    ) {
      Util.openAlertModal(
        stores,
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/RANGE_ALERT")
      );
      return;
    }
  }

  if (appStore.settingCodeNode === "SETTING/DRAFT/INITIAL_CLAIM_COUNT") {
    // 일본어 전자인 경우에는 강제로 반자로 변환
    settingValue.value = Util.toJPHalfWidth(settingValue.value);

    let regExp = /^[0-9]+$/;

    if (!regExp.test(settingValue.value)) {
      Util.openAlertModal(
        stores,
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/ONLY_NUMBER_ALERT")
      );
      return;
    }

    if (parseInt(settingValue.value) > 20) {
      Util.openAlertModal(
        stores,
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/RANGE_ALERT")
      );
      return;
    }
  }

  if (appStore.settingCodeNode === "SETTING/EDITOR/ANTECEDENT") {
    if (settingValue.value.split("+").length > 5) {
      Util.openAlertModal(
        stores,
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/COUNT_ALERT")
      );
      return;
    }
  }

  // console.log("updateSettingValue: ", settingValue.value);
  asyncUpdateSetting();
}

const asyncUpdateSetting = asyncDebounce(requestUpdateSetting);
async function requestUpdateSetting() {
  try {
    let updateSettingResponse = null;
    let settingData = "";

    if (appStore.settingCodeNode === "SETTING/GENERAL/UI_LANGUAGE") {
      updateSettingResponse = await api.preference.detailConfigure({
        ui_lang_code_path: settingValue.value,
      });
    } else if (appStore.settingCodeNode === "SETTING/GENERAL/THEME") {
      updateSettingResponse = await api.preference.detailConfigure({
        theme_code_path: settingValue.value,
      });
    } else {
      // DRAFT 기본 유형의 경우 코드값에 "/"가 포함되어 있어 따로 처리
      if (appStore.settingCodeNode === "SETTING/DRAFT/DEFAULT_FORMAT") {
        settingData = settingValue.value;
        // DRAFT 분할 화면/통합화면 레이아웃의 경우 따로 세팅값 처리
      } else if (
        appStore.settingCodeNode === "SETTING/DRAFT/APPLICATION_SPLIT_LAYOUT" ||
        appStore.settingCodeNode === "SETTING/DRAFT/APPLICATION_MERGED_LAYOUT"
      ) {
        settingData = JSON.stringify(areaData.value);
      } else if (
        appStore.settingCodeNode ===
        "SETTING/DRAFT/APPLICATION_SPLIT_BASIC_LAYOUT"
      ) {
        settingData = JSON.stringify(basicCardData.value);
      } else {
        settingData = settingValue.value.slice(
          settingValue.value.lastIndexOf("/") + 1
        );
      }

      updateSettingResponse = await api.preference.settingConfigure({
        setting_code_path: appStore.settingCodeNode,
        setting_data: settingData,
      });
    }

    // 케이스 상태 변경 성공. 성공 코드는 200밖에 없음. 나머지는 exception이어서 else 탈일 없음
    if (updateSettingResponse.status === 200) {
      // 사용자 스토어 초기화
      await userStore.init();

      if (appStore.settingCodeNode === "SETTING/GENERAL/UI_LANGUAGE") {
        // I18N 스토어 초기화
        await i18nStore.init();
      } else if (appStore.settingCodeNode === "SETTING/GENERAL/THEME") {
        // 테마 색상 바꾼 경우에는 테마 스토어 초기화
        await themeStore.init();
      } else if (
        appStore.settingCodeNode === "SETTING/GENERAL/AUTOSAVE_INTERVAL"
      ) {
        workspaceStore.setAutoSaveTimer(); // 함수 안에서 스토어 연동
      }

      // 여기서 로딩바 닫아주자

      Util.openInfoModal(
        stores,
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/UPDATE_SETTING"),
        true
      );
    } else {
      Util.openAlertModal(stores, updateSettingResponse.status);
    }
  } catch (e: AxiosError | Error | any) {
    const error = extractError(e);
    console.log(e);
    Util.openAlertModal(stores, error.status);
  }
}

function initializeSettingValue() {
  if (appStore.settingCodeNode === "SETTING/GENERAL/THEME")
    settingValue.value = "THEME/BLUE";

  // 여러개 중 하나가 default값 -> options에 default 여부가 들어 있음
  if (options.value.length > 1) {
    // console.log("여러개 중 하나가 default");
    for (let i = 0; i < options.value.length; i++) {
      if (options.value[i].isDefault === true) {
        settingValue.value = options.value[i].value;
        break;
      }
    }
    updateSettingValue();
  }
  // default로 정해진 값이 code node 테이블에 따로 있음
  else {
    // 초기값 가져와서 설정
    getDefaultData().then(() => {
      // console.log(settingValue.value);
      updateSettingValue();
    });
  }
}

/** 명세서 작성(분할 화면) 레이아웃 구현부 */
// 레이아웃 온오프 스위치
const areaData = ref<displayData[]>([]);
const basicCardData = ref<basicCard[]>([]);

const areaToggle = ref([true, true, true, true, true]);

type displayData = {
  id: string;
  width: number;
  minWidth: number;
  draggable: boolean;
  isShow: boolean;
  order: number;
  orgWidth: number;
};

type splitterData = {
  index: number;
  left: number;
  right: number;
  leftLimit: number;
  rightLimit: number;
};

type basicCard = {
  id: string;
  height: string;
  fold: boolean;
  show: boolean;
};

const route = useRoute();

const splitterWidth = ref(8);
const startClientX = ref(-1);
const startScreenX = ref(-1);
const filteredAreaData = ref<displayData[]>([]);
const splitterController = ref<splitterData[]>([]);
const movingSplitterIndex = ref(-1);
// 최소 영역 크기
const minAreaWidth = ref(280);

// 영역 이동이 일어났는지 여부
const areaDragged = ref(false);

function clickSplitter(index: number) {
  console.log("click splitter: ", index);
}

function setupAreaTitle(id: string) {
  if (id === "element") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/TITLE");
  } else if (id === "basic") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/TITLE");
  } else if (id === "claim") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/TITLE");
  } else if (id === "description") {
    // 드래프트 설정일 때 상세한 설명, 워크스페이스일 때 문서 타입에 따라 다름
    if (route.path.includes("setting"))
      return Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/DETAILED_DESCRIPTION/TITLE"
      );

    if (Util.isSplitLayout(stores))
      return Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/DETAILED_DESCRIPTION/TITLE"
      );
    else
      return Util.getI18NTxt(
        stores,
        workspaceStore.caseMasterData.work_type_code_path,
        "setting_titles"
      );
  } else if (id === "drawing") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/DRAWINGS/TITLE");
  } else if (id === "structure") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/STRUCTURE/TITLE");
  }
}

function getBasicCardDescriptionText(id: string) {
  if (id === "cross_reference" || id === "summary")
    return Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/NOT_DISPLAY").replace(
      "$DATA$",
      Util.getI18NTxt(
        stores,
        "SETTING/DRAFT/WORK_TYPE/PCT_APPLICATION",
        "setting_titles"
      ) + ", KIPO, and JPO"
    );
  else if (id === "prior_art")
    return Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/NOT_DISPLAY").replace(
      "$DATA$",
      Util.getI18NTxt(
        stores,
        "SETTING/DRAFT/WORK_TYPE/PCT_APPLICATION",
        "setting_titles"
      ) + ", USPTO"
    );
  else if (id === "industrial_applicability" || id === "sequencelist")
    return Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/ONLY_DISPLAY").replace(
      "$DATA$",
      Util.getI18NTxt(
        stores,
        "SETTING/DRAFT/WORK_TYPE/PCT_APPLICATION",
        "setting_titles"
      )
    );
  else if (id === "purpose" || id === "advantages")
    return Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/NOT_DISPLAY").replace(
      "$DATA$",
      "USPTO"
    );
  else return "&nbsp;";
}

function setupAreaShow(target: string) {
  let remainWidthSum = 0;
  areaData.value.forEach((item) => {
    if (item.id === target) item.isShow = !item.isShow;

    if (item.isShow) {
      item.width = item.orgWidth;
      remainWidthSum = remainWidthSum + item.width;
    } else item.width = 0;
  });

  areaData.value.forEach((item) => {
    if (item.isShow) {
      item.width = (item.width / remainWidthSum) * 100;
    }
  });

  // order 오름차순으로 정렬 --> 화면 새로고침됨(반응성)
  Util.sortObjectArray(areaData.value, "order", "number", "ASC");
}

function setupSplitterController(endWidth: number = window.innerWidth) {
  splitterController.value = [];
  filteredAreaData.value = areaData.value.filter((area) => area.isShow);

  // isShow가 true인 영역이 1개면 splitter가 없으므로 빠져나감
  if (filteredAreaData.value.length < 2) return;

  // 각 splitter의 왼쪽, 오른쪽 위치 설정
  for (let i = 0; i < filteredAreaData.value.length - 1; i++) {
    const spliterLeft = document
      .getElementById("setting-splitter" + i)
      ?.getBoundingClientRect().left as number;
    splitterController.value.push({
      index: i,
      left: spliterLeft,
      right: spliterLeft + splitterWidth.value,
      leftLimit: 0,
      rightLimit: 0,
    });
  }

  // 각 splitter가 이동할 수 있는 왼쪽 한계, 오른쪽 한계 설정
  for (let i = 0; i < splitterController.value.length; i++) {
    // 첫번째 스플리터 왼쪽 한계 설정
    if (i === 0) splitterController.value[i].leftLimit = 0;
    // 나머지 왼쪽 한계는 이전 스플리터의 오른쪽
    else
      splitterController.value[i].leftLimit =
        splitterController.value[i - 1].right;
    // 마지막 스플리터 오른쪽 한계 설정
    if (i === splitterController.value.length - 1)
      splitterController.value[i].rightLimit = endWidth;
    // 나머지 오른쪽 한계는 이전 스플리터의 왼쪽
    else
      splitterController.value[i].rightLimit =
        splitterController.value[i + 1].left;
  }
}
function onDragStart(_: any, e: DragEvent) {
  console.log("drag start client: ", e.clientX);
  console.log("drag start screen: ", e.screenX);
  startClientX.value = e.clientX;
  startScreenX.value = e.screenX;

  const target = e.target as HTMLElement;
  const parentElement = target.parentElement;
  if (parentElement) {
    // 세팅 박스의 오른쪽 끝을 구해서 인자로 전달
    const react = parentElement.getBoundingClientRect();
    const settingRight = react.right;
    if (settingRight) {
      setupSplitterController(settingRight);
      // 스플리터 id 가져와서 현재 스플리터 인덱스 초기화
      const splitterIdx = target.id.substring(target.id.length - 1);
      movingSplitterIndex.value = parseInt(splitterIdx);
    }
  } else Util.openAlertModal(stores, "setting not mounted error");
}

function onDragEnd(index: number, e: DragEvent) {
  console.log("drag end client: ", e.clientX);
  console.log("drag end screen: ", e.screenX);

  // 현재 커서 위치 셋팅
  let positionClientX = e.clientX;
  let positionScreenX = e.screenX;

  if (
    positionClientX - startClientX.value !==
    positionScreenX - startScreenX.value
  ) {
    positionClientX =
      startClientX.value + (positionScreenX - startScreenX.value);
    console.log("draft end client (calculated):", positionClientX);
  }

  if (
    positionClientX < splitterController.value[index].leftLimit ||
    positionClientX > splitterController.value[index].rightLimit
  ) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/OUT_OF_RANGE"),
      true
    );
    return;
  }

  let dragEndAreaIndex = movingSplitterIndex.value;

  // 오른쪽으로 이동했으니, 최종 위치 area의 index는 splitter index보다 +1
  if (positionClientX - startClientX.value > 0)
    dragEndAreaIndex = dragEndAreaIndex + 1;

  // 사이즈가 조절되어야 할 왼쪽 영역과 오른쪽 영역
  const leftArea = filteredAreaData.value[movingSplitterIndex.value];
  const rightArea = filteredAreaData.value[movingSplitterIndex.value + 1];

  const target = e.target as HTMLElement;
  // 현재 설정 박스 기준으로 비율을 계산해야 하기 때문에 설정 레이아웃의 부모 width를 구함
  const parentTarget = target.parentElement;

  if (parentTarget === undefined) {
    Util.openAlertModal(stores, "setting not mounted error");
    return;
  }

  const settingBoxWidth = parentTarget ? parentTarget.clientWidth : 700;
  const innerWidth = window.innerWidth;

  // 변경 비율 설정
  const changedRatio =
    ((positionClientX - startClientX.value) / settingBoxWidth) * 100;

  // 최소 사이즈보다 작아지는 카드가 있는 경우, 최소 사이즈로 설정해 줌
  // 우측이동인 경우
  if (
    changedRatio > 0 &&
    ((rightArea.width - changedRatio) * innerWidth) / 100 < minAreaWidth.value
  ) {
    const widthSum = leftArea.width + rightArea.width;
    rightArea.width = (minAreaWidth.value / innerWidth) * 100;
    leftArea.width = widthSum - rightArea.width;
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/MIN_AREA_WIDTH").replace(
        "$DATA$",
        minAreaWidth.value + ""
      ),
      true
    );

    return;
  } else if (
    changedRatio < 0 &&
    ((leftArea.width + changedRatio) * innerWidth) / 100 < minAreaWidth.value
  ) {
    const widthSum = leftArea.width + rightArea.width;
    leftArea.width = (minAreaWidth.value / innerWidth) * 100;
    rightArea.width = widthSum - leftArea.width;
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/MIN_AREA_WIDTH").replace(
        "$DATA$",
        minAreaWidth.value + ""
      ),
      true
    );

    return;
  }

  // 너비 변경
  leftArea.width = leftArea.width + changedRatio;
  rightArea.width = rightArea.width - changedRatio;

  // 변경 값으로 설정
  for (let i = 0; i < areaData.value.length; i++) {
    if (areaData.value[i].id === leftArea.id)
      areaData.value[i].width = leftArea.width;
    if (areaData.value[i].id === rightArea.id)
      areaData.value[i].width = rightArea.width;
  }
}

/**기본 정보 영역의 레이아웃 구현부 */
const basicHoverIndices = ref<boolean[]>([]);
const isBasicCardDrag = ref(false);

const basicCardBackgroundColor = (index: number, element: basicCard) => {
  // console.log("test", index);
  if (basicHoverIndices.value[index]) return rgbToRgba("#5c6bc0", ".1");
  else {
    if (element.fold) return "#fafafa";
    else return "#eeeeee";
  }
};

const basicCardBorder = (element: basicCard) => {
  if (!element.fold) return "0.0625rem solid #BDBDBD";
};

// 기본 영역 드래그 시작(html 기본 drag 이벤트에 할당, 배경색 컨트롤)
const onDragBasicCard = (e: MouseEvent) => {
  basicHoverIndices.value.length = 0;
  isBasicCardDrag.value = true;
  let target = e.target as HTMLElement;
  target.style.background = rgbToRgba("#5c6bc0", ".1");
};

// 기본 영역 드래그 끝(html 기본 drag 이벤트에 할당, 배경색 컨트롤)
const onDragEndBasicCard = (e: MouseEvent) => {
  isBasicCardDrag.value = false;
  let target = e.target as HTMLElement;
  target.style.background = "";
};

// 하나 접기/펴기
function fold(element: any) {
  element.fold = !element.fold;
}

watch(appStore, () => {
  if (appStore.settingRefresh) {
    appStore.settingRefresh = false;
    getCodeDataSpinner();
  }
});

watch(settingValue, () => {
  // updateSettingValue();
});

// 영역 드래그 앤 드랍 동작
watch(areaDragged, () => {
  // console.log(areaDragged.value);
  if (areaDragged.value) {
    setupSplitterController();

    // 에디터가 들어있는 영역에 들어가서 마우스 커서 위치가 날라가는 것 보정
    if (
      workspaceStore.areaDragEndClientX -
        workspaceStore.areaDragStartClientX !==
      workspaceStore.areaDragEndScreenX - workspaceStore.areaDragEndScreenX
    ) {
      workspaceStore.areaDragEndClientX =
        workspaceStore.areaDragStartClientX +
        (workspaceStore.areaDragEndScreenX -
          workspaceStore.areaDragStartScreenX);
    }

    console.log("drag start position: ", workspaceStore.areaDragStartClientX);
    console.log("drag end position: ", workspaceStore.areaDragEndClientX);

    // 화면에 표시된 영역 중, 이동 시작 영역의 인덱스와 종료 영역의 인덱스 구하기
    let dragStartAreaIndex = -1;
    let dragEndAreaIndex = -1;

    for (let i = 0; i < splitterController.value.length; i++) {
      if (
        workspaceStore.areaDragStartClientX >=
          splitterController.value[i].leftLimit &&
        workspaceStore.areaDragStartClientX <= splitterController.value[i].left
      )
        dragStartAreaIndex = i;
      if (
        workspaceStore.areaDragEndClientX >=
          splitterController.value[i].leftLimit &&
        workspaceStore.areaDragEndClientX <= splitterController.value[i].left
      )
        dragEndAreaIndex = i;
      if (
        workspaceStore.areaDragStartClientX >=
          splitterController.value[i].right &&
        workspaceStore.areaDragStartClientX <=
          splitterController.value[i].rightLimit
      )
        dragStartAreaIndex = i + 1;
      if (
        workspaceStore.areaDragEndClientX >=
          splitterController.value[i].right &&
        workspaceStore.areaDragEndClientX <=
          splitterController.value[i].rightLimit
      )
        dragEndAreaIndex = i + 1;
    }

    // 시작 영역이랑 종료 영역이랑 같으면 리턴
    if (dragStartAreaIndex === dragEndAreaIndex) {
      console.log("동일영역 이동");
      areaDragged.value = false;
      return;
    }

    if (dragStartAreaIndex === -1 || dragEndAreaIndex === -1) {
      console.log("영역 인덱스가 제대로 안잡힘");
      areaDragged.value = false;
      return;
    }

    // 드래그 시작 영역, 드래그 종료 영역
    const dragStartArea = JSON.parse(
      JSON.stringify(filteredAreaData.value[dragStartAreaIndex])
    );
    const dragEndArea = JSON.parse(
      JSON.stringify(filteredAreaData.value[dragEndAreaIndex])
    );

    // 오른쪽으로 이동
    if (dragEndAreaIndex > dragStartAreaIndex) {
      for (let i = 0; i < areaData.value.length; i++) {
        if (areaData.value[i].order < dragStartArea.order) continue;
        else if (areaData.value[i].order === dragStartArea.order)
          areaData.value[i].order = dragEndArea.order;
        else if (
          areaData.value[i].order > dragStartArea.order &&
          areaData.value[i].order <= dragEndArea.order
        )
          areaData.value[i].order = areaData.value[i].order - 1;
        else if (areaData.value[i].order > dragEndArea.order) continue;
      }
    }
    // 왼쪽으로 이동
    else {
      for (let i = 0; i < areaData.value.length; i++) {
        if (areaData.value[i].order > dragStartArea.order) continue;
        else if (areaData.value[i].order === dragStartArea.order)
          areaData.value[i].order = dragEndArea.order;
        else if (
          areaData.value[i].order < dragStartArea.order &&
          areaData.value[i].order >= dragEndArea.order
        )
          areaData.value[i].order = areaData.value[i].order + 1;
        else if (areaData.value[i].order < dragEndArea.order) continue;
      }
    }

    // order 오름차순으로 정렬 --> 화면 새로고침됨(반응성)
    Util.sortObjectArray(areaData.value, "order", "number", "ASC");
  }

  areaDragged.value = false;
});

onMounted(() => {
  getCodeDataSpinner()?.then(() => {
    // console.log(sideItems.value);
  });
});

onBeforeUnmount(() => {
  console.log("setting option unmount");
});
</script>

<style lang="scss" scoped>
@import "src/assets/stylesheets/draft/envsettings";

.setting-options {
  position: relative;
  width: 100%;
  min-height: 18.75rem;
  overflow: overlay;
  .basics-body {
    width: 100%;
    border-radius: 0.25rem;
    height: 31.25rem;
    overflow: overlay;
    .basics-draggable {
      width: 21.875rem;
      border: 0.0625rem solid #bdbdbd;
    }
  }
}

.ps-lt {
  position: absolute;
  top: 0;
  right: 0;
}

.areas {
  position: relative;
  flex: 1;
  padding: 1rem;
  width: 100%;
  height: 25rem;
  background-color: #fafafa;
  border: 0.0625rem solid #bdbdbd;
  border-radius: 0.25rem;
  .area {
    border: 0.0625rem solid #bdbdbd;
  }
}
</style>
