const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const sourceMaps = require("rollup-plugin-sourcemaps");
const json = require("@rollup/plugin-json");
const external = require("rollup-plugin-peer-deps-external");
const typescript = require("rollup-plugin-typescript2");
const camelCase = require("lodash/camelcase");

const fs = require("fs");
const path = require("path");

const defaultGlobals = {
  react: "React",
  "react-native": "ReactNative",
};

function filterExpectedEntryFileName(name) {
  if (name.startsWith(".")) {
    return false;
  }
  if (name.endsWith(".ts") && !name.endsWith(".d.ts")) {
    return true;
  }
  if (name.endsWith(".js")) {
    return true;
  }
  return false;
}

function packageBasedSourcemapPathTransform(packageName, relativeSourcePath) {
  const output = String(relativeSourcePath).replace(
    /\.\.\/(src|gen|node_modules)/g,
    `${packageName}/$1`
  );
  return output;
}

function createRollupLibraryConfig({
  libraryName,
  entry,
  entryRootPath: rootPath,
  globals = defaultGlobals,
  typescriptConfig = {
    useTsconfigDeclarationDir: true,
  },
  sourcemap = true,
  plugins = [],
  outputs = {
    commonjs: {
      dir: "lib/commonjs/",
      exports: "named",
    },
    esm: {
      dir: "lib/es/",
      exports: "named",
    },
  },
}) {
  const sourcemapPathTransform = (relativeSourcePath, sourcemapPath) =>
    packageBasedSourcemapPathTransform(
      libraryName,
      relativeSourcePath,
      sourcemapPath
    );

  const defaultPlugins = [
    // Allow json resolution
    json(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    nodeResolve(),

    external(),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Compile TypeScript files
    typescript(typescriptConfig),

    // Resolve source maps to the original source
    sourceMaps(),
  ];

  let _entry = entry;

  // Replace a list of files instead of single entry
  if (rootPath) {
    const rootDirectory = path.join(process.cwd(), rootPath);
    _entry = fs
      .readdirSync(rootDirectory)
      .filter(filterExpectedEntryFileName)
      .map((name) => path.join(rootPath, name));
  }

  const rollupConfig = {
    input: _entry,
    output: [
      outputs.commonjs && {
        ...outputs.commonjs,
        name: libraryName,
        format: "commonjs",
        sourcemap,
        sourcemapPathTransform,
        globals,
      },
      outputs.esm && {
        ...outputs.esm,
        format: "esm",
        sourcemap,
        sourcemapPathTransform,
        globals,
      },
    ],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
      include: "src/**",
    },
    plugins:
      plugins &&
      (typeof plugins === "function"
        ? plugins(defaultPlugins)
        : [...defaultPlugins, ...plugins]),
  };
  return rollupConfig;
}

module.exports = {
  createRollupLibraryConfig,
};
