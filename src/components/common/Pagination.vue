<template>
  <div class="common-pagination d-flex align-center">
    <IconBtn
      class="mr-2"
      :style="{ width: '2rem', height: '2rem', borderRadius: '0.25rem' }"
      :icon="mdiChevronLeft"
      color="#BDBDBD"
      @click="page > 1 ? page-- : false"
    />
    <template v-for="n in length" :key="n">
      <div
        class="common-pagination-page d-flex justify-center align-center"
        :class="{
          current: n === page,
        }"
        :style="{
          width: '2rem',
          height: '2rem',
          color: n === page ? 'white' : 'black',
          backgroundColor: pageBtnColor && n === page ? pageBtnColor : 'white',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          '--color-hover': pageBtnColor ? rgbToRgba(pageBtnColor, '.5') : false,
          '--color-active': pageBtnColor
            ? rgbToRgba(pageBtnColor, '.3')
            : false,
        }"
        @click="page = n"
      >
        {{ n }}
      </div>
    </template>
    <IconBtn
      class="ml-2"
      :style="{ width: '2rem', height: '2rem', borderRadius: '0.25rem' }"
      :icon="mdiChevronRight"
      color="#BDBDBD"
      @click="page < length ? page++ : false"
    />
  </div>
</template>

<script setup lang="ts">
import { rgbToRgba } from "@/assets/javascripts/utils/css";
import IconBtn from "@/components/IconBtn.vue";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { ref, watch } from "vue";

interface Props {
  length?: number;
  page?: number;
  pageBtnColor?: string;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  length: 1,
});
const emit = defineEmits(["update:page"]);
const page = ref(props.page);
watch(page, (newValue) => {
  emit("update:page", newValue);
});
</script>

<style lang="scss" scoped>
.common-pagination-page {
  &:hover {
    background-color: var(--color-hover) !important;
  }
  &:active {
    background-color: var(--color-active) !important;
  }
}
</style>
