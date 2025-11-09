import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";

export default {
  input: "src/matches-card.js",
  output: {
    file: "matches-card.js",      // <- scalony plik w głównym katalogu repo
    format: "es",
  },
  plugins: [
    resolve({
      browser: true,
      exportConditions: ["default", "module", "import"]
    }),
    image(),
    json(),
    terser()
  ],
  // 🔥 Wbuduj wszystkie zależności (w tym "lit") do finalnego pliku
  external: [], 
};