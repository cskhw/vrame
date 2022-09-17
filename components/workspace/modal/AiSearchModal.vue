<template>
  <!-- 배경 없는 모달 -->
  <div class="modal-wrapper" v-if="isOpen">
    <div class="modal-backgrounds" @click="isOpen = false" />

    <!-- content-area -->
    <div
      class="modal-contents"
      :style="{
        opacity: modalOpaSliderValue,
        ...themeStore.darkmodeOptionsStyle,
      }"
    >
      <!-- 모달 헤더 -->
      <div
        class="d-flex align-center justify-space-between pa-5 pt-7"
        :style="{ width: '100%' }"
      >
        <div
          class="text-400-22-black"
          :style="{
            color: stores.ts.isDarkmode ? stores.ts.darkmodePalette.color : '',
          }"
        >
          {{ title }}
        </div>
        <div class="d-flex align-center" :style="{ width: '10rem' }">
          <IconBtn
            v-if="opacityBar"
            class="mr-2"
            :color="Util.getColor(stores, 'PRIMARY')"
            :icon="mdiCircleOpacity"
          />
          <v-slider
            class="mr-4"
            v-if="opacityBar"
            :style="{ width: '5rem', height: '1.875rem' }"
            v-model="modalOpaSliderValue"
            track-color="#7C7F90"
            :color="Util.getColor(stores, 'PRIMARY')"
            max="1"
            step="0.01"
            min="0.2"
          />

          <IconBtn v-if="closeBtn" :icon="mdiClose" @click="isOpen = false" />
        </div>
      </div>
      <div class="d-flex px-5">
        <SearchBar
          style="width: 100%"
          class="mb-4 mr-4"
          :outline="Util.getColor(stores, 'PRIMARY')"
          v-model="searchKeywords"
          @keydown="onKeydownSearchBar"
          :inputStyle="themeStore.darkmodeOptionsStyle"
        />
        <v-btn
          @click="asyncOnClickSearchBtn"
          height="2.75rem"
          flat
          :style="{
            color: Util.getColor(stores, 'BUTTON_TEXT'),
            backgroundColor: Util.getColor(stores, 'BUTTON'),
          }"
        >
          {{ Util.getI18NTxt(stores, "I18N/BUTTON/SEARCH") }}</v-btn
        >
      </div>

      <div class="description px-5">{{ description }}</div>
      <div class="d-flex align-center mb-4 px-5">
        <div class="mr-4">
          {{
            Util.getI18NTxt(
              stores,
              "I18N/WORKSPACE/DETAILED_DESCRIPTION/AI_SEARCH_MODAL_SIMILARITY"
            )
          }}
        </div>
        <div
          class="mr-5"
          style="font-size: 1.5rem; font-weight: bold"
          :style="{ color: Util.getColor(stores, 'PRIMARY') }"
        >
          <template v-if="AiSimilaritySlider === 1">A</template>
          <!-- TODO: B, C 나오면 적용 -->
          <!-- <template v-if="AiSimilaritySlider === 0.5">B</template>
          <template v-if="AiSimilaritySlider === 0">C</template> -->
        </div>
        <div class="mr-8" :style="{ width: '6.25rem' }">
          <v-slider
            track-color="#7C7F90"
            :color="Util.getColor(stores, 'PRIMARY')"
            v-model="AiSimilaritySlider"
            max="1"
            step="0.5"
            min="0"
            :style="{ width: '6.25rem', height: '2rem' }"
          />
        </div>
        <div class="mr-4">
          {{
            Util.getI18NTxt(
              stores,
              "I18N/WORKSPACE/DETAILED_DESCRIPTION/AI_SEARCH_MODAL_LIST_COUNT"
            )
          }}
        </div>
        <!-- 표시 개수 -->
        <Select
          class="mr-4"
          v-model="appearCountValue"
          :options="appearCountOptions"
          :outline-color="Util.getColor(stores, 'PRIMARY')"
          :optionHoverColor="Util.getColor(stores, 'TINTED')"
          :selectHoverBgColor="Util.getColor(stores, 'TINTED')"
          :style="{ width: '10.75rem', height: '2.5rem' }"
          :select-color="themeStore.darkmodeColor"
          :options-style="themeStore.darkmodeOptionsStyle"
          downIcon
          show-border
        ></Select>
      </div>
      <DraftTable
        class="px-5"
        v-if="!isLoading"
        style="height: 31.25rem; overflow: overlay"
        v-model="sentenceTableData"
        :columnSpecs="columnSpecs"
        :rowHoverBgColor="Util.getColor(stores, 'TINTED')"
        @clickBtn="(e) => asyncOnClickAiTableTr(e)"
        scroll
      />
      <div
        class="d-flex justify-center align-center px-5"
        style="width: 100%; height: 31.25rem"
        v-else
      >
        <v-progress-circular
          indeterminate
          color="#5c6bc0"
          width="7"
          :size="50"
          style="margin-bottom: 4rem"
        />
      </div>
      <slot />
      <!-- button-area -->
      <!-- no버튼일 때 -->
      <div
        class="d-flex px-5 py-4"
        :class="{ 'justify-space-between': check, 'justify-end': !check }"
        :style="{
          borderTop: stores.ts.isDarkmode
            ? stores.ts.darkmodePalette.border
            : '',
        }"
        v-if="buttonType === 'N'"
      >
        <v-btn
          flat
          border="none"
          :style="{
            color: Util.getColor(stores, 'BUTTON'),
            backgroundColor: stores.ts.isDarkmode
              ? stores.ts.darkmodePalette.backgroundColor
              : '',
          }"
          @click="isOpen = false"
          >{{ noTxt }}</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import api from "@/api/api";
