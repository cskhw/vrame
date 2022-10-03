<template>
  <div
    class="layouts"
    draggable="true"
    @dragstart="dragStart($event)"
    @dragend="dragEnd($event)"
  >
    <div
      class="d-flex align-center justify-center text-400-12-gray"
      style="width: 100%; height: 100%"
    >
      <div class="layouts-header">
        {{ setupAreaTitle(id) }}
      </div>
      {{ setupAreaTitle(id) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import useWorkspaceStore from "@/store/useWorkspaceStore";
import * as Util from "@/assets/javascripts/ipedit_util";
import { ref, watch } from "vue";

// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";

const props = defineProps<{
  modelValue: boolean;
  id: string;
}>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = ref(props.modelValue);

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

// 스위치 텍스트 셋업
function setupAreaTitle(id: string) {
  if (id === "element") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/TITLE");
  } else if (id === "basic") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/TITLE");
  } else if (id === "claim") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/TITLE");
  } else if (id === "description") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/DETAILED_DESCRIPTION/TITLE");
    // TODO: main 화면에서 케이스 데이터 없을 때 workspaceStore.caseMasterData.work_type_code_path가
    // undefined이므로 추가적인 처리가 필요함
    // if (Util.isSplitLayout(stores))
    //   return Util.getI18NTxt(
    //     stores,
    //     "I18N/WORKSPACE/DETAILED_DESCRIPTION/TITLE"
    //   );
    // else
    //   return Util.getI18NTxt(
    //     stores,
    //     workspaceStore.caseMasterData.work_type_code_path,
    //     "setting_titles"
    //   );
  } else if (id === "drawing") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/DRAWINGS/TITLE");
  } else if (id === "structure") {
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/STRUCTURE/TITLE");
  }
}

// 드래그 구현부
function dragStart(e: DragEvent) {
  // props에 watch 붙어 있는게 정상 작동 안해서 강제로 드래그 시작 시 false됨
  modelValue.value = false;
  workspaceStore.areaDragStart(e);
}

function dragEnd(e: DragEvent) {
  workspaceStore.areaDragEnd(e);
  modelValue.value = true;
}

// props가 바뀔 때(부모에서 값이 바뀔 때)
watch(props, () => {
  modelValue.value = props.modelValue;
});

// modelValue가 바뀔 때(컴포넌트 내부에서 값이 바뀔 때)
watch(modelValue, () => {
  emit("update:modelValue", modelValue.value);
});
</script>

<style scoped lang="scss">
.layouts {
  height: 100%;
  background-color: #eeeeee;
  position: relative;
  .layouts-header {
    position: absolute;
    height: 1.3125rem;
    top: 0.0625rem;
    padding-bottom: 0.125rem;
    border-bottom: 0.0625rem solid #bdbdbd;
    text-align: center;
    width: 100%;
    font-weight: bold;
  }
  .basics-body {
    height: 100%;
    .basics-header {
      font-size: 0.75rem;
      text-align: center;
      background-color: #eeeeee;
      border: 0.0625rem solid #bdbdbd;

      margin-bottom: 0.25rem;
      height: 1.5rem;
    }
    .basics-draggable {
      height: calc(100% - 1.75rem);
      gap: 0.25rem;
    }
    .basic-card {
      border: 0.0625rem solid #bdbdbd;
      height: 100%;
    }
  }
}
</style>
