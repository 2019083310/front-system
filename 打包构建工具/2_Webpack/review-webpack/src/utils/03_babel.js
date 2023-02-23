// ?babel是我们前端开发必不可少的工具之一，虽然我们不会直接接触，但是无时无刻在用到这个工具
// ?babel可以对ES6+以上的js语法，以及对react代码进行转化，对ts代码转化为js代码，并且都会转化为ES5的Js语法
// ?以此，做到浏览器兼容处理

// todo 1.babel的使用之命令行
// *若要使用babel命令行需要提前安装@babel/core babel的核心 和@babel/cli可以在命令行使用
// *使用方式:npx 执行node_modules目录下的./bin文件夹下的babel
// *执行命令:npx babel 源文件(可以是整个目录) --out-dir(这个的作用是输出到那个目录) 输出目录
// ?但是会发现ES6+以上的代码还没有转化为ES5,这是因为babel在进行完编译之后没有插件处理，所以不会任何转化
// ?比如要处理箭头函数或者let/const语法，需要安装：@babel/plugin-transform-arrow-functions @babel/plugin-transform-block-scoping
// ?然后使用命令 npx babel 源文件 --out-dir 目标目录 --plugins=插件,插件

// ?但是我们会发现使用多个插件太麻烦了，所以还为我们提供了集成这些功能的预设 @babel/preset-env
// *通过 --presets=@babel/preset-env来使用

// todo 2.babel的原理
// ?babel其实就是一个工具帮助我们把源代码(某种语言)转换成目标代码(另一种语言)
// ?那么babel是怎么处理的呢，其实就是三个步骤
// *a.把代码转化为AST树（babel解析阶段）
// *b.对AST做处理通过插件(babel处理阶段)
// *c.把处理后的代码转化成新的AST树（babel的生成阶段）
// ?经过以上三个步骤，就可以达成我们想要的目的
// ?更加详细的步骤大致是：
// *源代码==>词法解析==>token数组==>语法解析==>AST树==>遍历==>插件处理==>转化为新的AST树==>生成目标代码

// todo 3.babel-loader的使用
// ?在webpack中我们对js/ts/react代码进行处理，webpack除了js文件并不识别其它文件，所以我们要用babel-loader来识别这些文件
// ?并且ES6+以上的语法需要做浏览器的兼容配置，那么在webpack中我们借助babel-loader来实现我们的目的
// ?并且我们可以通过预设来做处理，有两种配置文件的写法:babel.config.js(json,.mjs)，.babelrc.json(js,mjs)这两种写法
// *第一种是我们现在经常采用的写法，通过module.exports={presets:[require('@babel/preset-env)]}来使用
// *第二种是以前采用的写法，在vue2项目中是可以见到的,rc--runtime compiler 运行时解析

// todo 4.浏览器的兼容性