import { extractError } from "@/api/error";
import IconBtn from "@/components/common/IconBtn.vue";
import SearchBar from "@/components/common/SearchBar.vue";
import Select from "@/components/common/Select.vue";
import DraftTable from "@/components/draft/Table.vue";
import { mdiCircleOpacity, mdiClose } from "@mdi/js";
import { computed, ref, watch } from "vue";
import * as Util from "@/assets/javascripts/ipedit_util";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { asyncDebounce } from "@/assets/javascripts/utils/asyncDebounce";
import type { TableColumnSpecType } from "@/types/table.js";
import tinymce from "tinymce/tinymce";

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

defineProps<{
  title?: string;
  description?: string;
  check?: boolean;
  checkTxt?: string;
  buttonType?: string;
  noTxt?: string;
  yesTxt?: string;
  yesFunc?: (e?: any) => void;
  opacityBar?: boolean;
  closeBtn?: boolean;
}>();

const isLoading = ref(false);

const modalOpaSliderValue = ref<number>(1);
const appearCountValue = ref({ text: "20", value: "20" });
const appearCountOptions = ref([
  { text: "5", value: "5" },
  { text: "10", value: "10" },
  { text: "20", value: "20" },
  { text: "30", value: "30" },
]);

/**검색 부분 */
const searchKeywords = ref("");
function onKeydownSearchBar(e: KeyboardEvent) {
  e.stopPropagation();
  if (e.key === "Enter") {
    asyncOnClickSearchBtn();
  }
}

interface SentenceSearchResultItem {
  index: number;
  source_id: string;
  source_sentence: string;
  org_sentence: string;
}

const sentenceTableData = ref<SentenceSearchResultItem[]>([]);

