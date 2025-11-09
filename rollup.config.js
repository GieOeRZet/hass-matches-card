// rollup.config.js — build scalający kartę + edytor w jeden plik

import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

export default {
  input: ["src/matches-card.js", "src/matches-card-editor.js"],

  output: {
    file: "matches-card.js",
    format: "es",
    sourcemap: false,
  },

  plugins: [
    resolve(),
    json(),
    terser()
  ],

  // 🔹 Ustawienie łączenia wielu entry points w jeden plik
  onwarn(warning, warn) {
    // pomijamy ostrzeżenia o nieużywanych importach
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    if (warning.code === "THIS_IS_UNDEFINED") return;
    warn(warning);
  }
};