import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import json from '@rollup/plugin-json'


export default {
  external: ['jszip'],
  input: './src/index.js',
  output: {
<<<<<<< HEAD
    file: 'dist/reader.js',
    name: 'fileReader',
    format: 'umd'
  }
}
=======
    file: './dist/index.js',
    format: 'umd',
    name: 'fileReader',
    globals: {
      jszip: 'JSZip'
    }
  },
  plugins: [
    json(),
    nodeResolve(),
    commonjs(),
    nodePolyfills(),
  ]
}
>>>>>>> 2dbd97a382ddd7248691214dbdc4585b18393946