const columnSpecs = computed((): TableColumnSpecType[] => [
  {
    header: Util.getI18NTxt(stores, "I18N/DASHBOARD/CASE_LIST/LIST_NO"),
    dataKey: "index",
    width: "3.75rem",
    color: themeStore.darkmodeColor,
    fontWeight: "0.875rem",
    whiteSpace: "nowrap",
  },
  {
    header: Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/DETAILED_DESCRIPTION/AI_SEARCH_MODAL_LIST_CASE_INFO"
    ),
    dataKey: "source_id",
    width: "12.5rem",
    color: themeStore.darkmodeColor,
    fontWeight: "0.875rem",
  },
  {
    header: Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/TOOLBAR/AI_SEARCH_MODAL_LIST_SENTENCE"
    ),
    dataKey: "source_sentence",
    width: "36.875rem",
    color: themeStore.darkmodeColor,
    fontWeight: "0.875rem",
  },
  {
    header: Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/DETAILED_DESCRIPTION/AI_SEARCH_MODAL_LIST_INSERT_BUTTON"
    ),
    width: "60px",
    color: themeStore.darkmodeColor,
    fontWeight: "0.875rem",
    hoverButtons: [
      {
        funcType: "insert",
        text: Util.getI18NTxt(
          stores,
          "I18N/WORKSPACE/DETAILED_DESCRIPTION/AI_SEARCH_MODAL_LIST_INSERT_BUTTON"
        ),
        padding: "0.25rem 0.75rem",
        backgroundColor: Util.getColor(stores, "BUTTON"),
        cursor: "pointer",
        color: Util.getColor(stores, "BUTTON_TEXT"),
        borderRadius: "0.125rem",
        fontWeight: "0.875rem",
      },
    ],
  },
]);

async function insertAiSentenceInEditor(e: {
  type: string;
  item: SentenceSearchResultItem;
}) {
  const item = e.item;
  const editor = tinymce.get("detailed-description");
  editor.selection.setContent(item.org_sentence, { format: "html" });
}

const asyncOnClickAiTableTr = asyncDebounce(insertAiSentenceInEditor);

// :header="['번호', '문헌번호/출원인(국적)', '문장 내용']"
const isOpen = ref(false);
const show = () => (isOpen.value = true);
const hide = () => (isOpen.value = false);

// 모달이 열리면 스크롤이 안되게 클래스 부착
watch(isOpen, () => {
  if (isOpen.value) {
    document.querySelector("html")?.classList.add("disable-scroll");
  } else {
    window.onscroll = function () {};
    document.querySelector("html")?.classList.remove("disable-scroll");
  }
});

defineExpose({ isOpen, show, hide });

function keywordHighlight(sentence: string): string {
  // 키워드의 모든 각 스트링과 일치하는 컨텐츠의 폰트 색 변경
  const query = searchKeywords.value;
  const keyword = [...new Set(query)].join("");
  const formatCodePath = workspaceStore.caseMasterData.format_code_path;
  // if (formatCodePath.includes("EN")) {
  if (formatCodePath.includes("USPTO")) {
    // 영어일 땐 단어 단위로 잘라서 하이라이팅
    const keyWords = query.split(" ");
    const setKeywords = [...new Set(keyWords)];
    // TODO: 나중에 우선순위 큐 라이브러리 구해서 최적화
    const dictionary = [];
    for (const keyword of setKeywords) {
      // 키워드 순회하면서 뒤에서부터 각 키워드의 위치를 저장한 후 오름차순 정렬하고 인덱스 위치 단어를 replace
      // 우선순위 큐로 정렬 없애서 최적화 가능
      let tempSentence = sentence.toLowerCase();
      let i = tempSentence.lastIndexOf(keyword.toLowerCase());

      while (i !== -1) {
        // 문장 순회하면서 인덱스, 키워드 위치 구함
        // 대소문자 바뀌므로 원래 단어 보존
        const originalKeyword = sentence.substring(i, i + keyword.length);
        dictionary.push({
          idx: i,
          keyword: originalKeyword,
        });
        tempSentence = tempSentence.substring(0, i);
        i = tempSentence.lastIndexOf(originalKeyword);
      }
    }

    // 뒤에서 부터 바꿔야 되므로 리버스 정렬
    dictionary.sort(function (a, b) {
      return b.idx - a.idx;
    });

    // 단어 합쳐주기
    let resultSentence = sentence;
    for (const wordValue of dictionary) {
      resultSentence = `${resultSentence.substring(
        0,
        wordValue.idx
      )}<span style='color: rgb(255,0,255)'>${
        wordValue.keyword
      }</span>${resultSentence.substring(
        wordValue.idx + wordValue.keyword.length
      )}`;
    }
    sentence = resultSentence;
  } else {
    // 영어가 아닐 땐 각 글자 단위로 잘라서 하이라이팅
    for (var i = sentence.length - 1; i > -1; i--) {
      for (var j = 0; j < keyword.length; j++) {
        const key = keyword[j];
        if (sentence[i].toLowerCase() === key.toLowerCase()) {
          sentence =
            sentence.substring(0, i) +
            `<span style='color: 	rgb(255,0,255)'>${sentence[i]}</span>` +
            sentence.substring(i + 1);
          continue;
        }
      }
    }
  }
  return sentence;
}

