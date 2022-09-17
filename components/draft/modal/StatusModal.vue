<template>
  <Modal
    ref="statusModal"
    title="상태 변경"
    description="아래 상태 중 하나를 선택해주세요."
    buttonType="NY"
    noTxt="닫기"
    yesTxt="확인"
    :yesFunc="
      () => {
        return 'fdsl;jfdas;fds;ajsdf';
      }
    "
    :style="{ width: '40rem' }"
  >
    <div class="text-500-18-black">
      상태가 변경된 케이스는 메인화면에서 확인할 수 있습니다.
    </div>

    <VBtns
      class="mt-5"
      :labels="['작성 중', '초안발송완료', '수정 중', '제출 대기']"
    ></VBtns>
  </Modal>
</template>

<script lang="ts" setup>
import Modal from "@/components/common/modal/Modal.vue";
</script>

<style lang="scss">
@import "@/assets/stylesheets/draft/text";
</style>
