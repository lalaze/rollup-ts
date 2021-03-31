import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from "@rollup/plugin-commonjs";
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace';
let path = require('path')
const isDev = process.env.BUILD === 'development'

const extensions = [".ts", ".js"];
export default {
  input: 'src/index.ts',
  // input: 'server/main.js',
  // output: {
  //   file: 'dist/index.js',
  //   name: 'index.js',
  //   format: 'umd'
  // },
  output: {
    inlineDynamicImports: true
  },
  plugins: [
    // 替换别名
    alias({
      entries: [
        { find: 'utils', replacement: '../src/utils' },
        { find: 'tests', replacement: '../tests' },
        { find: '@', replacement: path.resolve(__dirname ,'../src') },
      ]
    }),
    // babel把ts也处理了，不用其他ts插件
    babel({ babelHelpers: "bundled", extensions, exclude: 'node_modules/**' }),
    // 加载翻译资源为import的
    resolve({ mainFields: ["module", "main", "browser"], include: ['node_modules/**'] }),
    commonjs({ extensions, sourceMap: true, include: ['node_modules/**', 'src/utils/**','src/packages/**'] }),
    // 修复vue生产错误
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    }),
    !isDev && terser(),
  ]
};