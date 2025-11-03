import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import serve from "rollup-plugin-serve";

const dev = process.env.ROLLUP_WATCH;

export default {
  input: "src/matches-card.ts",
  output: {
    dir: "dist",
    format: "es",
    inlineDynamicImports: true
  },
  plugins: [
    typescript(),
    nodeResolve(),
    commonjs(),
    babel({
      presets: [["@babel/preset-env", { useBuiltIns: "entry", corejs: "3.22" }]],
      babelHelpers: "bundled"
    }),
    ...(dev
      ? [
          serve({
            contentBase: ["./dist"],
            host: "0.0.0.0",
            port: 5200,
            headers: { "Access-Control-Allow-Origin": "*" }
          })
        ]
      : [terser()])
  ]
};
