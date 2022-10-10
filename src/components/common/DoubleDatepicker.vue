<template>
  <div class="multi-buttons">
    <v-btns
      :labels="['실시간', '일별', '월별', '년도별']"
      @clicked="(e) => (isDisabled = e)"
    />
  </div>
  <div class="datepickers d-flex justify-space-between mt-3">
    <div class="datepicker" :style="{ width: '100%' }">
      <datepicker
        :style="
          isDisabled
            ? {}
            : { width: '100%', color: 'grey', backgroundColor: 'lightgrey' }
        "
        v-model="startDate"
        :typeable="true"
        :disabled="dateDisabled"
        :minimumView="minimumView"
        :inputFormat="inputFormat"
        :locale="ko"
        :key="minimumView"
      />
      <v-icon class="datepicker-icon" :icon="mdiCalendar" />
    </div>
    <div
      class="mx-3"
      :style="{ width: '1.25rem', height: '2.5rem', lineHeight: '2.5rem' }"
    >
      ~
    </div>
    <div class="datepicker" :style="{ width: '100%' }">
      <datepicker
        :style="
          isDisabled ? {} : { color: 'grey', backgroundColor: 'lightgrey' }
        "
        v-model="endDate"
        :typeable="true"
        :disabled="dateDisabled"
        :minimumView="minimumView"
        :inputFormat="inputFormat"
        :locale="ko"
        :key="minimumView"
      />
      <v-icon class="datepicker-icon" :icon="mdiCalendar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiCalendar } from "@mdi/js";
import { ko } from "date-fns/locale";
import { ref, watch } from "vue";

const isDisabled = ref(0);
const dateDisabled = ref(true);
const minimumView = ref("day");
const inputFormat = ref("yyyy-MM-dd");
const endDate = ref(new Date());
const startDate = ref(new Date());
const emit = defineEmits(["endDate", "startDate"]);
watch(isDisabled, (newValue) => {
  if (newValue == 0) {
    dateDisabled.value = true;
  } else if (newValue == 1) {
    dateDisabled.value = false;
    minimumView.value = "day";
    inputFormat.value = "yyyy-MM-dd";
  } else if (newValue == 2) {
    dateDisabled.value = false;
    minimumView.value = "month";
    inputFormat.value = "yyyy-MM";
  } else if (newValue == 3) {
    dateDisabled.value = false;
    minimumView.value = "year";
    inputFormat.value = "yyyy";
  }
});

watch(endDate, (newValue, _) => {
  if (newValue < startDate.value) {
    endDate.value = startDate.value;
    alert("끝 날짜가 시작 날짜보다 작을 수 없습니다.");
  } else {
    emit("startDate", startDate.value);
    emit("endDate", newValue);
  }
});
watch(startDate, (newValue, _) => {
  if (newValue > endDate.value) {
    startDate.value = endDate.value;
    alert("끝 날짜가 시작 날짜보다 작을 수 없습니다.");
  } else {
    emit("startDate", newValue);
    emit("endDate", endDate.value);
  }
});
</script>

<style lang="scss" scoped>
@import "@/styles/draft/color";
@import "@/styles/main";

.multi-buttons .v-btn {
  border: 0.0625rem solid #e0e0e0;
  border-radius: 0rem;
  &:hover {
    background-color: $color-primary-400;
    color: white;
  }
  &:focus {
    background-color: $color-primary-400;
    color: white;
  }
  &.clicked {
    background-color: $color-primary-400;
    color: white;
  }
}

.datepicker {
  position: relative;
  .datepicker-icon {
    position: absolute;
    right: 5%;
    top: 30%;
  }
}
input {
  align-items: center;
  padding: 0.625rem 0.5rem 0.625rem 0.75rem;
  height: 2.5rem;
  background: black;
  color: red;
  /* Gray/300 */

  border: 0.0625rem solid #e0e0e0;
  box-sizing: border-box;
  border-radius: 0.25rem;
}
</style>
