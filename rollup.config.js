import typescript from 'rollup-plugin-typescript2'

export default {
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'esm'
  },
  plugins: [
    typescript({
      'clean': true,
      'tsconfigOverride': {
        compilerOptions: {
          module: 'ES2015',
          declaration: true
        }
      }
    })
  ]
}