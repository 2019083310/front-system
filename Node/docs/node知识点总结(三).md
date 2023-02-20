# node重要知识点总结(三)

### 服务端渲染与客户端渲染

1.介绍

​	我们从浏览器发起请求到页面显示的过程，有两种方式显示页面。

​	分别是：server side render(SSR)--服务端渲染

​					client side render(CSR)--客户端渲染

​	服务端渲染的结果返回给我们一个页面，浏览器直接就可以显示，这样的访问方式得到的页面时间很短，费很快就可以显示整个界面，但是这样方式后端人员的工作量就非常大了，前端人员只需要提供一个模板就可以了，这种是服务端渲染，node.js就可以通过RMVP的模型架构做出一个网站。

​	客户端渲染是向服务器发送一个请求，得到的是数据对象，我们在前端通过ajax请求得到数据源之后通过，再通过模板引擎把数据添加到对应的模板上面，最后浏览器解析就渲染出了整个页面，这就是客户端渲染，这种前后端分离的模式是很高效快速的。

2.实现过程

服务端渲染

```javascript
	服务端渲染通过MVP模式就可以制作出一个网站，其中模板引擎使用的是art-template,这个模板既支持服务端也支持客户端，是现在的流行模板引擎。
	服务端在前后端分离之后，要做的就是给我们提供数据请求，修改，删除，添加的接口，实现对数据的获取更新操作，这只是表面上的理解，实际上服务端要做的不仅仅是这些，还有很多重要的，比如数据的缓存，高并发的实现，等等很多细节。
```

客户端渲染

```javascript
	客户端要做的就是通过模板比如art-template/vue/react/ejs等等，把页面结构搭建好，然后通过网络请求向服务器发送一系列的数据请求比如get/post/delete/put/patch等等对数据增删改查实现页面的变化和数据库的存储，这样把从服务器请求来的数据在通过模板特定的语法放到特定的位置上，这样我们访问的页面就达到了我们想要的目的，当然，在这个过程中我们可能还需要实现很多细节，比如数据的加密，cookie/serssion/token的携带对用户的访问进行控制以及sql的CRUD，还有比如一些访问速度的优化，项目结构的优化，代码的复用性，bug的调试等等操作，这些在前后端分离之后，就交给我们前端人员来做了，这样大大提高了项目的开发速度和效率。
	当然上面这些是介绍一下前端项目大开发思路，所谓的客户端渲染指的就是，遇到ajax网络请求，想服务器发送请求的得到的数据通过模板引擎的渲染，对页面实现无需刷新的页面更新效果。
```

### art-template模板的使用

- 1.基本介绍

  - art-template是一个简约，超快的模板引擎。同时支持NodeJs和浏览器。
  - 特性
    - 支持express、koa、webpack
    - 支持模板继承与子模板
    - 浏览器版本仅6kb
    - 拥有接近javascript渲染极限的性能
    - 调试友好：运行错误是日志精确到模板所在行，支持断点调试
  - 渲染模板
    - 基于模板名渲染模板---template(filename,data)
    - 将模板编译成函数并立即执行---template.render(source,data,options)
  - 使用:
    - webpack中：npm install art-template --save-D       npm install art-template-loader --save-D
    - express中：npm install art-template --save-D       npm install express-art-template --save-D

- 2.语法--下面介绍的都是标准语法

  - 输出

    ```javascript
    {{value}}
    {{data.key}}
    {{a+b}} 
    {{a||b}} 
    {{data['key']}} 
    {{a?b:c}}
    ```

  - 条件判断

    ```javascript
    {{if value}}...{{/if}}
      
    {{if v1}}...{{else if v2}}...{{/if}}
    ```

  - 循环

    ```javascript
    {{each target}}
    	{{$index}}  {{$value}}
    {{/each}}
    //target支持对象与数组
    ```

  - 变量

    ```javascript
    {{set temp=data.sub.content}}
    ```

  - 模板继承(相当于插槽)

    ```javascript
    {{extend '模板位置'}}
    {{block 'title'}}...{{/block}}
    {{block 'head'}}...{{/block}}
    {{block 'body'}}...{{/block}}
    {{block 'script'}}...{{/block}}
    ```

  - 子模板

    ```javascript
    {{include '路径'}}
    {{include '路径' data}}
    ```

  - 过滤器

    ```javascript
    注册过滤器:
    template.defaults.imports.dateFormat=function(date,format){code}
    template.defaults.imports.timestamp = function(value){return value * 1000}
    {{data | timestamp | dateFormat 'yyyy-MM-dd hh:mm:ss'}}
    ```

- 3.调试

  - art-template 内建调试器，能够捕获到语法与运行错误，并且支持自定义的语法。在 NodeJS 中调试模式会根据环境变量自动开启：`process.env.NODE_ENV !== 'production'`

    设置 `template.defaults.debug=true` 后，等同于：

    ```javascript
    {
        "cache": false,
        "minimize": false,
        "compileDebug": true
    }
    ```

- 4.压缩页面

  - art-template 内建的压缩器可以压缩 HTML、JS、CSS，它在编译阶段运行，因此完全不影响渲染速度，并且能够加快网络传输。

    ## 开启

    ```
    template.defaults.minimize = true;
    ```

    ## 配置

    参见：https://github.com/kangax/html-minifier

    **默认配置**

    ```javascript
    template.defaults.htmlMinifierOptions = {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        // 运行时自动合并：rules.map(rule => rule.test)
        ignoreCustomFragments: []
    };
    ```
