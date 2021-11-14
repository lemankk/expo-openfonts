import {
  createRollupLibraryConfig,
} from "@expo-openfonts-tools/build-config";

const pkg = require("./package.json");

const plugins = [];

export default [
  createRollupLibraryConfig({
    libraryName: pkg.name,
    entry: ["./src/index.ts"],
    plugins,
  }),
];
