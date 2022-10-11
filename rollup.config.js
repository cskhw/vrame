import { text } from "./build/banner.json";
import packageInfo from "./package.json";

import vue from "rollup-plugin-vue";
import node from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

import fs from "fs";
import path from "path";

const baseFolderPath = "./src/components/";
const banner = text.replace("${version}", packageInfo.version);

const components = fs
  .readdirSync(baseFolderPath)
  .filter((f) => fs.statSync(path.join(baseFolderPath, f)).isDirectory());

const entries = {
  index: "./src/index.ts",
  ...components.reduce((obj, name) => {
    // "-"를 포함한 디렉토리만 컴포넌트 디렉토리임

    if (name.includes("-")) obj[name] = baseFolderPath + name;
    return obj;
  }, {}),
};

console.log(entries);

const babelOptions = {
  babelHelpers: "bundled",
};

const vuePluginConfig = {
  template: {
    isProduction: true,
    compilerOptions: {
      whitespace: "condense",
    },
  },
};

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default () => {
  let config = [
    // First we create an esm build for each component in our library:
    {
      input: entries,
      external: ["vue"],
      output: {
        format: "esm",
        dir: `dist/esm`,
        entryFileNames: "[name].mjs",
        chunkFileNames: "[name]-[hash].mjs",
      },
      plugins: [
        node({
          extensions: [".vue", ".ts"],
        }),
        typescript({
          typescript: require("typescript"),
        }),
        vue(vuePluginConfig),
        babel(babelOptions),
        cjs(),
      ],
    },
    // Next we create a single esm build for all the components:
    {
      input: "src/index.ts",
      external: ["vue"],
      output: {
        format: "esm",
        file: "dist/vrame.mjs",
        banner: banner,
      },
      plugins: [
        node({
          extensions: [".vue", ".ts"],
        }),
        typescript({
          typescript: require("typescript"),
        }),
        vue(vuePluginConfig),
        babel(babelOptions),
        cjs(),
      ],
    },
    // Then we create an cjs build for each component in our library:
    {
      input: entries,
      external: ["vue"],
      output: {
        format: "cjs",
        dir: "dist/cjs",
        exports: "named",
      },
      plugins: [
        node({
          extensions: [".vue", ".ts"],
        }),
        typescript({
          typescript: require("typescript"),
        }),
        vue(vuePluginConfig),
        babel(babelOptions),
        cjs(),
      ],
    },
    // After that, we create a single cjs build for each component in our library
    {
      input: "src/index.ts",
      external: ["vue"],
      output: {
        format: "umd",
        name: capitalize("vrame"),
        file: "dist/vrame.js",
        exports: "named",
        banner: banner,
        globals: {
          vue: "Vue",
        },
      },
      plugins: [
        node({
          extensions: [".vue", ".ts"],
        }),
        typescript({
          typescript: require("typescript"),
        }),
        vue(vuePluginConfig),
        babel(babelOptions),
        cjs(),
      ],
    },
  ];

  if (process.env.MINIFY === "true") {
    config = config.filter((c) => !!c.output.file);
    config.forEach((c) => {
      c.output.file = c.output.file.replace(/.m?js/g, (r) => `.min${r}`);
      c.plugins.push(
        terser({
          output: {
            comments: "/^!/",
          },
        })
      );
    });
  }
  return config;
};
