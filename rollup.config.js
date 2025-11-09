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
    resolve(),
    image(), // inline PNG/SVG
    json(),  // inline translations
    terser()
  ],
};
