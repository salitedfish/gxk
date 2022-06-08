import path from "path";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import rollupJSON from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import { eslint } from "rollup-plugin-eslint";
import babel from "@rollup/plugin-babel";
import genPackageJson from "rollup-plugin-generate-package-json";
import packageJSON from "./package.json";

const getPath = (_path) => path.resolve(__dirname, _path);

const tsPlugin = typescript({
  tsconfig: "tsconfig.json",
  extensions: [".ts", ".js"],
});

const esPlugin = eslint({
  typescript: require("ttypescript"),
  throwOnError: true,
  include: ["src/**/*.ts", "type/**/*.d.ts"],
  exclude: ["node_modules/**"],
});

const babelPlugin = babel({
  exclude: "node_modules/**",
  babelHelpers: "bundled",
  extensions: [".ts", ".js"],
});

const packageJsonPlugin = genPackageJson({
  outputFolder: "lib",
  baseContents: () => ({
    name: packageJSON.name,
    version: packageJSON.version,
    license: "MIT",
    main: "index.js",
    typings: "index.d.ts",
    dependencies: packageJSON.dependencies,
  }),
});

export default {
  /**打包入口 */
  input: getPath("./src/index.ts"),
  /**排除外部引入的包 */
  external: ["axios"],
  plugins: [nodeResolve({}), esPlugin, rollupJSON(), tsPlugin, babelPlugin, commonjs(), packageJsonPlugin],
  /**同时支持ESModule和commonjs导出 */
  output: [
    { file: packageJSON.module, format: "esm", name: packageJSON.name },
    { file: packageJSON.main, format: "cjs", name: packageJSON.name },
  ],
};