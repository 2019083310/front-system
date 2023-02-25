module.exports = {
  // ?可以指定插件
  plugins: [
    // '@babel/plugin-transform-arrow-functions'
  ],
  // ?可以指定预设
  presets: [
    // ?官网在引入语法的时候，不需要require()，我们也可以不使用
    ['@babel/preset-env',
      {
        "corejs": 3,
        // todo false 表示不适用polyfill,为false的时候不要指定corejs的版本
        // useBuiltIns:false
        // todo usage 表示对一些打包语法进行polyfill
        // useBuiltIns:'usage'
        // todo entry 表示对入口文件也要进行polyfill，这种通常是因为我们没有对node_modules进行babel处理，所以可能我们引入的第三方库使用了一些API，所以也需要对第三方库进行polyfill，使用entry
        "useBuiltIns": 'entry',
        // targets:{"last 2 versions"}
      },
      // ?这种方案基本已经废弃了
      // "stage-x"
    ],
    ['@babel/preset-react', {
      // ?这行代码是必须的，否则会报错
      "runtime": "automatic"
    }],
    ["@babel/preset-typescript", {
      "corejs": 3,
      "useBuiltIns": 'entry'
    }]
  ]
}