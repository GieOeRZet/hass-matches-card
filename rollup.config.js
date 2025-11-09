import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";

export default {
  input: "src/matches-card.js",
  output: {
    file: "matches-card.js",
    format: "es",
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
      exportConditions: ["default", "module", "import"],
      dedupe: ["lit", "lit-html", "lit-element"] // 👈 traktuj lit jako lokalny
    }),
    image(),
    json(),
    terser()
  ],
  // nie wykluczaj niczego z bundla
  external: id => false,
};