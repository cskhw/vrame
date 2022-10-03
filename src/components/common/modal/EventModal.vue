<template>
  <teleport to="#modal-area">
    <!-- 공지사항 모달 -->
    <div class="modals" v-if="isModalsShow">
      <div class="modal-wrapper">
        <div v-for="(item, i) of eventItems" class="modal-body" :key="i">
          <div class="modal-contents">
            <!-- 공지사항 로딩 -->
            <IComponentSpinner ref="eventModalSpinner" />
            <!-- 공지사항 모달 -->
            <div class="modal-descriptions" v-html="item.modal_contents" />
          </div>
          <div class="modal-footer">
            <div
              class="modal-footer-noshow"
              @click="() => setShowCookie(item, i)"
            >
              {{ eventDurationTxt(item.modal_duration_type) }}
            </div>
            <v-btn :style="{ color: '#5c6bc0' }" flat @click="() => hide(i)">{{
              $t("common_close")
            }}</v-btn>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import api from "@/api/api";
import { dateFormat, SERVICE_CODE_PATH_DR } from "@/assets/javascripts/common";
import useAppStore from "@/store/useAppStore";
import { computed, ref } from "vue";
import IComponentSpinner from "@/components/IComponentSpinner.vue";
import type { IIComponentSpinner } from "@/types/component";
import { GlobalCookies } from "@/assets/javascripts/cookie";
import { format, add, isAfter, isBefore } from "date-fns";
import type { EventModalItem } from "@/types/draft";
import { convertDateToUTC } from "@/assets/javascripts/utils/date";

const appStore = useAppStore();

const eventModalSpinner = ref<IIComponentSpinner>();
const eventItems = ref<EventModalItem[]>([]);

const currentDate = new Date();
// 서버 시간은 UTC+00:00 기준임
const localTimeSync = convertDateToUTC(currentDate);

const afterWeekTime = format(add(localTimeSync, { days: 7 }), dateFormat);
const afterDayTime = format(add(localTimeSync, { days: 1 }), dateFormat);

// 모달 온오프
const isModalsShow = ref(true);
const show = () => (isModalsShow.value = true);
const hide = (idx: number) => {
  eventItems.value.splice(idx, 1);
  // 남은 이벤트가 없으면 모달 닫기 처리
  if (eventItems.value.length <= 0) isModalsShow.value = false;
};

const eventDurationTxt = computed(() => (duration: number) => {
  if (duration === 1) {
    return "";
  } else if (duration === 2) {
    return "안보기";
  } else if (duration === 3) {
    return "일주일간 보지않음";
  } else if (duration === 4) {
    return "하루 동안 보지않음";
  }
});

// 쿠키 설정
function setShowCookie(item: EventModalItem, i: number) {
  // TODO: 이벤트 기간(modal_duration_type)에 따라서 쿠키 설정 필요
  const id = item.id.toString();
  const duration = item.modal_duration_type;

  const cookieOk = GlobalCookies.get("cookieOK");

  if (!cookieOk) {
    eventItems.value.splice(i, 1);
    return;
  }

  if (duration === 1) {
    // 기간 동안 강제로 보여주기
  } else if (duration === 2)
    // none이면 한번 끄면 계속 보지 않음
    GlobalCookies.set(id, "none");
  else if (duration === 3) GlobalCookies.set(id, afterWeekTime);
  else if (duration === 4) GlobalCookies.set(id, afterDayTime);
  eventItems.value.splice(i, 1);
}

// 쿠키의 시간 값이 더 크면 모달을 보여주지 않음
function setShowModal() {
  for (let i = eventItems.value.length - 1; i > -1; i--) {
    const event = eventItems.value[i];
    const cookieDuration = GlobalCookies.get(event.id.toString());

    // 이벤트 시작, 종료 시간에 따라서 모달 처리
    const startDate = new Date(event.modal_start_time);
    const endDate = new Date(event.modal_end_time);

    if (
      !(isAfter(localTimeSync, startDate) && isBefore(localTimeSync, endDate))
    ) {
      // 유효한 시간이 아니면 모달 제거
      eventItems.value.splice(i, 1);
      continue;
    }

    if (cookieDuration) {
      // 쿠키에 따라 모달 처리
      const cookieDate = new Date(cookieDuration);
      // 쿠키 값이 더 크면 모달 제거
      if (localTimeSync < cookieDate || cookieDuration === "none")
        eventItems.value.splice(i, 1);
    }
  }
}

// 이벤트 가져오기
async function getEvent() {
  try {
    const response = await api.management.modalReadPage({
      format_code_path: appStore.formatByLang,
      service_code_path: SERVICE_CODE_PATH_DR,
      ui_lang_code_path: "UI_LANGUAGE/" + appStore.lang,
      page_number: 0,
      page_size: 10,
    });
    eventItems.value = response.data.objects;
  } catch (e) {
    console.log(e);
  }
}

defineExpose({
  show,
  hide,
});

/**created */
getEvent().then(() => {
  setShowModal();
});
</script>

<style lang="scss" scoped>
.modals {
  position: absolute;
  display: flex;
  z-index: 1001;
  .modal-wrapper {
    display: flex;
    width: max-content;
    max-width: 100%;
    height: max-content;
    justify-content: start;
    align-content: start;
    align-items: start;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.5rem;
    background: transparent;
    .modal-body {
      position: relative;
      width: 29.375rem;
      height: 33.75rem;
      overflow: hidden;
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0rem 0.25rem 1.25rem rgba(0, 0, 0, 0.25);
      .modal-contents {
        overflow: hidden;
        height: 29.375rem;
        .modal-descriptions {
          overflow: hidden;
          height: 100%;
        }
      }

      .modal-footer {
        display: flex;
        justify-content: space-between;
        padding: 1rem 1rem 1rem 1rem;
        align-items: center;
        border-top: 0.0625rem solid #e0e0e0;
        height: 4.375rem;
        .modal-footer-noshow {
          cursor: pointer;
          font-weight: 400;
          color: #757575;
          &:hover {
            opacity: 0.6;
          }
        }
      }
    }
  }
}
</style>
