<template>
  <div class="idiom-setting-options d-flex flex-column">
    <!-- 관용어구 템플릿 셋팅 -->
    <div
      v-if="appStore.settingTabIndex === 0"
      class="d-flex flex-column mr-4"
      style="height: 40rem"
    >
      <div class="d-flex">
        <div
          class="text-bold-18-black mb-2"
          :style="{ color: themeStore.darkmodeColor }"
          v-html="appStore.settingTitle"
        ></div>
        <div
          class="d-flex align-center text-400-14-gray pl-6 ml-6"
          v-html="getBasicDiplayDescriptionText()"
        ></div>
      </div>
      <div
        class="text-400-14-black mb-4"
        :style="{ color: themeStore.darkmodeColor }"
        v-html="appStore.settingDesc"
      />
      <!-- 템플릿 셋팅(인용문구 제외) -->
      <div
        v-show="appStore.settingCodeNode !== 'DR_IDIOM/TEMPLATE/CLAIM_CITATION'"
      >
        <Editor
          id="idiom-editor"
          class="pr-2"
          :data="settingValue"
          :init="{
            ...workspaceStore.tinymceConfig,
            setup: editorSetup,
            callback: editorInitCallback,
          }"
          :style="{ height: '28rem', padding: '0.625rem' }"
        />
      </div>
      <!-- 청구항 인용문구 셋팅 -->
      <div
        v-show="appStore.settingCodeNode === 'DR_IDIOM/TEMPLATE/CLAIM_CITATION'"
      >
        <!-- 청구항 1개 인용 -->
        <div
          class="text-400-14-black"
          :style="{ color: themeStore.darkmodeColor }"
          v-html="
            Util.getI18NTxt(
              stores,
              'DR_IDIOM/TEMPLATE/CLAIM_CITATION/C1',
              'setting_titles'
            )
          "
        ></div>
        <div class="mb-4">
          <Editor
            inline
            id="c1-citation"
            :data="c1Citation"
            :init="{
              ...workspaceStore.tinymceInlineConfig,
              setup: editorSetup,
            }"
            :style="[
              inlineEditorStyle,
              {
                minWidth: '5rem',
                padding: '0.625rem 0.625rem 0.625rem 0.625rem',
              },
            ]"
          />
        </div>
        <!-- 청구항 2개 인용 -->
        <div
          class="text-400-14-black"
          :style="{ color: themeStore.darkmodeColor }"
          v-html="
            Util.getI18NTxt(
              stores,
              'DR_IDIOM/TEMPLATE/CLAIM_CITATION/C2',
              'setting_titles'
            )
          "
        ></div>
        <div class="mb-4">
          <Editor
            inline
            id="c2-citation"
            :data="c2Citation"
            :init="{
              ...workspaceStore.tinymceInlineConfig,
              setup: editorSetup,
            }"
            :style="[
              inlineEditorStyle,
              {
                minWidth: '5rem',
                padding: '0.625rem 0.625rem 0.625rem 0.625rem',
              },
            ]"
          />
        </div>
        <!-- 청구항 3개 연속 인용 -->
        <div
          class="text-400-14-black"
          :style="{ color: themeStore.darkmodeColor }"
          v-html="
            Util.getI18NTxt(
              stores,
              'DR_IDIOM/TEMPLATE/CLAIM_CITATION/C3_CONTINUOUS',
              'setting_titles'
            )
          "
        ></div>
        <div class="mb-4">
          <Editor
            inline
            id="c3c-citation"
            :data="c3CCitation"
            :init="{
              ...workspaceStore.tinymceInlineConfig,
              setup: editorSetup,
            }"
            :style="[
              inlineEditorStyle,
              {
                minWidth: '5rem',
                padding: '0.625rem 0.625rem 0.625rem 0.625rem',
              },
            ]"
          />
        </div>
        <!-- 청구항 3개 불연속 인용 -->
        <div
          class="text-400-14-black"
          :style="{ color: themeStore.darkmodeColor }"
          v-html="
            Util.getI18NTxt(
              stores,
              'DR_IDIOM/TEMPLATE/CLAIM_CITATION/C3_NONCONTINUOUS',
              'setting_titles'
            )
          "
        ></div>
        <div class="mb-4">
          <Editor
            inline
            id="c3nc-citation"
            :data="c3NCCitation"
            :init="{
              ...workspaceStore.tinymceInlineConfig,
              setup: editorSetup,
            }"
            :style="[
              inlineEditorStyle,
              {
                minWidth: '5rem',
                padding: '0.625rem 0.625rem 0.625rem 0.625rem',
              },
            ]"
          />
        </div>
      </div>

      <!-- 저장 버튼 -->
      <div class="mt-4">
        <v-btn
          flat
          :style="{
            fontWeight: '400',
            backgroundColor: Util.getColor(stores, 'BUTTON'),
            color: Util.getColor(stores, 'BUTTON_TEXT'),
          }"
          @click="updateSettingValue"
          >{{ Util.getI18NTxt(stores, "I18N/BUTTON/SAVE") }}</v-btn
        >
      </div>
    </div>
    <!-- 자동완성용 관용구 -->
    <div class="auto-save-idiom" v-if="appStore.settingTabIndex === 1">
      <div
        class="text-bold-18-black mb-2"
        :style="{ color: themeStore.darkmodeColor }"
        v-html="
          Util.getI18NTxt(stores, 'DR_IDIOM/AUTOCOMPLETE', 'setting_titles')
        "
      ></div>
      <div
        class="text-400-14-black mb-4"
        :style="{ color: themeStore.darkmodeColor }"
        v-html="
          Util.getI18NTxt(stores, 'DR_IDIOM/AUTOCOMPLETE', 'setting_descs')
        "
      ></div>
      <!-- <div class="text-400-12-gray pb-2">자동완성용 관용구 추가하기</div> -->
      <!-- 에디터 -->
      <div
        class="d-flex flex-column align-start mb-8"
        style="position: relative; width: 100%; padding-right: 1.5rem"
      >
        <div
          id="autosave-idiom-toolbar"
          style="position: absolute; top: -2.625rem"
        />
        <Editor
          class="mb-2"
          id="autosave-idiom"
          :init="{
            ...workspaceStore.tinymceInlineConfig,
            setup: handleAutocompleteEnter,
            fixed_toolbar_container: '#autosave-idiom-toolbar',
          }"
          :style="[
            inlineEditorStyle,
            {
              width: '100%',
              padding: '0.625rem',
              border: themeStore.isDarkmode
                ? '0.0625rem solid #414141'
                : '0.0625rem solid #dfdfdf',
            },
          ]"
          inline
        />
        <!-- 수정하기, 초기화 버튼 -->
        <div class="d-flex justify-start" style="width: 100%">
          <v-btn
            class="mr-2"
            :style="{
              backgroundColor: Util.getColor(stores, 'BUTTON'),
              color: Util.getColor(stores, 'BUTTON_TEXT'),
            }"
            style="width: 6.25rem; height: 2.5rem"
            flat
            @click="onClickIdiomAddBtn"
            >{{
              isAutocompleteIdiomModifyMode
                ? Util.getI18NTxt(stores, "I18N/BUTTON/SAVE")
                : Util.getI18NTxt(stores, "I18N/BUTTON/ADD")
            }}</v-btn
          >
          <v-btn
            flat
            border="none"
            :style="{
              width: 'max-content',
              height: '2.5rem',
              color: Util.getColor(stores, 'BUTTON'),
              fontWeight: '400',
              backgroundColor: stores.ts.isDarkmode ? '#1e1e1e' : '',
            }"
            @click="onClickIdiomResetBtn"
            >{{ Util.getI18NTxt(stores, "I18N/BUTTON/RESET") }}</v-btn
          >
        </div>
      </div>
      <!-- 검색바 -->
      <div
        class="mb-4"
        :style="{
          position: 'relative',
          width: '15rem',
          height: '2.5rem',
        }"
      >
        <v-icon
          color="grey"
          :style="{ position: 'absolute', left: '1rem', height: '2.5rem' }"
          :icon="mdiMagnify"
        />
        <input
          v-model="autoSaveIdiomQueryValue"
          class="autosave-idiom-searchbar"
          style="
            height: 2.5rem;
            padding-left: 2.625rem;
            border-bottom: 0.0625rem solid #e0e0e0;
          "
          type="text"
          :placeholder="Util.getI18NTxt(stores, 'I18N/BUTTON/SEARCH')"
        />
      </div>
      <div class="autosave-idiom-content">
        <template v-for="(item, index) in autoSaveIdioms" :key="item">
          <div
            v-if="item.idiom_contents.includes(autoSaveIdiomQueryValue)"
            class="autosave-idiom-card d-flex align-center"
            :style="{
              width: '100%',
              border: isSelectedIdiomCards[index]
                ? '0.0625rem solid #5C6BC0'
                : '',
              color: themeStore.darkmodeColor,
            }"
            @mouseenter="autocompleteItemHoverIndices[index] = true"
            @mouseleave="autocompleteItemHoverIndices[index] = false"
            @click="onClickIdiomCard(index)"
          >
            <div v-html="item.idiom_contents" />
            <v-icon
              v-if="autocompleteItemHoverIndices[index]"
              color="grey"
              :icon="mdiTrashCan"
              @click.stop="() => asyncIdiomDelete(item, index)"
            ></v-icon>
          </div>
        </template>
      </div>
    </div>
    <!-- 자주 사용하는 설명 -->
    <div v-if="appStore.settingTabIndex === 2" class="frequently-idiom-desc">
      <div
        class="text-bold-18-black mb-2"
        :style="{ color: themeStore.darkmodeColor }"
        v-html="Util.getI18NTxt(stores, 'DR_IDIOM/CUSTOM', 'setting_titles')"
      ></div>
      <div
        class="text-400-14-black mb-4"
        :style="{ color: themeStore.darkmodeColor }"
        v-html="Util.getI18NTxt(stores, 'DR_IDIOM/CUSTOM', 'setting_descs')"
      ></div>
      <div class="d-flex">
        <div class="frequently-idiom-editor-wrapper mb-2 mr-10">
          <!-- 제목 에디터 -->
          <div
            class="d-flex flex-column align-start mb-1"
            style="position: relative; width: 100%"
          >
            <div
              id="frequently-idiom-title-toolbar"
              style="position: absolute; top: -2.625rem"
            />
            <Editor
              id="frequently-idiom-title"
              :init="{
                ...workspaceStore.tinymceInlineConfig,
                fixed_toolbar_container: '#frequently-idiom-title-toolbar',
                placeholder: Util.getI18NTxt(
                  stores,
                  'DR_IDIOM/CUSTOM/TITLE',
                  'setting_titles'
                ),
              }"
              :style="[
                inlineEditorStyle,
                {
                  width: '100%',
                  padding: '0.625rem',
                  border: themeStore.isDarkmode
                    ? '0.0625rem solid #414141'
                    : '0.0625rem solid #dfdfdf',
                },
              ]"
              inline
            />
          </div>
          <!-- 내용 에디터 -->
          <div style="height: calc(100% - 7rem)">
            <Editor
              id="frequently-idiom-contents"
              :init="{
                ...workspaceStore.tinymceConfig,
                height: '100%',
                setup: editorSetup,
                callback: editorInitCallback,
              }"
              :style="[
                {
                  width: '25rem',
                  padding: '0.625rem',
                  marginBottom: '1rem',
                  flex: '1',
                },
              ]"
            />
          </div>
          <!-- 수정하기, 초기화 버튼 -->
          <div class="d-flex justify-start mt-2" style="width: 100%">
            <v-btn
              class="mr-2"
              :style="{
                backgroundColor: Util.getColor(stores, 'BUTTON'),
                color: Util.getColor(stores, 'BUTTON_TEXT'),
              }"
              style="color: white; width: 6.25rem; height: 2.5rem"
              flat
              @click="asyncFrequentlyIdiomAdd"
              >{{
                isFrequentlyIdiomModifyMode
                  ? Util.getI18NTxt(stores, "I18N/BUTTON/SAVE")
                  : Util.getI18NTxt(stores, "I18N/BUTTON/ADD")
              }}
            </v-btn>
            <v-btn
              flat
              border="none"
              :style="{
                width: 'max-content',
                height: '2.5rem',
                color: Util.getColor(stores, 'BUTTON'),
                fontWeight: '400',
                backgroundColor: stores.ts.isDarkmode ? '#1e1e1e' : '',
              }"
              @click="onClickFrequentlyIdiomResetBtn"
              >{{ Util.getI18NTxt(stores, "I18N/BUTTON/RESET") }}</v-btn
            >
          </div>
        </div>
        <div class="frequently-idiom-cards-wrapper">
          <!-- 검색바 -->
          <div
            class="mb-4"
            :style="{
              position: 'relative',
              width: '15rem',
              height: '2.5rem',
              borderBottom: '0.0625rem solid #e0e0e0',
            }"
          >
            <v-icon
              color="grey"
              :style="{ position: 'absolute', left: '1rem', height: '2.5rem' }"
              :icon="mdiMagnify"
            />
            <input
              v-model="frequentlyIdiomQueryValue"
              class="frequently-idiom-searchbar"
              style="height: 2.5rem"
              :style="{ paddingLeft: '2.625rem' }"
              type="text"
              :placeholder="Util.getI18NTxt(stores, 'I18N/BUTTON/SEARCH')"
            />
          </div>
          <div class="frequently-idiom-cards">
            <template v-for="(item, index) in frequentlyIdioms" :key="item.id">
              <div
                class="d-flex align-center mb-2"
                v-if="
                  item.idiom_title.includes(frequentlyIdiomQueryValue) ||
                  item.idiom_contents.includes(frequentlyIdiomQueryValue)
                "
                @mouseenter="frequentlyIdiomHoverIndices[index] = true"
                @mouseleave="frequentlyIdiomHoverIndices[index] = false"
              >
                <div
                  class="frequently-idiom-card mr-2"
                  :style="{
                    width: '100%',
                    border: isSelectedFrequentlyIdiomCards[index]
                      ? '0.0625rem solid #5C6BC0'
                      : '',
                    color: themeStore.darkmodeColor,
                  }"
                  @click="onClickFrequentlyIdiomCard(index)"
                >
                  <div class="frequently-idiom-card-header d-flex">
                    <div style="width: 100%" v-html="item.idiom_title" />
                    <IconBtn
                      v-if="frequentlyIdiomHoverIndices[index]"
                      :style="{ width: '2.5rem' }"
                      color="grey"
                      :icon="mdiTrashCan"
                      @click.stop="
                        () => asyncFrequentlyIdiomDelete(item, index)
                      "
                    ></IconBtn>
                  </div>
                  <br />
                  <div style="width: 100%" v-html="item.idiom_contents" />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from "@/api/api";
