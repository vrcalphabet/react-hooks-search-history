import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    main: "src/main.ts",
  },
  // minify: true,
  dts: true,
  // logLevel: "silent",
  deps: {
    neverBundle: true,
  },
});
