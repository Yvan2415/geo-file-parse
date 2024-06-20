import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'


export default [
  {
    input: './lib/index.js',
    output: {
      file: './dist/index.min.js',
      format: 'iife',
      name: 'fileReader',
    },
    plugins: [
      json(),
      nodeResolve(),
      commonjs(),
      nodePolyfills(),
      terser()
    ]
  }, {
    input: './lib/index.js',
    output: {
      file: './dist/index.js',
      format: 'es'
    },
    external: [
      'jszip',
      'shpjs',
      '@mapbox/togeojson'
    ],
    plugins: [
      json(),
      nodeResolve(),
      commonjs(),
      nodePolyfills(),
    ]
  }
]