import { extractError } from "@/api/error";
import * as Util from "@/assets/javascripts/ipedit_util";
import {
  asyncDebounce,
  asyncDelay,
} from "@/assets/javascripts/utils/asyncDebounce";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import type { AxiosError } from "axios";
import { onMounted, ref, watch } from "vue";
import Editor from "@/components/workspace/Editor.vue";
import tinymce from "tinymce/tinymce";
import { inlineEditorStyle } from "@/styles/index";
import { mdiTrashCan, mdiMagnify } from "@mdi/js";
import * as ElementHandler from "@/assets/javascripts/ipedit_element_handler";
import type { IdiomData } from "@/types/case";
import IconBtn from "@/components/IconBtn.vue";

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
};

// inWorkspace로 뭐 처리해야할게 있을 거 같은데 생각이 안나네...
defineProps<{ modelValue: number; inWorkspace?: boolean }>();

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

// 특허문서를 위한 기본 관용어구 변수
const idiomID = ref(0);
const settingValue = ref("");
const c1Citation = ref("");
const c2Citation = ref("");
const c3CCitation = ref("");
const c3NCCitation = ref("");
const c1CitationID = ref(0);
const c2CitationID = ref(0);
const c3CCitationID = ref(0);
const c3NCCitationID = ref(0);

