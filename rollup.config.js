import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import json from '@rollup/plugin-json';

const dev = process.env.ROLLUP_WATCH;

const serveopts = {
  contentBase: ['./dist'],
  host: 'localhost',
  port: 5001,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const plugins = [
  nodeResolve({}),
  commonjs(),
  typescript(),
  json(),
  babel({
    exclude: 'node_modules/**',
  }),
  dev && serve(serveopts),
  !dev && terser(),
];

export default [
  {
    input: 'src/main.ts',
    output: {
      file: 'dist/flipclock-card-bundle.js',
      format: 'es',
      name: 'FlipClockCard',
    },
    plugins: [...plugins],
  },
];
