import resolve from "@rollup/plugin-node-resolve";
import { terser } from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

export default {
  input: "src/matches-card.js",
  output: {
    file: "matches-card.js",
    format: "es",
    sourcemap: false
  },
  plugins: [
    resolve(),
    json(),
    terser()
  ]
};