import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/esm/index.js',
    plugins: [resolve()],
    output: {
      file: 'dist/date-wrapper.cjs.js',
      format: 'cjs'
    },
  },
  {
    input: 'src/esm/index.js',
    plugins: [resolve(), terser()],
    output: {
      file: 'dist/date-wrapper.cjs.min.js',
      format: 'cjs'
    },
  },
  {
    input: 'src/esm/index.js',
    output: {
      file: 'dist/date-wrapper.esm.js',
      format: 'esm'
    }
  },
  {
    input: 'src/esm/index.js',
    plugins: [terser()],
    output: {
      file: 'dist/date-wrapper.esm.min.js',
      format: 'esm',
    }
  },
  {
    input: 'src/esm/index.js',
    output: {
      file: 'dist/date-wrapper.umd.js',
      format: 'umd',
      name: 'dateWrapper'
    }
  }, 
  {
    input: 'src/esm/index.js',
    plugins: [terser()],
    output: {
      file: 'dist/date-wrapper.umd.min.js',
      format: 'umd',
      name: 'dateWrapper'
    }
  },
  {
    input: 'src/esm/index.js',
    output: {
      file: 'dist/date-wrapper.iife.js',
      format: 'iife',
      name: 'dateWrapper'
    }
  }, 
  {
    input: 'src/esm/index.js',
    plugins: [terser()],
    output: {
      file: 'dist/date-wrapper.iife.min.js',
      format: 'iife',
      name: 'dateWrapper'
    }
  } 
];