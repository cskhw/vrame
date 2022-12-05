import path from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

import packageJson from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": `${path.resolve(__dirname, "src")}`,
    },
  },
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  // build vrame
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "vrame",
      fileName: (format) => `vrame.${format}.js`,
    },
    rollupOptions: {
      input: "./src/index.ts",
      external: ["vue", "vue-router"],
      output: {
        globals: {
          vue: "Vue",
          vueRouter: "vueRouter",
        },
        exports: "named",
        banner: "/* vrame v" + packageJson.version + "-alpha*/",
        sourcemap: true,
      },
    },
  },
});
