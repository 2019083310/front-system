// ?webpack提供给我们一个devtool属性，值有很多 26个，具体见官网:并且不同的值使用在不同的环境下是有约束的
// !不同的值，对webpack的打包性能也是有影响的
// ?常见的值大概有下面几个
// *1.false  通常在生产环境下使用
// *2.none  通常在生产环境下使用，不过当mode='production'时，不能声明devtool='none'，否则会报错
// *3.source-map  通常在生产环境下使用，生产一个单独的map文件，错误精确到行列
// *4.eval-source-map 通常在开发环境下使用，生成Data_URL在打包的文件的eval()后面，即还原源代码 精确到行列  
// *5.eval 通常用在开发环境,成一个相应的source-map在打包文件的内容，用eval()包裹source-map,每一个引用的文件，用eval包裹
// *6.inline-source-map 通常用在开发环境，会生成source-map的Data_URL在打包文件的末尾，精确到行列错误
// *7.hidden-source-map 通常用在生产环境，会生成单独的source-map文件，但在打包文件不会自动引用，如果要使用需要我们自己引入通过注释
// *8.cheap-source-map cheap表示高效的，原因是因为生成的source-map文件只对错误精确到行，而不会到列
// *9.nosources-source-map 通常用在生产环境，表示不生成source-map文件，但是可以对行列错误进行捕捉
// *10.cheap-module-source-map 表示对loader处理的文件有更好的处理，比如：babel-loader处理过的文件对源文件就会转化，去掉空格，用这个类型可以还原原文件

// todo 我们source-map的使用步骤是：
// todo 1.首先要通过devtool指定source-map类型
// todo 2.然后在我们打包生成的压缩，经过Babel处理，丑化后的Bundle.js中最后一行添加一行注释://# sourceMappingURL=bundle.js.map
// todo 3.还必须在我们的浏览器中开启source-map选项才可以使用source-map调试(开发调试面板设置-perferences中的source中，禁用不可以使用map调试)

// ?注释的作用是当浏览器下载解析压缩丑化后的js文件时，解析到这行代码后，浏览器就知道这个压缩文件的源文件地址，并把map文件下载到
// ?浏览器本地，这样当我们的代码出错的时候就会映射到原文件中，告诉我们出错的具体位置(行，列)

// !需要注意的是webpack的map映射是有助于开发调试的，Map文件其实就是一个json文件，现在的版本是3，大小优化成现在原文件的2-3倍之间
// !里面有我们的源文件的内容，当被我们浏览器下载的时候，就会在调试面板的source下面发现我们的源代码
// !这样就会造成代码泄露，所以，在生产环境下关闭devtool=false,或者设置为hidden-source-map/nosource-source-map