<template>
  <GeneralModal
    :title="modalStore.termsModal.title"
    :description="modalStore.termsModal.desc"
    :buttonType="modalStore.termsModal.buttonType"
    :yesTxt="modalStore.termsModal.yesButtonText"
    :yesFunc="modalStore.termsModal.yesButtonFunc"
    :noFunc="modalStore.termsModal.noButtonFunc"
    :backFunc="() => modalStore.termsModal.hide()"
    uncloseClickBack
  >
  </GeneralModal>
</template>

<script setup lang="ts">
import api from "@/api/api";
import { extractError } from "@/api/error";
import GeneralModal from "@/components/common/modal/GeneralModal.vue";
import useModalStore from "@/store/useModalStore";
import * as Util from "@/assets/javascripts/ipedit_util";
import { useI18n } from "vue-i18n";
import useAppStore from "@/store/useAppStore";

// 전역 변수
const modalStore = useModalStore();
const appStore = useAppStore();

const { t } = useI18n();

async function setTermsModal() {
  modalStore.termsModal.title = Util.getLocaleTxt(t, "signupform_terms");
  modalStore.termsModal.buttonType = "Y";
  modalStore.termsModal.yesButtonText = Util.getLocaleTxt(t, "common_confirm");
  modalStore.termsModal.desc = Util.getLocaleTxt(t, "signupform_no_terms");
  modalStore.termsModal.noButtonFunc = () => modalStore.termsModal.hide();
  modalStore.termsModal.yesButtonFunc = () => modalStore.termsModal.hide();

  try {
    // 모든 terms 가져옴
    const response = await api.management.termsVersionReadAll({
      ui_lang_code_path: "UI_LANGUAGE/" + appStore.lang,
    });
    if (response.data.objects?.length) {
      const id = response.data.objects[0].id;
      const termsContents = (await api.management.termsRead({ id: id })).data
        .object.terms_contents;
      modalStore.termsModal.desc = termsContents;
    }
  } catch (e) {
    const error = extractError(e);
    console.log(error);
  }
}
setTermsModal();
</script>
