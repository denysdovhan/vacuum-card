/*  eslint-env node */
import pkg from './package.json';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import postcssPresetEnv from 'postcss-preset-env';
import postcssLit from 'rollup-plugin-postcss-lit';
import { terser } from 'rollup-plugin-terser';
import minifyLiterals from 'rollup-plugin-minify-html-literals';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';

const IS_DEV = process.env.ROLLUP_WATCH;

const serverOptions = {
  contentBase: ['./dist'],
  host: 'localhost',
  port: 5000,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const plugins = [
  nodeResolve(),
  commonjs(),
  json(),
  replace({
    values: {
      PKG_VERSION_VALUE: IS_DEV ? 'DEVELOPMENT' : pkg.version,
    },
    preventAssignment: true,
  }),
  postcss({
    plugins: [
      postcssPresetEnv({
        stage: 1,
        features: {
          'nesting-rules': true,
        },
      }),
    ],
    extract: false,
  }),
  postcssLit(),
  image(),
  typescript(),
  babel({
    babelHelpers: 'runtime',
    exclude: 'node_modules/**',
  }),
  IS_DEV && serve(serverOptions),
  !IS_DEV && minifyLiterals(),
  !IS_DEV &&
    terser({
      output: {
        comments: false,
      },
    }),
];

export default {
  input: 'src/vacuum-card.ts',
  output: {
    dir: 'dist',
    format: 'es',
    inlineDynamicImports: true,
  },
  context: 'window',
  plugins,
};