const DR_IDIOM_AUTOCOMPLETE = "DR_IDIOM/AUTOCOMPLETE";
const DR_IDIOM_CUSTOM = "DR_IDIOM/CUSTOM";

// 코드 가져오기
function setupIdiomData() {
  // 템플릿 관용어구이고, 인용문구가 아닌 경우
  if (
    appStore.settingTabIndex === 0 &&
    appStore.settingCodeNode != "DR_IDIOM/TEMPLATE/CLAIM_CITATION"
  ) {
    for (let i = 0; i < workspaceStore.idioms.length; i++) {
      if (
        workspaceStore.idioms[i].dr_idiom_code_path === appStore.settingCodeNode
      ) {
        idiomID.value = workspaceStore.idioms[i].id;
        settingValue.value = workspaceStore.idioms[i].idiom_contents;
        tinymce.get("idiom-editor").setContent(settingValue.value);
        break;
      }
    }
  }
  // 템플릿 관용어구이고, 인용문구인 경우
  else if (
    appStore.settingTabIndex === 0 &&
    appStore.settingCodeNode === "DR_IDIOM/TEMPLATE/CLAIM_CITATION"
  ) {
    for (let i = 0; i < workspaceStore.idioms.length; i++) {
      // 1개 인용
      if (
        workspaceStore.idioms[i].dr_idiom_code_path ===
        "DR_IDIOM/TEMPLATE/CLAIM_CITATION/C1"
      ) {
        c1CitationID.value = workspaceStore.idioms[i].id;
        c1Citation.value = workspaceStore.idioms[i].idiom_contents;
        tinymce.get("c1-citation").setContent(c1Citation.value);
      }

      // 2개 인용
      if (
        workspaceStore.idioms[i].dr_idiom_code_path ===
        "DR_IDIOM/TEMPLATE/CLAIM_CITATION/C2"
      ) {
        c2CitationID.value = workspaceStore.idioms[i].id;
        c2Citation.value = workspaceStore.idioms[i].idiom_contents;
        tinymce.get("c2-citation").setContent(c2Citation.value);
      }

      // 3개 연속 인용
      if (
        workspaceStore.idioms[i].dr_idiom_code_path ===
        "DR_IDIOM/TEMPLATE/CLAIM_CITATION/C3_CONTINUOUS"
      ) {
        c3CCitationID.value = workspaceStore.idioms[i].id;
        c3CCitation.value = workspaceStore.idioms[i].idiom_contents;
        tinymce.get("c3c-citation").setContent(c3CCitation.value);
      }

      // 3개 불연속 인용
      if (
        workspaceStore.idioms[i].dr_idiom_code_path ===
        "DR_IDIOM/TEMPLATE/CLAIM_CITATION/C3_NONCONTINUOUS"
      ) {
        c3NCCitationID.value = workspaceStore.idioms[i].id;
        c3NCCitation.value = workspaceStore.idioms[i].idiom_contents;
        tinymce.get("c3nc-citation").setContent(c3NCCitation.value);
      }
    }
  }
  // 자동완성용 관용어구 설정인 경우
  else if (appStore.settingTabIndex === 1) {
    // 자동완성용 관용구 데이터 복사함
    autoSaveIdioms.value = [];
    workspaceStore.idioms.forEach((idiom) => {
      if (idiom.dr_idiom_code_path === DR_IDIOM_AUTOCOMPLETE)
        autoSaveIdioms.value.push(idiom);
    });

    isAutocompleteIdiomModifyMode.value = false;
    selectedIdiomIdx.value = -1;

    autoSaveIdiomQueryValue.value = "";
  }
  // 자주 사용하는 설명 설정인 경우
  else if (appStore.settingTabIndex === 2) {
    // 자주 사용하는 설명 데이터 복사함
    frequentlyIdioms.value = [];
    workspaceStore.idioms.forEach((idiom) => {
      if (idiom.dr_idiom_code_path === DR_IDIOM_CUSTOM)
        frequentlyIdioms.value.push(idiom);
    });

    isFrequentlyIdiomModifyMode.value = false;
    selectedFrequentlyIdiomIdx.value = -1;
    frequentlyIdiomQueryValue.value = "";
  } else {
    console.log("settingTabIndex가 범위를 벗어남");
  }
}

