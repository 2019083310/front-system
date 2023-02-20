# Vue重要知识点总结(三)

### 一、Vue CLI详解

1.CLI--Command-Line Interface翻译为命令行界面，但是促成脚手架，Vue CLI 是一个官方发布的Vue.js项目脚手架，使用vue-cli可以快速搭建Vue环境以及webpack配置。

​	使用CLI的前提--Node，npm，webpack的全局安装

2.CLI的使用

vue-cli2的初始化方式:vue init webpack 项目名

vue-cli3/cli4的初始化方式:vue ui或者Vue create 项目名

3.vue-cli2目录详解

![img](https://img-blog.csdnimg.cn/20210725145720505.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIzMDczODEx,size_16,color_FFFFFF,t_70)

4.vue-cli3目录详解

![img](https://img-blog.csdnimg.cn/20210725151542584.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIzMDczODEx,size_16,color_FFFFFF,t_70)

### 二、Vue-router

1.认识路由

路由（routing就是通过互联的网络把信息从源地址传输到目的地址的活动. --- 维基百科

2.vue-router的基本使用

```javascript
首先安装vue-router.npm install vue-router --save
然后引入vue-router.const VueRouter=require('vue-router')
使用:Vue.use(VueRouter)
	routes:[
        {
            path:'/',
            compontent:Home
        }
    ]
	const router=new VueRouter({
        routes,
        mode:'history'
    })
    路由跳转的内容是Vue的内置组件<router-view />显示
最后要把路由挂载到main.js中
```

3.vue-router嵌套路由

```javasc
routes:[
        {
            path:'/',
            compontent:Home
        },
        {
        	path:'/home',//在index组建中添加相应的<router-view />即可
        	compomtent:Index,
        	children:[
        		{
        			path:'/about',
        			compontent:About
        		}
        	]
        }
    ]
	const router=new VueRouter({
        routes,
        mode:'history'
    })

```

4.vue-router参数传递

```javascript
有两种类型：params和query
params:---->配置路由的方式:/router/:id;
			this.$router.push('/router/'+this.$route.params.id)
			通过this.$route(表示当前活跃的路由对象)可以获取到meta,params,path,query等//this.$router为VueRouter实例
			传递后形成的路径:/router/id
query:---->配置路由的方式:/router,也就是普通的方式
			传递方式:this.$router.push({
                path:'/router',
                query:{}
            })
			传递后形成的路径:/router?参数
```

5.vue-router导航守卫

```javascript
导航守卫：
	vue-router提供的导航守卫主要是用来监听路由的进入和离开
	1.全局前置导航和全局后置导航(钩子函数):
    	router.beforeEach((to,from,next)=>{
            //做的一些处理,比如改变网页标题,可以用meta设置元数据
            window.document.title=to.meta.title
            next()
        })
		参数解析：
        	to:即将要进入的目标的路由对象
            from:当前导航即将要离开的路由对象
            next：调用该方法后，才能进入下一个钩子
		router.afterEach((to,from)=>{
            //后置钩子不需要主动调next()函数
        })
	2.路由独享的守卫
    	const routes=[
            {
                path:'/home',
                component:Home,
                meta:{
                    title:'主页'
                },
                beforeEnter:(to,from,next)=>{
                    next()
                }
            }
        ]
	3.组件内的守卫：(beforeRouterEnter,beforeRouterUpdate,beforeRouterLeave)
		beforeRouterEnter(to,from,next){
            next()
        }
```

6.keep-alive

```javascript
	我们想要保持页面跳转又跳转回来的位置，这个时候就用到了vue的内置组件
    	<keep-alive><router-view /></keep-alive>
	这样就可以使离开组件的时候组件不会被销毁，再重新跳转回来的时候就可以保持原来的状态,它有两个属性include和exclude,可以传字符串或正则表达式,表示是否保持keep-alive的组件
```

7.路由懒加载

```javascript
	当我们打包项目部署到服务器时，JavaScript包会变得很大，影响页面加载，有可能就会出现页面白屏的结果，怎么解决呢？
    我们可以把不同的路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应的组件，这样就高效了-->这就是路由的懒加载
	方式一：
    	es6写法：const Home=()=>{import('组件路径')}
    方式二：
    	AMD写法：const Home=resolve=>require(['组件路径'],resolve)
```

8.HTML5的history模式

```javascript
   vue-router默认hash模式-->使用URL的hash，锚点(#),本质上是改变window.localtion的href属性,我们可以直接赋值localtion.href来改变href，但是页面不刷新。
	如果不想要很丑的hash，我们可以用路由的history模式，这种充分利history.pushStateAPI
来完成URL跳转无需重新加载页面。-->mode:'history'
	history.back()===history.go(-1)-->向后跳转
	history.go(1)===history.forword()-->向前跳转
	history.go(0)-->当前页面
	history.pushState()-->三个参数,第一个参数对象可以是空的,第二个参数可以是空的字符串,第三个参数是要跳转的原路径后面的内容（字符串）/foo/bar
	history.replaceState()-->同上
```

### 三、Vuex详解

```javascript
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式.Vuex的store状态的更新唯一方式：提交Mutation
Vuex的五个核心：
	state-->单一状态树(单一数据源),说白了就是把数据都放在唯一的state里面
	mutations-->store状态改变的唯一方式提交mutations
		App.vue中：-->this.$store.commit('事件类型',PayLoad)//PayLoad可以使对象
		vuex中：mutations:{
            [事件类型](state,PayLoad){
                //改变store的操作
            }
        }
		通常情况下，mutations里面都是同步方法
	actions-->如果Vuex里面有异步操作(网络请求等)，放在actions里面绑定事件,避免vue工具追踪不到数据变化App.vue中：this.$store.dispatch('事件类型',PayLoad)
		//PayLoad可以是一个对象
		Vuex中：actions:{
            //context是固定的,上下文,可以理解成store
            事件类型(context,PayLoad){
                setTimeout(()=>{
                    context.commit('事件类型')
                    //等操作
                })
            }
            mutations:{
                [事件类型](state){
                    //要做的操作
                }
            }
        }
    getters-->需要从store中获取一些state变异后的状态,getters里面也有state参数,也可以把getters作为参数,调用：this.$store.getters.方法名
		getters默认是不能传递参数的,如果要传递可以让getters里面返回一个函数然后传递参数调用
	modules-->模块，Vue使用单一状态树，也就意味着很多状态都会交给Vuex保管,就会是store对象变得臃肿，为了解决这个问题，Vuex允许我们将store分割成模块(modul)，而且每个模块拥有自己的state,getters,
 actions,mutations等,模块调用mutations,getters等依然用this.$store，但是不要是事件类型名字相同就可以了。
```

![](D:\前端\帮助\img\20210731154729306.png)