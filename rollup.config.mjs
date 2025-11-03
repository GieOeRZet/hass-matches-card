import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/matches-card.ts",
  output: {
    file: "dist/matches-card.js",
    format: "es",
    sourcemap: true
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: "./tsconfig.json"
    }),
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    terser()
  ]
};