function updateSettingValue() {
  // 청구항 인용문구인 경우 유효성 검사
  if (
    appStore.settingTabIndex === 0 &&
    appStore.settingCodeNode === "DR_IDIOM/TEMPLATE/CLAIM_CITATION"
  ) {
    // 1개 인용일 때
    if (
      tinymce.get("c1-citation").getContent({ format: "text" }).trim() === "" ||
      tinymce
        .get("c1-citation")
        .getContent({ format: "text" })
        .indexOf("[N1]") < 0
    ) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/DATA_ALERT"),
        true
      );
      tinymce.get("c1-citation").focus();
      return;
    }

    // 2개 인용일 때
    if (
      tinymce.get("c2-citation").getContent({ format: "text" }).trim() === "" ||
      tinymce
        .get("c2-citation")
        .getContent({ format: "text" })
        .indexOf("[N1]") < 0 ||
      tinymce
        .get("c2-citation")
        .getContent({ format: "text" })
        .indexOf("[N2]") < 0 ||
      tinymce
        .get("c2-citation")
        .getContent({ format: "text" })
        .indexOf("[N1]") >
        tinymce
          .get("c2-citation")
          .getContent({ format: "text" })
          .indexOf("[N2]")
    ) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/DATA_ALERT"),
        true
      );
      tinymce.get("c2-citation").focus();
      return;
    }

    // 3개 연속 인용일 때
    if (
      tinymce.get("c3c-citation").getContent({ format: "text" }).trim() ===
        "" ||
      tinymce
        .get("c3c-citation")
        .getContent({ format: "text" })
        .indexOf("[N1]") < 0 ||
      tinymce
        .get("c3c-citation")
        .getContent({ format: "text" })
        .indexOf("[N2]") < 0 ||
      tinymce
        .get("c3c-citation")
        .getContent({ format: "text" })
        .indexOf("[N1]") >
        tinymce
          .get("c3c-citation")
          .getContent({ format: "text" })
          .indexOf("[N2]")
    ) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/DATA_ALERT"),
        true
      );
      tinymce.get("c3c-citation").focus();
      return;
    }

    // 3개 불연속 인용일 때
    const tempArray = tinymce
      .get("c3nc-citation")
      .getContent({ format: "text" })
      .split("...");

    if (
      tinymce.get("c3nc-citation").getContent({ format: "text" }).trim() ===
        "" ||
      tempArray.length !== 3 ||
      tempArray[0]?.indexOf("[N1]") < 0 ||
      tempArray[1]?.indexOf("[N2]") < 0 ||
      tempArray[2]?.indexOf("[N3]") < 0
    ) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/DATA_ALERT"),
        true
      );
      tinymce.get("c3nc-citation").focus();
      return;
    }
  }

  asyncUpdateSetting();
}

