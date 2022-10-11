// src/index.ts
import type { App, Plugin } from "vue";

import * as components from "./components";
import type { VrameConfig } from "vrame";

const Vrame = {
  createVrame(vrameConfig: VrameConfig): Plugin {
    return {
      install(app: App) {
        if (vrameConfig.hasOwnProperty("components")) {
          // import user selected components
          for (const componentKey in vrameConfig.components) {
            app.use((components as any)[componentKey]);
          }
        } else {
          // Auto import all components
          for (const componentKey in components) {
            app.use((components as any)[componentKey]);
          }
        }
      },
    };
  },
};

export default Vrame;

// export all components as vue plugin
export * from "./components";
