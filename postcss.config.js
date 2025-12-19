export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // 暂时禁用 postcss-pxtorem，因为它会影响PC端布局
    // 'postcss-pxtorem': {
    //   rootValue: 37.5,
    //   unitPrecision: 5,
    //   propList: ['*'],
    //   selectorBlackList: ['.ant-', '.front-', '.admin-', '.auth-'],
    //   replace: true,
    //   mediaQuery: false,
    //   minPixelValue: 2,
    //   exclude: /node_modules|pc/i
    // }
  }
}