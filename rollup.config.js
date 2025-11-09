// rollup.config.js — scalanie karty i edytora w jeden plik

import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

export default {
  input: "src/matches-card.js",        // tylko główny plik
  output: {
    file: "matches-card.js",           // pojedynczy wynikowy plik
    format: "es",
    sourcemap: false,
    inlineDynamicImports: true         // 👈 kluczowa opcja — scala wszystko w jeden plik
  },
  plugins: [
    resolve(),
    json(),
    terser()
  ],
  onwarn(warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    if (warning.code === "THIS_IS_UNDEFINED") return;
    warn(warning);
  }
};