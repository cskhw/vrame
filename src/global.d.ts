/// <reference types="vite/client" />
declare module "@vue/runtime-dom" {
  export interface HTMLAttributes {
    // $children?: VNodeChild
  }
  export interface SVGAttributes {
    // $children?: VNodeChild
  }
}

declare module "@vue/runtime-core" {
  interface Vrame {
    defaults: DefaultsInstance;
    display: DisplayInstance;
    theme: ThemeInstance;
    icons: IconOptions;
    locale: LocaleAdapter;
    rtl: RtlInstance;
  }

  export interface ComponentCustomProperties {
    $vrame: Vrame;
  }

  export interface GlobalComponents {
    RAppbar: typeof import("../src/index")["RAppbar"];
    RDrawer: typeof import("../src/index")["RDrawer"];
    RTable: typeof import("../src/index")["RTable"];
    RBtn: typeof import("../src/index")["RBtn"];
  }
}
