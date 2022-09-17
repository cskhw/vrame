<template>
  <GeneralModal
    :title="modalStore.privacyModal.title"
    :description="modalStore.privacyModal.desc"
    :buttonType="modalStore.privacyModal.buttonType"
    :yesTxt="modalStore.privacyModal.yesButtonText"
    :yesFunc="modalStore.privacyModal.yesButtonFunc"
    :noFunc="modalStore.privacyModal.noButtonFunc"
    :backFunc="() => modalStore.privacyModal.hide()"
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

async function setPrivacyModal() {
  modalStore.privacyModal.title = Util.getLocaleTxt(t, "signupform_privacy");
  modalStore.privacyModal.buttonType = "Y";
  modalStore.privacyModal.yesButtonText = Util.getLocaleTxt(
    t,
    "common_confirm"
  );
  modalStore.privacyModal.desc = Util.getLocaleTxt(t, "signupform_no_privacy");
  modalStore.privacyModal.noButtonFunc = () => modalStore.privacyModal.hide();
  modalStore.privacyModal.yesButtonFunc = () => modalStore.privacyModal.hide();

  try {
    // 모든 privacy 가져옴
    const response = await api.management.privacyVersionReadAll({
      ui_lang_code_path: "UI_LANGUAGE/" + appStore.lang,
    });
    if (response.data.objects?.length) {
      const id = response.data.objects[0].id;
      const privacyContents = (await api.management.privacyRead({ id: id }))
        .data.object.privacy_contents;
      modalStore.privacyModal.desc = privacyContents;
    }
  } catch (e) {
    const error = extractError(e);
    console.log(error);
  }
}
setPrivacyModal();
</script>