const asyncUpdateSetting = asyncDebounce(requestUpdateSetting);
async function requestUpdateSetting() {
  try {
    // console.log(options.value);
    // console.log(settingValue.value);

    // 템플릿 & 인용문구 아닌 경우
    if (
      appStore.settingTabIndex === 0 &&
      appStore.settingCodeNode !== "DR_IDIOM/TEMPLATE/CLAIM_CITATION"
    ) {
      const updateSettingResponse = await api.draft.draftIdiomsUpdate({
        id: idiomID.value,
        idiom_title: null,
        idiom_contents: tinymce.get("idiom-editor").getContent(),
      });

      console.log(tinymce.get("idiom-editor").getContent());

      // 업데이트 성공. 성공 코드는 201밖에 없음. 나머지는 exception이어서 else 탈일 없음
      if (updateSettingResponse.status === 201) {
        Util.openInfoModal(
          stores,
          Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/UPDATE_IDIOMS"),
          true
        );
      } else {
        Util.openAlertModal(stores, updateSettingResponse.status);
      }
    }
    // 템플릿 & 인용문구인 경우
    else if (
      appStore.settingTabIndex === 0 &&
      appStore.settingCodeNode === "DR_IDIOM/TEMPLATE/CLAIM_CITATION"
    ) {
      const updateSettingResponse1 = await api.draft.draftIdiomsUpdate({
        id: c1CitationID.value,
        idiom_title: null,
        idiom_contents: tinymce.get("c1-citation").getContent(),
      });
      const updateSettingResponse2 = await api.draft.draftIdiomsUpdate({
        id: c2CitationID.value,
        idiom_title: null,
        idiom_contents: tinymce.get("c2-citation").getContent(),
      });
      const updateSettingResponse3c = await api.draft.draftIdiomsUpdate({
        id: c3CCitationID.value,
        idiom_title: null,
        idiom_contents: tinymce.get("c3c-citation").getContent(),
      });
      const updateSettingResponse3nc = await api.draft.draftIdiomsUpdate({
        id: c3NCCitationID.value,
        idiom_title: null,
        idiom_contents: tinymce.get("c3nc-citation").getContent(),
      });

      if (
        updateSettingResponse1.status === 201 &&
        updateSettingResponse2.status === 201 &&
        updateSettingResponse3c.status === 201 &&
        updateSettingResponse3nc.status === 201
      ) {
        Util.openInfoModal(
          stores,
          Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/UPDATE_IDIOMS"),
          true
        );
      } else {
        Util.openAlertModal(stores, "ERROR!!!");
      }
    } else if (appStore.settingTabIndex === 1) {
      // 자동완성용 관용구인 경우
    }

    // 백엔드에서 관용어구들 가져와서 workspaceStore에 설정
    await workspaceStore.setIdiomsFromServer(
      workspaceStore.caseMasterData.format_code_path
    );
  } catch (e: AxiosError | Error | any) {
    const error = extractError(e);
    console.log(e);
    Util.openAlertModal(stores, error.status);
  } finally {
    // appStore.isLoading = false;
  }
}

