<template>
  <Editor
    :init="{ ...init, skin: false, content_css: '/tinymce/content.min.css' }"
    v-model="modelValue"
  />
</template>

<script lang="ts" setup>
import "tinymce/tinymce";
import "tinymce/icons/default/icons.min.js";
import "tinymce/plugins/charmap";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/image";
import "tinymce/plugins/lists";
import "tinymce/plugins/paste";
import "tinymce/plugins/preview";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/spellchecker";
import "tinymce/plugins/table";
import "tinymce/plugins/wordcount";
import "tinymce/skins/ui/oxide/content.inline.min.css";
import "tinymce/skins/ui/oxide/content.min.css";
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/ui/oxide/skin.mobile.min.css";
import "tinymce/skins/ui/oxide/skin.shadowdom.min.css";
import "tinymce/themes/mobile";
import "tinymce/themes/silver";
import type { RawEditorSettings } from "tinymce/tinymce";

import Editor from "@tinymce/tinymce-vue";
import { ref, watch } from "vue";

const props = defineProps<{
  init: RawEditorSettings;
  modelValue?: any;
}>();

const emit = defineEmits(["update:modelValue"]);
const modelValue = ref(props.modelValue);

watch(props, () => {
  modelValue.value = props.modelValue;
});

watch(modelValue, () => {
  emit("update:modelValue", modelValue.value);
});
</script>

<style></style>
