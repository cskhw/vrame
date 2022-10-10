<template>
  <!-- 배경 없는 모달 -->

  <div class="modal-wrapper" v-if="isOpen">
    <div class="modal-backgrounds" @click="closeModal()" />

    <!-- content-area -->
    <!-- 뷰티파이 컴포넌트는 필수적으로 v-app 태그로 감싸줘야 하기 때문에 넣음
    > 컴포넌트
    * 컬러피커
     -->
    <div class="modal-contents pt-7 pb-4" :style="themeStore.darkmodeStyle">
      <div class="d-flex align-center justify-space-between px-7">
        <div class="mb-4 text-bold-22-black" :style="themeStore.darkmodeStyle">
          {{
            Util.getI18NTxt(
              stores,
              "I18N/WORKSPACE/TOOLBAR/DROPDOWN_SETTING_SETTINGS"
            )
          }}
        </div>
        <IconBtn :icon="mdiClose" color="#9E9E9E" @click="closeModal()" />
      </div>
      <div class="d-flex flex-column align-start justify-start">
        <div class="tabbar px-7" :style="themeStore.darkmodeStyle">
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
                <img
                  v-if="item?.icon && item?.icon.includes('.png')"
                  src="@/assets/images/ipedit-symbol.png"
                />
                <v-icon
                  v-else-if="item?.icon"
                  :style="{ width: '1.4rem', height: '1.4rem' }"
                  :icon="item.icon"
                />
                <div class="ml-3">{{ item?.menu }}</div>
              </div>
            </button>
          </div>
        </div>
        <!-- 뷰티파이 컴포넌트가 v-app에 종속성을 가지기 때문에 넣음 -->
        <v-app style="height: 44.375rem; overflow: hidden">
          <SettingSidebar v-model="tabIndex">
            <SettingOptions v-model="sideIndex" inWorkspace />
          </SettingSidebar>
        </v-app>
      </div>
      <div
        class="d-flex aglin-center justify-space-between pt-3 mx-4"
        :class="{ 'justify-space-between': check, 'justify-end': !check }"
      >
        <div />
        <v-btn
          id="!!!!!!!!!!!!!"
          flat
          border="none"
          :style="{
            color: themeStore.workspaceButton,
            backgroundColor: themeStore.darkmodeBackgroundColor,
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
import SettingOptions from "@/components/draft/SettingOptions.vue";
import SettingSidebar from "@/components/draft/SettingSidebar.vue";
import IconBtn from "@/components/common/IconBtn.vue";
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { mdiCog, mdiDownload, mdiPencil, mdiClose } from "@mdi/js";
import { computed, onMounted, ref, watch } from "vue";

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
    { menu: Util.getI18NTxt(stores, "SETTING/GENERAL"), icon: mdiCog },
    { menu: Util.getI18NTxt(stores, "SETTING/EDITOR"), icon: mdiPencil },
    { menu: Util.getI18NTxt(stores, "SETTING/DOWNLOAD"), icon: mdiDownload },
    {
      menu: Util.getI18NTxt(stores, "SETTING/DRAFT"),
      icon: "@/assets/images/ipedit-symbol.png",
    },
    {
      menu: Util.getI18NTxt(stores, "SETTING/TRANSLATE"),
      icon: "@/assets/images/ipedit-symbol.png",
    },
  ];
});

function changeTab(index: number) {
  if (index === 4) {
    // TODO: 이용 서비스에 Translate가 있는가에 따라 메시지 다르게 보여줌
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/PREPARING")
    );
    return;
  }
  appStore.settingTabIndex = index;
  appStore.settingSidemenuIndex = 0;
}

// 모달 닫기
function closeModal() {
  appStore.onSpin();

  // 자동완성 양식 수정했을 때, workspace.vue에서 로직 도느라 스피너가 안돌아서, 강제로 시간 차를 조금 줌
  setTimeout(() => {
    // 워크스페이스에서 들어온 경우에는, 워크스페이스 새로고침을 위한 값 설정
    workspaceStore.setSettingUpdated(true);

    isOpen.value = false;
  }, 300);
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
  console.log("setting modal mounted");
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
  z-index: 9999;
  display: grid;
  width: 100vw;
  place-content: center;
  height: 100vh;
  overflow: hidden;
  .modal-backgrounds {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: #000000;
    opacity: 0.5;
    z-index: 0;
  }

  .modal-contents {
    z-index: 9999;
    overflow: hidden;
    width: 80rem;
    height: 55.625rem;
    border-radius: 0.5rem;
    opacity: 1;
    overflow: hidden;
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