function getBasicDiplayDescriptionText() {
  if (
    appStore.settingCodeNode === "DR_IDIOM/TEMPLATE/CROSS_REFERENCE" ||
    appStore.settingCodeNode === "DR_IDIOM/TEMPLATE/SUMMARY"
  )
    return (
      "※" +
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/NOT_DISPLAY").replace(
        "$DATA$",
        Util.getI18NTxt(
          stores,
          "SETTING/DRAFT/WORK_TYPE/PCT_APPLICATION",
          "setting_titles"
        ) + ", KIPO, and JPO"
      )
    );
  else if (appStore.settingCodeNode === "DR_IDIOM/TEMPLATE/PRIOR_ART")
    return (
      "※" +
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/NOT_DISPLAY").replace(
        "$DATA$",
        Util.getI18NTxt(
          stores,
          "SETTING/DRAFT/WORK_TYPE/PCT_APPLICATION",
          "setting_titles"
        ) + ", USPTO"
      )
    );
  else if (
    appStore.settingCodeNode === "DR_IDIOM/TEMPLATE/INDUSTRIAL_APPLICABILITY" ||
    appStore.settingCodeNode === "DR_IDIOM/TEMPLATE/SEQUENCELIST"
  )
    return (
      "※" +
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/ONLY_DISPLAY").replace(
        "$DATA$",
        Util.getI18NTxt(
          stores,
          "SETTING/DRAFT/WORK_TYPE/PCT_APPLICATION",
          "setting_titles"
        )
      )
    );
  else if (
    appStore.settingCodeNode === "DR_IDIOM/TEMPLATE/PURPOSE" ||
    appStore.settingCodeNode === "DR_IDIOM/TEMPLATE/EFFECT"
  )
    return (
      "※" +
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/NOT_DISPLAY").replace(
        "$DATA$",
        "USPTO"
      )
    );
  else return "";
}

watch(appStore, () => {
  if (appStore.settingRefresh) {
    setupIdiomData();
    appStore.settingRefresh = false;
  }
});

const editorSetup = (editor: any) => {
  editor.on("keydown", function (e: KeyboardEvent) {
    // console.log(e);
    if (e.code === "KeyS" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      updateSettingValue();
    }
  });
};

const editorInitCallback = (editor: any) => {
  tinymce.activeEditor.focus();
  tinymce.activeEditor.selection.select(tinymce.activeEditor.getBody(), true);
  tinymce.activeEditor.selection.collapse(false);
};

/** 자동완성용 관용구 구현부 */
// 자동완성용 관용구 변수
const autoSaveIdioms = ref<IdiomData[]>([]);
const isSelectedIdiomCards = ref<boolean[]>([]);
// 수정 모드 변수
const isAutocompleteIdiomModifyMode = ref(false);
const selectedIdiomIdx = ref(-1);
// 검색 쿼리 변수
const autoSaveIdiomQueryValue = ref("");

// 자동완성용 관용구 호버 인덱스
const autocompleteItemHoverIndices = ref<boolean[]>([]);

async function setIdiomsInWorkspace() {
  // 데이터 가져오기
  await workspaceStore.setIdiomsFromServer(
    workspaceStore.caseMasterData.format_code_path
  );

  if (appStore.settingTabIndex === 1) {
    // 자동완성 구성요소와 합침
    ElementHandler.setUpAutocompleteIdiomList(
      workspaceStore.caseData.elements.list,
      workspaceStore.autocompleteIdioms
    );
  }
}

async function addAutocompleteIdiom(autosaveIdiomText: string) {
  try {
    // 관용어구 생성 요청 후 성공하면 값 초기화 및 스토어 갱신
    const response = await api.draft.draftIdiomsCreate({
      format_code_path: workspaceStore.caseMasterData.format_code_path,
      dr_idiom_code_path: "DR_IDIOM/AUTOCOMPLETE",
      idiom_title: "",
      idiom_contents: Util.removePTag(autosaveIdiomText),
    });
    autoSaveIdioms.value.push(response.data.object);

    onClickIdiomResetBtn();

    setIdiomsInWorkspace();

    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/SAVE_SUCCESSED").replace(
        "$DATA$",
        Util.removePTag(autosaveIdiomText)
      ),
      "info"
    );
  } catch (e) {
    const error = extractError(e);
    Util.openAlertModal(stores, error.message);
  }
}

async function updateAutocompleteIdiom(autosaveIdiomText: string) {
  try {
    // 서버에 관용구 업데이트 요청, 관용어구 리스트 값 갱신 및 스토어 갱신
    await api.draft.draftIdiomsUpdate({
      id: autoSaveIdioms.value[selectedIdiomIdx.value].id,
      idiom_title: "",
      idiom_contents: Util.removePTag(autosaveIdiomText),
    });
    autoSaveIdioms.value[selectedIdiomIdx.value].idiom_contents =
      autosaveIdiomText;

    onClickIdiomResetBtn();

    setIdiomsInWorkspace();

    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/UPDATE_SUCCESSED").replace(
        "$DATA$",
        Util.removePTag(autosaveIdiomText)
      ),
      "info"
    );
  } catch (e) {
    const error = extractError(e);
    Util.openAlertModal(stores, error.message);
  }
}

