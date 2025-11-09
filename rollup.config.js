import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";

export default {
  input: "src/matches-card.js",
  output: {
    file: "matches-card.js",
    format: "es",
    inlineDynamicImports: true
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
      dedupe: ["lit", "lit-html", "lit-element"]
    }),
    commonjs(),
    image(),
    json(),
    terser()
  ]
};