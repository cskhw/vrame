<template>
  <div
    class="workspace-darkmode-btn d-flex justify-center align-center bg-white"
    @click="onClickDarkmodeBtn"
    :style="{
      cursor: workspaceStore.claimWizardModal.isOpen ? 'unset' : 'pointer',
    }"
  >
    <div
      class="d-flex justify-center align-center"
      :style="{
        width: '1.25rem',
        height: '1.25rem',
        borderRadius: '50%',
        backgroundColor: !modelValue ? '#fdbe2e' : 'white',
        transition: 'all 0.2s ease-in-out',
      }"
    >
      <v-icon
        :color="!modelValue ? 'white' : 'black'"
        :style="{ width: '0.75rem' }"
        :icon="mdiWeatherSunny"
      />
    </div>
    <div
      class="d-flex justify-center align-center"
      :style="{
        width: '1.25rem',
        height: '1.25rem',
        borderRadius: '50%',
        backgroundColor: modelValue ? 'black' : 'white',
        transition: 'all 0.2s ease-in-out',
      }"
    >
      <v-icon
        :color="modelValue ? 'white' : 'black'"
        :style="{ width: '0.75rem' }"
        :icon="mdiWeatherNight"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { mdiWeatherNight, mdiWeatherSunny } from "@mdi/js";
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue?: any;
}>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = ref(props.modelValue);
const workspaceStore = useWorkspaceStore();

function onClickDarkmodeBtn() {
  if (!workspaceStore.claimWizardModal.isOpen) {
    modelValue.value = !modelValue.value;
  }
}

watch(modelValue, (newValue) => {
  if (workspaceStore.claimWizardModal.isOpen)
    emit("update:modelValue", newValue);
});

watch(props, (newValue) => {
  if (workspaceStore.claimWizardModal.isOpen)
    modelValue.value = newValue.modelValue;
});
</script>

<style lang="scss" scoped>
.workspace-darkmode-btn {
  width: 2.625rem;
  height: 1.375rem;
  border-radius: 0.75rem;
  transition: all 1s ease-in-out;
}
</style>