// 에디터의 자동완성용 관용구 값이 빈 값이 아니면 배열에 추가
async function onClickIdiomAddBtn() {
  const autosaveIdiomText = tinymce.get("autosave-idiom").getContent().trim();

  if (!autosaveIdiomText.length) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/REQUEST_DATA_ALERT"),
      true
    );

    return;
  }

  if (!isAutocompleteIdiomModifyMode.value) {
    // 추가하기 모드이면
    await addAutocompleteIdiom(autosaveIdiomText);
  } else {
    // 수정하기 모드이면
    await updateAutocompleteIdiom(autosaveIdiomText);
  }
}

async function onClickIdiomDeleteBtn(idiom: IdiomData, idx: number) {
  try {
    // 삭제 후에 배열에서 제거하고 추가모드로 변경, 스토어 값 갱신
    await api.draft.draftIdiomsDelete({ id: idiom.id });
    autoSaveIdioms.value.splice(idx, 1);

    onClickIdiomResetBtn();

    setIdiomsInWorkspace();

    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/DELETE_SUCCESSED").replace(
        "$DATA$",
        idiom.idiom_contents
      ),
      "info"
    );
  } catch (e) {
    const error = extractError(e);
    if (error.status === 404) {
      // 요청 시 없는 데이터면 배열에서 제거
      autoSaveIdioms.value.splice(idx, 1);
    } else {
      Util.openAlertModal(stores, error.message);
    }
  }
}

const asyncIdiomDelete = asyncDebounce(onClickIdiomDeleteBtn, asyncDelay);

// 초기화 버튼 클릭 시 추가하기 모드로 변경
function onClickIdiomResetBtn() {
  isAutocompleteIdiomModifyMode.value = false;
  isSelectedIdiomCards.value = [];
  tinymce.get("autosave-idiom").setContent("");
  selectedIdiomIdx.value = -1;
}

// 카드 클릭 시 클릭한 값으로 초기화, 수정 모드로 변경
const onClickIdiomCard = (idx: number) => {
  isSelectedIdiomCards.value.length = 0;
  selectedIdiomIdx.value = idx;
  isAutocompleteIdiomModifyMode.value = true;
  isSelectedIdiomCards.value[idx] = true;
  tinymce
    .get("autosave-idiom")
    .setContent(autoSaveIdioms.value[idx].idiom_contents);
};

/** 자주 사용하는 설명 구현부 */
const frequentlyIdioms = ref<IdiomData[]>([]);
const isSelectedFrequentlyIdiomCards = ref<boolean[]>([]);
// 수정 모드 변수
const isFrequentlyIdiomModifyMode = ref(false);
const selectedFrequentlyIdiomIdx = ref(-1);
// 검색 쿼리 변수
const frequentlyIdiomQueryValue = ref("");

// 자주쓰는 설명 호버 인덱스
const frequentlyIdiomHoverIndices = ref<boolean[]>([]);

async function addFrequentlyIdiom(
  frequentlyIdiomTitle: string,
  frequentlyIdiomContents: string
) {
  try {
    // 관용어구 생성 요청 후 성공하면 값 초기화 및 스토어 갱신
    const response = await api.draft.draftIdiomsCreate({
      format_code_path: userStore.settings["SETTING/DRAFT/DEFAULT_FORMAT"],
      dr_idiom_code_path: DR_IDIOM_CUSTOM,
      // Tinymce 에디터가 컨텐츠를 p태그로 감싸기 때문에 p 태그 제거
      idiom_title: frequentlyIdiomTitle,
      idiom_contents: frequentlyIdiomContents,
    });
    frequentlyIdioms.value.push(response.data.object);
    tinymce.get("frequently-idiom-title").setContent("");
    tinymce.get("frequently-idiom-contents").setContent("");

    onClickFrequentlyIdiomResetBtn();

    setIdiomsInWorkspace();

    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/SAVE_SUCCESSED").replace(
        "$DATA$",
        Util.removePTag(frequentlyIdiomTitle)
      ),
      "info"
    );
  } catch (e) {
    const error = extractError(e);
    Util.openAlertModal(stores, error.message);
  }
}

async function updateFrequentlyIdiom(
  frequentlyIdiomTitle: string,
  frequentlyIdiomContents: string
) {
  try {
    // 서버에 관용구 업데이트 요청, 관용어구 리스트 값 갱신 및 스토어 갱신
    await api.draft.draftIdiomsUpdate({
      id: frequentlyIdioms.value[selectedFrequentlyIdiomIdx.value].id,
      // Tinymce 에디터가 컨텐츠를 p태그로 감싸기 때문에 p 태그 제거
      idiom_title: Util.removePTag(frequentlyIdiomTitle),
      idiom_contents: Util.removePTag(frequentlyIdiomContents),
    });
    // 관용어구 제목, 내용 갱신
    frequentlyIdioms.value[selectedFrequentlyIdiomIdx.value].idiom_title =
      tinymce.get("frequently-idiom-title").getContent();
    frequentlyIdioms.value[selectedFrequentlyIdiomIdx.value].idiom_contents =
      tinymce.get("frequently-idiom-contents").getContent();

    onClickFrequentlyIdiomResetBtn();

    setIdiomsInWorkspace();

    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/UPDATE_SUCCESSED").replace(
        "$DATA$",
        Util.removePTag(frequentlyIdiomTitle)
      ),
      "info"
    );
  } catch (e) {
    const error = extractError(e);
    Util.openAlertModal(stores, error.message);
  }
}

