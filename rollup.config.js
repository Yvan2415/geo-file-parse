import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import json from '@rollup/plugin-json'


export default {
  external: [
    'jszip',
    'shpjs',
    '@mapbox/togeojson'
  ],
  input: './lib/index.js',
  output: {
    file: './dist/index.js',
    format: 'es',
    name: 'fileReader',
    globals: {
      jszip: 'JSZip',
      shpjs: 'shpjs',
      '@mapbox/togeojson': 'toGeoJSON'
    }
  },
  plugins: [
    json(),
    nodeResolve({ browser: true }),
    commonjs(),
    nodePolyfills(),
  ]
}
