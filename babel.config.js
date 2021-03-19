const ProPlugin = []
if (process.env.NODE_ENV === 'production') {
  ProPlugin.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...ProPlugin,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
