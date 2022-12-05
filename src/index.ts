// src/index.ts
import type { App, Plugin } from "vue";

import * as _components from "./components";
import type { VrameConfig } from "vrame";

import _RAppbar from "./components/RAppbar/RAppbar.vue";
import _RDrawer from "./components/RDrawer/RDrawer.vue";
import _RMain from "./components/RMain/RMain.vue";
import _RIcon from "./components/RIcon/RIcon.vue";
import _RList from "./components/RList/RList.vue";
import _RSelect from "./components/RSelect/RSelect.vue";
import _RBtn from "./components/RBtn/RBtn.vue";
import _RTable from "./components/RTable/RTable.vue";
import _RSearchbar from "./components/RSearchbar/RSearchbar.vue";
import _RCheckbox from "./components/RCheckbox/RCheckbox.vue";
import _RTextfield from "./components/RTextfield/RTextfield.vue";

import "@/styles/main.scss";

export const components = _components;

// export each component
export const RAppbar = _RAppbar;
export const RDrawer = _RDrawer;
export const RMain = _RMain;
export const RIcon = _RIcon;
export const RList = _RList;
export const RSelect = _RSelect;
export const RBtn = _RBtn;
export const RTable = _RTable;
export const RSearchbar = _RSearchbar;
export const RCheckbox = _RCheckbox;
export const RTextfield = _RTextfield;

export function createVrame(vrameConfig?: VrameConfig): Plugin {
  return {
    install(app: App) {
      if (vrameConfig?.hasOwnProperty("components")) {
        // import user selected components
        for (const componentKey in vrameConfig.components) {
          app.use((vrameConfig.components as any)[componentKey]);
        }
      } else {
        // Auto import all components
        for (const componentKey in _components) {
          app.use((_components as any)[componentKey]);
        }
      }

      // insert style to library's head
      // const vrameStyle = document.createElement("style");
      // vrameStyle.setAttribute("type", "text/css");
      // vrameStyle.innerHTML = style;
      // document.head.appendChild(vrameStyle);
      // testB
      // testmain
    },
  };
}

// export vrame plugin, components
const Vrame = {
  createVrame: createVrame,
  components: components,
};

export default Vrame;

// export all components as vue plugin
export * from "./components";