// nlp 언어 태그
const nlpLangTags: {
  [key: string]: string[];
} = {
  "FORMAT/KIPO": ["kr", "en", "source"],
  "FORMAT/JPO": ["kr", "jp", "target"],
  "FORMAT/USPTO": ["kr", "en", "target"],
  "FORMAT/CNIPA": ["kr", "cn", "target"],
};

/**created */
async function onClickSearchBtn() {
  try {
    isLoading.value = true;
    sentenceTableData.value = [];
    const aiResponse = await api.nlp.nlpSearchBm25(searchKeywords.value, {
      format_code_path: workspaceStore.caseMasterData.format_code_path,
      source_language:
        //@ts-ignore 스트링 키 타입 못잡음
        nlpLangTags[workspaceStore.caseMasterData.format_code_path][0],
      target_language:
        //@ts-ignore 스트링 키 타입 못잡음
        nlpLangTags[workspaceStore.caseMasterData.format_code_path][1],
      where: nlpLangTags[workspaceStore.caseMasterData.format_code_path][2],
      strategy: "형태소 분석",
      section_type: "descriptions",
      index_size: parseInt(appearCountValue.value.value),
      verbose: true,
    });

    const results = aiResponse.data.results;
    results.forEach((item, idx) => {
      sentenceTableData.value.push({
        index: idx,
        source_id: item.source_id,
        source_sentence:
          nlpLangTags[workspaceStore.caseMasterData.format_code_path][2] ===
          "source"
            ? keywordHighlight(item.source_sentence)
            : keywordHighlight(item.target_sentence),
        org_sentence:
          nlpLangTags[workspaceStore.caseMasterData.format_code_path][2] ===
          "source"
            ? item.source_sentence
            : item.target_sentence,
      });
    });
  } catch (e) {
    const error = extractError(e);
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
const asyncOnClickSearchBtn = asyncDebounce(onClickSearchBtn);

const AiSimilaritySlider = ref(1);
watch(AiSimilaritySlider, (newValue) => {
  if (newValue < 1) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/PREPARING")
    );
    AiSimilaritySlider.value = 1;
  }
});
/**created */
sentenceTableData.value = [];
</script>

<style lang="scss" scoped>
.modal-wrapper {
  position: fixed;
  z-index: 5000;
  display: grid;
  width: 100vw;
  place-content: center;
  height: 100vh;
  .modal-contents {
    width: 100%;
    width: 63.625rem;
    opacity: 1;
    border-radius: 0.5rem;

    .title {
      font-weight: 600;
      font-size: 1.5rem;
      line-height: 1.8125rem;
      color: #1b1a1b;
    }
    .description {
      font-weight: 500;
      font-size: 1.125rem;
      line-height: 1.5rem;
      color: #1b1a1b;
    }
    .checkBox {
      width: 1rem;
      height: 1rem;
      border: 0.125rem solid #bcbcbc;
      border-radius: 0.25rem;
    }
  }
}
</style>
