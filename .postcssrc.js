module.exports = {
  plugins: {
    // autoprefixer: {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },

    // 配置使用postcss-pxtorem插件， 作用把px转为rem
    'postcss-pxtorem': {
      // rootValue: 37.5,
      rootValue({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*'],

      // 配置不要转换的样式资源
      exclude: 'github-markdown'
    }
  }
}
