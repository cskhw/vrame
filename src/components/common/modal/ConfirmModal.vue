<template>
  <GeneralModal
    :title="modalStore.confirmModal.title"
    :description="modalStore.confirmModal.desc"
    :buttonType="modalStore.confirmModal.buttonType"
    :yesTxt="modalStore.confirmModal.yesButtonText"
    :noTxt="modalStore.confirmModal.noButtonText"
    :yesFunc="modalStore.confirmModal.yesButtonFunc"
    :noFunc="() => modalStore.confirmModal.hide()"
    :closeBtn="modalStore.confirmModal.closeBtn"
    :backFunc="() => modalStore.confirmModal.hide()"
  />
</template>

<script setup lang="ts">
import GeneralModal from "@/components/common/modal/GeneralModal.vue";
import useModalStore from "@/store/useModalStore";

const modalStore = useModalStore();
</script>
