<template>
  <!-- 배경 없는 모달 -->
  <div class="modal-wrapper" v-if="isOpen">
    <div class="modal-backgrounds" @click="closeModal()" />

    <!-- content-area -->
    <div
      class="modal-body pt-7 pb-4"
      :style="{
        backgroundColor: themeStore.darkmodeBackgroundColor,
        color: themeStore.darkmodeColor,
      }"
    >
      <div class="modal-header d-flex align-center justify-space-between">
        <div
          class="mb-4 px-7 text-bold-22-black"
          :style="{
            backgroundColor: themeStore.darkmodeBackgroundColor,
            color: themeStore.darkmodeColor,
          }"
        >
          {{
            Util.getI18NTxt(
              stores,
              "I18N/WORKSPACE/TOOLBAR/DROPDOWN_SETTING_IDIOM"
            )
          }}
        </div>
        <IconBtn
          class="mx-7"
          :icon="mdiClose"
          color="#9E9E9E"
          @click="closeModal()"
        />
      </div>
      <div
        class="modal-contents d-flex flex-column align-start justify-start"
        :style="themeStore.darkmodeStyle"
      >
        <div
          class="tabbar px-7"
          :style="{ borderBottom: themeStore.darkmodeBorder }"
        >
          <div class="d-flex menu-btns">
            <button
              class="menu-btn"
              v-for="(item, index) in menu"
              :style="{
                backgroundColor:
                  appStore.settingTabIndex !== index ? '#dfdfdf' : 'white',
                opacity:
                  appStore.settingTabIndex !== index && isHoverIndices[index]
                    ? '.8'
                    : '1',
                color: appStore.settingTabIndex !== index ? '#7C7F90' : 'black',
                cursor:
                  appStore.settingTabIndex !== index ? 'pointer' : 'unset',
              }"
              flat
              @click="changeTab(index)"
              :key="item.menu"
              @mouseenter="isHoverIndices[index] = true"
              @mouseleave="isHoverIndices[index] = false"
            >
              <div class="d-flex align-center">
                <div class="mx-3">{{ item?.menu }}</div>
              </div>
            </button>
          </div>
        </div>
        <SettingSidebar v-model="tabIndex">
          <SettingOptions v-model="sideIndex" inWorkspace />
        </SettingSidebar>
      </div>
      <div
        class="d-flex justify-end aglin-center justify-space-between pt-4"
        :style="{ borderTop: themeStore.darkmodeBorder }"
      >
        <div />
        <v-btn
          class="mr-7"
          flat
          border="none"
          :style="{
            color: Util.getColor(stores, 'BUTTON'),
          }"
          @click="closeModal()"
          >{{ Util.getI18NTxt(stores, "I18N/BUTTON/CLOSE") }}</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as Util from "@/assets/javascripts/ipedit_util";
import SettingOptions from "@/components/workspace/modal/IdiomSettingOptions.vue";
import SettingSidebar from "@/components/workspace/modal/IdiomSettingSidebar.vue";
import IconBtn from "@/components/common/IconBtn.vue";
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { mdiCog, mdiDownload, mdiPencil, mdiClose } from "@mdi/js";
import { computed, onMounted, ref, watch } from "vue";
import colors from "@/assets/javascripts/colors";

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

const isHoverIndices = ref<boolean[]>([]);

// 초기화
appStore.settingTabIndex = 0;
appStore.settingSidemenuIndex = 0;

const tabIndex = ref(appStore.settingTabIndex);
const sideIndex = ref(appStore.settingSidemenuIndex);

const menu = computed(() => {
  return [
    { menu: Util.getI18NTxt(stores, "DR_IDIOM/TEMPLATE") },
    {
      menu: Util.getI18NTxt(stores, "DR_IDIOM/AUTOCOMPLETE", "setting_titles"),
    },
    {
      menu: Util.getI18NTxt(stores, "DR_IDIOM/CUSTOM", "setting_titles"),
    },
  ];
});

function changeTab(index: number) {
  appStore.settingTabIndex = index;
  appStore.settingSidemenuIndex = 0;

  if (appStore.settingTabIndex !== 0) appStore.settingRefresh = true;
}

// 모달 닫기
function closeModal() {
  // 워크스페이스에서 들어온 경우에는, 워크스페이스 새로고침을 위한 값 설정
  workspaceStore.setIdiomUpdated(true);

  isOpen.value = false;
}

watch(appStore, () => {
  if (appStore.settingTabIndex !== tabIndex.value) {
    tabIndex.value = appStore.settingTabIndex;
  }

  if (appStore.settingSidemenuIndex !== sideIndex.value) {
    sideIndex.value = appStore.settingSidemenuIndex;
  }
});

onMounted(() => {
  console.log("idiom setting modal mounted");
  appStore.settingTabIndex = 0;
  appStore.settingSidemenuIndex = 0;
});

defineProps<{
  title?: string;
  description?: string;
  check?: boolean;
  checkTxt?: string;
  buttonType?: string;
  noTxt?: string;
  yesTxt?: string;
  yesFunc?: (e?: any) => void;
  closeBtn?: boolean;
}>();

const isOpen = ref(false);
const show = (idx?: number) => {
  isOpen.value = true;
  idx ? (tabIndex.value = idx) : false;
};
const hide = () => (isOpen.value = false);

defineExpose({ isOpen, show, hide });
</script>

<style lang="scss" scoped>
@import "@/styles/draft/text";
.modal-wrapper {
  position: fixed;
  z-index: 1;
  display: grid;
  width: 100vw;
  place-content: center;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;
  .modal-backgrounds {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: #000000;
    opacity: 0.5;
    z-index: 0;
  }

  .modal-body {
    z-index: 9999;
    background-color: white;
    border-radius: 0.5rem;
    width: 80rem;
    height: 55rem;
    opacity: 1;
    .modal-contents {
      height: 45.875rem;
    }
  }
}
.setting {
  padding: 1.5rem;
  position: relative;
  min-width: 74.0625rem;
  height: 100%;
  min-width: 74.0625rem;
}
.tabbar {
  position: relative;
  width: 100%;
  .menu-btns {
    position: relative;
    & > button {
      z-index: 999;
      margin-right: 0.375rem;
      padding: 0 1rem;

      position: relative;
      top: 0.0625rem;
      height: 2.5rem;

      border-top: 0.0625rem solid #dfdfdf;
      border-left: 0.0625rem solid #dfdfdf;
      border-right: 0.0625rem solid #dfdfdf;
      border-radius: 0.5rem 0.5rem 0 0;

      font-size: 0.875rem;
      font-weight: 400;
    }
  }
}
</style>
