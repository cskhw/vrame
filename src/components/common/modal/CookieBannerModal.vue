<template>
  <div
    class="cookie-banner d-flex align-center justify-space-between"
    v-bind:class="{ 'is-active': modalStore.cookieModal.isOpen }"
  >
    <span
      style="width: 85%"
      class="d-flex align-center justify-start text-400-14-black"
      v-html="$t('cookie_desc')"
    >
    </span>
    <div class="cookie-banner-btns d-flex align-center">
      <v-btn
        class="reject-btn mr-3"
        :style="{
          color: '#5c6bc0',
          width: '5.625rem',
          height: '2.5rem',
        }"
        flat
        @click="modalStore.cookieModal.hide()"
        >{{ $t("cookie_declineBtn") }}</v-btn
      >
      <v-btn
        class="accept-btn"
        color="#5c6bc0"
        :style="{ color: 'white', width: '5.625rem', marginRight: '1.25rem' }"
        flat
        @click="onClickAcceptCookieBtn"
        >{{ $t("cookie_acceptBtn") }}</v-btn
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import useAppStore from "@/store/useAppStore";
import useModalStore from "@/store/useModalStore";
import { GlobalCookies } from "@/assets/javascripts/cookie";
import { enableDexiePersistence } from "@/assets/javascripts/dexie";

const appStore = useAppStore();
const modalStore = useModalStore();

const onClickAcceptCookieBtn = async () => {
  // 쿠키 허용 관련 로직 추가
  GlobalCookies.set("cookieOK", "true");
  appStore.isCookieAllowed = true;
  modalStore.cookieModal.hide();

  // Dexie Persistence 설정
  await enableDexiePersistence();
};
</script>

<style lang="scss" scoped>
.cookie-banner {
  z-index: 999999999;
  position: fixed;
  bottom: 1.25rem;
  width: calc(100% - 2.5rem);
  left: 1.25rem;
  min-height: 5.25rem;
  height: max-content;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0rem 1.25rem 1.25rem -0.625rem rgba(0, 0, 0, 0.1);
  white-space: keep-all;
  @media screen and (max-width: 48rem) {
    display: flex;
    flex-direction: column;
    &-btns {
      width: 100%;
      margin-top: 1.25rem;
      .reject-btn {
        width: 50% !important;
      }
      .accept-btn {
        width: 50% !important;
      }
    }
  }
}
</style>
