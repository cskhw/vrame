<template>
  <GeneralModal
    :alert="modalStore.sessionModal.alert"
    :title="modalStore.sessionModal.title"
    :description="modalStore.sessionModal.desc"
    :buttonType="modalStore.sessionModal.buttonType"
    :yesTxt="modalStore.sessionModal.yesButtonText"
    :noTxt="modalStore.sessionModal.noButtonText"
    :yesFunc="modalStore.sessionModal.yesButtonFunc"
    :noFunc="modalStore.sessionModal.noButtonFunc"
    :closeBtn="modalStore.sessionModal.closeBtn"
    :backFunc="() => modalStore.infoModal.hide()"
  />
</template>

<script setup lang="ts">
import GeneralModal from "@/components/common/modal/GeneralModal.vue";
import useModalStore from "@/store/useModalStore";

const modalStore = useModalStore();

modalStore.sessionModal.alert = true;
modalStore.sessionModal.noButtonFunc = () => modalStore.sessionModal.hide();
modalStore.sessionModal.closeBtn = false;
</script>
