<template>
  <!-- 체험용 에디터 -->
  <Editor
    :init="{
      ...tinymceConfig,
      skin: false,
      content_css: '/tinymce/content.min.css',
      setup: editorSetup,
    }"
    style="  
        border: '0.0625rem solid #dfdfdf',
        height: 100%
      "
  />
</template>

<script lang="ts" setup>
import "tinymce/tinymce";
import "tinymce/icons/default/icons.min.js";
import "tinymce/plugins/charmap";
import "tinymce/plugins/image";
import "tinymce/plugins/lists";
import "tinymce/plugins/paste";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/spellchecker";
import "tinymce/plugins/table";
import "tinymce/plugins/hr";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/preview";
import "tinymce/plugins/fullscreen";
import "tinymce/themes/mobile";
import "tinymce/themes/silver";
import type { Editor as EditorType, RawEditorSettings } from "tinymce/tinymce";

import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import Editor from "@tinymce/tinymce-vue";

function editorSetup(editor: EditorType) {
  // init에 setup으로 지정해둔게 있으면, 실행함
  addCustomToolbar(editor);
}

function addCustomToolbar(editor: EditorType) {
  editor.ui.registry.addButton("settextindentzero", {
    icon: "chevron-left",
    onAction: function () {
      const node = editor.selection.getNode() as HTMLElement;
      node.style.textIndent = "0rem";
    },
  });
  editor.ui.registry.addButton("settextindent", {
    icon: "chevron-right",
    onAction: function () {
      const node = editor.selection.getNode() as HTMLElement;
      node.style.textIndent = "2rem";
    },
  });
  editor.ui.registry.addButton("custompreview", {
    icon: "preview",
    onAction: () => {
      if (editor.execCommand("mcePreview") && stores.ts.isDarkmode) {
        const previewContent: HTMLElement = document.getElementsByClassName(
          "tox-dialog__body-content"
        )[0] as HTMLElement;
        // 프리뷰 배경색 설정
        previewContent.style.backgroundColor = "#1e1e1e";
        const previewIframe = previewContent.querySelector("iframe");
        let srcdoc = previewIframe?.getAttribute("srcdoc");
        // 프리뷰 body에 css 삽입
        const targetStr = "body {";
        const replaceStr = "body{ color: white;";
        srcdoc = srcdoc?.replace(targetStr, replaceStr);
        if (srcdoc) previewIframe?.setAttribute("srcdoc", srcdoc);
      }
    },
  });
}

const appStore = useAppStore();
const userStore = useUserStore();
const modalStore = useModalStore();
const i18nStore = useI18NStore();
const themeStore = useThemeStore();
const workspaceStore = useWorkspaceStore();

const stores = {
  as: appStore,
  us: userStore,
  ms: modalStore,
  is: i18nStore,
  ts: themeStore,
  ws: workspaceStore,
};

const tinymceConfig = {
  plugins:
    "paste wordcount spellchecker image charmap searchreplace table image lists hr fullscreen preview",
  external_plugins: {
    tiny_mce_wiris: `/wiris/mathtype-tinymce5/plugin.min.js`,
  },
  menubar: false,
  toolbar: `undo redo | bold italic underline strikethrough subscript superscript removeformat`,
  toolbar_mode: "sliding",
  draggable_modal: true,
  paste_data_images: true,
  content_style: `
        ::-webkit-scrollbar {
          width: 0.375rem;
          cursor: pointer;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #c8c9cf;
          border-radius: 0.625rem;
          background-clip: padding-box;
        }
        ::-webkit-scrollbar-track {
          border-radius: 0.625rem;
          background: transparent !important;
        }
        html{
          overflow: overlay;
        }
        body {
          margin: 1rem;
        }
        p { margin: 0; text-align: justify;}
        `,
  elementpath: false,
  branding: false,
  resize: false,
};
</script>
