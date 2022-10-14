import { createWebHistory } from "vue-router";
// src/index.ts
import type { App, Plugin } from "vue";

import * as _components from "./components";
import type { VrameConfig } from "vrame";
import { useRouter, useRoute, createRouter } from "vue-router";

// import router from "vue-router";

import _RAppbar from "./components/r-appbar";
import _RDrawer from "./components/r-drawer";
import _RMain from "./components/r-main";
import _RIcon from "./components/r-icon";
import _RList from "./components/r-list";
import _RSelect from "./components/r-select";
import _RBtn from "./components/r-btn";
import _RTable from "./components/r-table";

import "@/styles/main.scss";

import style from "../dist/style.css";

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
      const vrameStyle = document.createElement("style");
      vrameStyle.setAttribute("type", "text/css");
      vrameStyle.innerHTML = style;
      document.head.appendChild(vrameStyle);
    },
  };
}

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

const Vrame = {
  createVrame: createVrame,
  components: components,
};

export default Vrame;

// export all components as vue plugin
export * from "./components";
