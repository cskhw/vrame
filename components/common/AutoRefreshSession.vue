<template>
  <!--
    아래의 글로벌 이벤트를 정의

    1. mousemove
    2. click
    3. scroll

    GlobalEvents 에 같은 이름에 함수를 공유하면,
    이벤트가 동시 발생 시, asyncDebounce 결과로 최종 이벤트 하나만 실행됨
    
    e.g. keydown 과 mousemove 연달아 발생하고 mousemove 가 마지막 이벤트면,
        mousemove 가 오리진인 이벤트 하나만 실행 됨.

    * Tinymce 관련
    > tinymce 에디터가 포함되는 컴포넌트에서는,
    > tinymce 가 focus 가 되면, 이벤트 버블링을 막아놔서 글로벌 리스너에서 이벤트가 잡히지 않음
    > 따라서, tinymce 이벤트 처리가 필요하면 Editor.vue 에서 필요한 이벤트를 추가로 정의함
    >> e.g. editor.on("keydown", refreshTokenDebounced);
   -->
  <GlobalEvents
    @mousemove="refreshTokenDebounced(authStore)"
    @click="refreshTokenDebounced(authStore)"
  />
</template>

<script lang="ts" setup>
import { GlobalEvents } from "vue-global-events";
import { onBeforeMount, onBeforeUnmount } from "vue";
import { refreshTokenDebounced } from "@/assets/javascripts/utils/authUtil";
import useAuthStore from "@/store/useAuthStore";

const authStore = useAuthStore();

function defineScrollCallback() {
  return function () {
    refreshTokenDebounced(authStore);
  };
}

const scrollCallback = defineScrollCallback();

onBeforeMount(() => {
  window.addEventListener("scroll", scrollCallback);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", scrollCallback);
});
</script>

<style lang="scss" scoped></style>
