<template>
  <Modal
    ref="completeModal"
    title="본 케이스를 완료하시겠습니까?"
    description="완료 후에는 아카이브 메뉴에서 본 케이스를 조회하실 수 있습니다."
    buttonType="NY"
    noTxt="닫기"
    yesTxt="완료"
    :yesFunc="
      () => {
        return 'fdsl;jfdas;fds;ajsdf';
      }
    "
  >
    <div class="ma-4">
      <v-container
        class="mt-5 pa-5"
        :style="{
          border: '0.0625rem solid #e0e0e0',
          borderRadius: '0.5rem',
        }"
      >
        <div :style="{ width: '37rem' }">
          안전한 데이터 보관을 위해 암호화된 백업파일(*.ipac)을 생성하거나
          IPACTORY Cloud보관을 추천합니다.
        </div>
        <div class="d-flex align-center mt-4">
          <v-btn
            class="mr-2"
            color="#5c6bc0"
            text-color="white"
            style="color: white"
            :style="{
              height: '1.5rem',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
              padding: '0rem 0.5rem',
            }"
            flat
          >
            백업파일(*.ipac) 다운로드하기</v-btn
          >
          <v-btn
            color="#5c6bc0"
            text-color="white"
            style="color: white"
            :style="{
              height: '1.5rem',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
              padding: '0rem 0.5rem',
            }"
            flat
          >
            클라우드에 보관하기</v-btn
          >
        </div>
      </v-container>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import Modal from "@/components/common/modal/Modal.vue";
import type { ModalType } from "@/types/modal";
import { ref } from "vue";
const completeModal = ref<ModalType>();

const show = () => completeModal.value?.show();
const hide = () => completeModal.value?.hide();
defineExpose({ show, hide });
</script>
