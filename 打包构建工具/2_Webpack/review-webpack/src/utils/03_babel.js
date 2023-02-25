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
// ?在我们开发当中，我们需9.98要把css/less/sass,js/ts/jsx等语言、语法转换为浏览器能够识别的、能够兼容的语法、语法
// ?这个时候对于css的处理，我们可能需要用到postcss后处理器，给css语法添加一些兼容浏览器的前缀：-webkit/-ms等
// ?对于js的处理， 我们可能需要babel帮助我们转换为ES5的代码，ts==>js jsx==>js等
// *但是还需要注意的一个点：我们需要兼容哪些浏览器，浏览器的那些版本，比如:chrome 112版本,edge 110版本,opera浏览器，qq,360浏览器，安卓浏览器等
// *这个时候，我们可以通过这个网址查看我们的浏览器的使用的市场占比：https://caniuse.com/usage-table
// *并且，有些浏览器可能能够使用最新的语法，API等，我们就不要转换，从而提高打包构建速度
// *这个时候，我们可以使用一个工具:browserslist
// todo a.在package.json中以"browserslist":["> 0.02%","last 2 version","not Dead"]来使用
// todo b.在.browserslistrc文件中使用
// ?为什么使用browserslist是因为，可以postcss/babel可以共享这些配置，而不用单独声明postcss/babel的浏览器兼容配置
// ?browserslist的常见配置选项：具体参考https://browsersl.ist/
// * > 0.2% 这种是说明对满足市场占用率大于0.2%的浏览器进行兼容配置，小于0.2%的浏览器就不需要兼容了
// * last 2 versions 这种说明对每种浏览器的最新两个版本进行兼容
// * not dead 意思是对进行维护的浏览器进行兼容，ie如果两年内不维护，那么就不需要就行兼容了
// todo a.defaults:["> 0.02%","last 2 versions","not dead"]
// todo b.> 0.2% in US 可以包括地区配置
// todo c.cover 99.98% 覆盖99.98%的浏览器兼容
// todo d.cover 99.98% in US 包括地区
// todo e.last 2 chrome versions 可以指定浏览器的名称
// todo f.supports es6-module 可以指定支持es6-module的浏览器
// todo g.还可以指定node版本 current node
// todo h.还可以通过运算符:and --并列条件   (or 换行 逗号)--或的条件
// ?在命令行执行npx browserslist就可以看到那些浏览器及其版本需要兼容
// ?它的原理是通过caniuse的一个第三方包去caniuse官网搜索那些浏览器的市场占用率，版本，维护信息等给我们结果

// ?这里还有一种方式去说明浏览器的兼容是通过stage-x的方式去指定 基本已经废弃了
// todo 一共有5个阶段，这里的stage-x的作用是我们ES6+，每个版本新提出的内容的提出阶段
// todo a.stage-0 表示草案阶段(只是个设想)，即比如要提出一个Js类型约束方案，这个阶段只是提出，TC39组织正在考虑要不要出折磨个新内容
// todo b.stage-1  表示提案阶段 这个时候TC39组织考虑将这个类型约束纳入流程
// todo c.stage-2 表示已经有了初步设计方案和实验性内容
// todo d.stage-3 表示已经进入归入ES下一个阶段的计划当中，这个时候要看有没有Bug修复一下，不会再出新的语法
// todo e.stage-4 正式纳入下一个ES+当中，并且不会对其他内容有影响
// *使用方式在babel.config.js的presets中通过"stage-x"的方式表示浏览器兼容那些阶段

// ?还有一个方式是在babel-config.js中通过preset添加targets:{}来指定

// todo 5.polyfill的使用
// *polyfill的中文意思就是填充，打补丁的意思，意思是让填充，补丁的更好
// *在我们前端来讲，通常就是打补丁的意思，意思是让我们对js处理的会更好
// ?为什么这么说呢？
// ?你比如：我们通过babel-loader对new Promise()，或者对'abc'.includes('a')这种语法进行打包的时候
// ?babel认为这是正常的语法啊，并不是ES6+以上的语法，所以不会进行转化
// ?那么这个时候，如果某个浏览器的版本并没有Promise这个构造函数，或者includes()这个函数，那么就会报错
// ?那如果我们想要让这个浏览器的版本有这个Promise()构造函数，我们需要polyfill自己打补丁
// ?相当于在打包的文件中：自己写了一个Promise(),或者String.prototype.includes()语法。这就是打补丁
// todo 怎么使用呢？
// todo a.下载两个npm 工具包core-js 和regenerator-runtime两个就可以了
// todo a.之后在babel-loader的配置文件中通过指定core-js的版本以及useBuiltIns属性来使用

// todo 6.对react jsx的处理
// ?通过babel我们也能实现对react jsx语法==>js,这样那个才能被浏览识别
// ?通过，我们可以通过presets来实现 install @babel/preset-react

// todo 7.对ts的处理
// ?对ts的处理方式有两种，一种是通过ts-loader处理，但是不能被polyfill
// ?另一种方式是通过babel-loader处理，但是不能类型检测
// *所以，在开发中我们通常在生产环境下通过babel-loader处理 以及preset @babel/preset-typescript
// *在build之前通过typescript complier进行ts的类型约束
// *需要在package.json中添加脚本"ts-check":"tsc --noEmit" --noEmit的作用是不提交打包产生的文件
// *或者"ts-check-watch":"tsc --noEmit --watch"  实时监听类型约束
// ?还需要一个tsconfig.json的文件帮助我们说明ts==>js的方式等属性