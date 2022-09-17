<template>
  <GeneralModal
    :info="modalStore.infoModal.info"
    :alert="modalStore.infoModal.alert"
    :title="modalStore.infoModal.title"
    :description="modalStore.infoModal.desc"
    :buttonType="modalStore.infoModal.buttonType"
    :yesTxt="modalStore.infoModal.yesButtonText"
    :noTxt="modalStore.infoModal.noButtonText"
    :yesFunc="modalStore.infoModal.yesButtonFunc"
    :noFunc="modalStore.infoModal.noButtonFunc"
    :closeBtn="modalStore.infoModal.closeBtn"
    :backFunc="() => modalStore.infoModal.hide()"
    uncloseClickBack
  />
</template>

<script setup lang="ts">
import GeneralModal from "@/components/common/modal/GeneralModal.vue";
import useModalStore from "@/store/useModalStore";

const modalStore = useModalStore();

// modalStore.infoModal.yesButtonFunc = () => modalStore.infoModal.hide();
// modalStore.infoModal.noButtonFunc = () => modalStore.infoModal.hide();
</script>
