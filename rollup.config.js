import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import json from '@rollup/plugin-json'


export default {
  input: './lib/index.js',
  output: {
    file: './dist/index.js',
    format: 'umd',
    name: 'fileReader',
  },
  plugins: [
    json(),
    nodeResolve(),
    commonjs(),
    nodePolyfills(),
  ]
}
