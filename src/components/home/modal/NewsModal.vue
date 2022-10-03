<template>
  <div
    class="modal contact-us"
    id="modal"
    v-bind:class="{ 'is-active': isNew }"
  >
    <div class="modal-background"></div>
    <div class="modal-content modal-contact modal-news">
      <button
        class="modal-close is-large"
        aria-label="close"
        v-on:click="closeContact"
      ></button>
      <div class="detail-news">
        <p v-html="date"></p>
        <h1 class="contact__text" v-html="title"></h1>
        <div class="img-detailNew">
          <img :src="img" alt="detail" />
        </div>
        <h4
          class="news-description"
          style="line-height: 1.8rem"
          v-html="contents"
        ></h4>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "@/components/Button.vue";

withDefaults(
  defineProps<{
    isNew: Boolean;
    img: string;
    date: string;
    title: string;
    contents: string;
  }>(),
  {
    img: "",
  }
);

const emit = defineEmits(["closeContact"]);

function closeContact() {
  emit("closeContact");
}

if (typeof window !== "undefined") {
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", (evt) => {
      evt = evt || window.event;
      if (evt.keyCode == 27) {
        emit("closeContact");
      }
    });
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/stylesheets/signUp_outsourcing.scss";
@import "@/assets/stylesheets/news_outsourcing.scss";
::v-deep(.news-description) {
  p {
    margin-bottom: 0.5rem;
  }
}
</style>