// 에디터의 자동완성용 관용구 값이 빈 값이 아니면 배열에 추가
async function onClickFrequentlyIdiomAddBtn() {
  // 제목이랑 내용 가져옴
  const frequentlyIdiomTitle = tinymce
    .get("frequently-idiom-title")
    .getContent()
    .trim();
  const frequentlyIdiomContents = tinymce
    .get("frequently-idiom-contents")
    .getContent()
    .trim();

  if (frequentlyIdiomTitle.length && frequentlyIdiomTitle.length) {
    if (!isFrequentlyIdiomModifyMode.value) {
      // 추가하기 모드이면
      await addFrequentlyIdiom(frequentlyIdiomTitle, frequentlyIdiomContents);
    } else {
      // 수정하기 모드이면
      await updateFrequentlyIdiom(
        frequentlyIdiomTitle,
        frequentlyIdiomContents
      );
    }
  } else {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/REQUEST_DATA_ALERT"),
      true
    );
  }
}

const asyncFrequentlyIdiomAdd = asyncDebounce(
  onClickFrequentlyIdiomAddBtn,
  asyncDelay
);

async function onClickFrequentlyIdiomDeleteBtn(idiom: IdiomData, idx: number) {
  try {
    // 삭제 후에 배열에서 제거하고 추가모드로 변경, 스토어 값 갱신
    await api.draft.draftIdiomsDelete({ id: idiom.id });
    frequentlyIdioms.value.splice(idx, 1);

    onClickFrequentlyIdiomResetBtn();

    setIdiomsInWorkspace();

    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/DELETE_SUCCESSED").replace(
        "$DATA$",
        Util.removePTag(idiom.idiom_title)
      ),
      "info"
    );
  } catch (e) {
    const error = extractError(e);
    if (error.status === 404) {
      // 요청 시 없는 데이터면 배열에서 제거
      frequentlyIdioms.value.splice(idx, 1);
    } else {
      Util.openAlertModal(stores, error.message);
    }
  }
}

const asyncFrequentlyIdiomDelete = asyncDebounce(
  onClickFrequentlyIdiomDeleteBtn,
  asyncDelay
);

// 초기화 버튼 클릭 시 추가하기 모드로 변경
function onClickFrequentlyIdiomResetBtn() {
  isFrequentlyIdiomModifyMode.value = false;
  isSelectedFrequentlyIdiomCards.value = [];
  tinymce.get("frequently-idiom-title").setContent("");
  tinymce.get("frequently-idiom-contents").setContent("");
  selectedFrequentlyIdiomIdx.value = -1;
}

// 카드 클릭 시 클릭한 값으로 초기화, 수정 모드로 변경
const onClickFrequentlyIdiomCard = (idx: number) => {
  isSelectedFrequentlyIdiomCards.value.length = 0;
  selectedFrequentlyIdiomIdx.value = idx;
  isFrequentlyIdiomModifyMode.value = true;
  isSelectedFrequentlyIdiomCards.value[idx] = true;
  tinymce
    .get("frequently-idiom-title")
    .setContent(frequentlyIdioms.value[idx].idiom_title);
  tinymce
    .get("frequently-idiom-contents")
    .setContent(frequentlyIdioms.value[idx].idiom_contents);
};

onMounted(() => {
  setupIdiomData();
});

// 자동완성에서 엔터
const handleAutocompleteEnter = (editor: any) => {
  editor.on("keydown", function (e: KeyboardEvent) {
    if (
      (e.key == "Enter" && (e.code == "Enter" || e.code == "NumpadEnter")) ||
      e.key === "Tab"
    ) {
      e.preventDefault();
      e.stopPropagation();

      onClickIdiomAddBtn();
    }
  });
};
</script>

<style lang="scss" scoped>
@import "src/styles/draft/envsettings";
.idiom-setting-options {
  height: 100%;
  .auto-save-idiom {
    width: 100%;
    height: 37.5rem;
  }
}

.ps-lt {
  position: absolute;
  top: 8.5rem;
  left: 68rem;
}

.areas {
  flex: 1;
  padding: 1rem;
  height: 25rem;
  background-color: white;
  border: 0.0625rem solid #bdbdbd;
  border-radius: 0.25rem;
}
input {
  &:focus {
    outline: none;
  }
}
.autosave-idiom-searchbar,
.frequently-idiom-searchbar {
  height: 2.5rem;
  padding-left: 2.625rem;
  border-bottom: 0.0625rem solid #e0e0e0;
}

.autusave-idiom,
.frequently-idiom-desc {
  height: 40.25rem;
}

.autosave-idiom-content,
.frequently-idiom-cards-wrapper {
  height: 34.375rem;
}
.frequently-idiom-cards,
.autosave-idiom-content {
  overflow-y: auto;
  display: flex;
  max-height: calc(100% - 3.5rem);
  flex-direction: column;
  gap: 0.5rem;

  .autosave-idiom-card,
  .frequently-idiom-card {
    border: 0.0625rem solid #e0e0e0;
    justify-content: space-between;
    text-align: justify;
    padding: 0.625rem 0.5rem 0.625rem 0.75rem;
    cursor: pointer;
    color: black;
    font-weight: 400;
    word-break: break-all;
    border-radius: 0.25rem;
  }
}
.autosave-idiom-content {
  max-height: calc(100% - 13.5rem);
  margin-right: 1.5rem;
}
</style>
