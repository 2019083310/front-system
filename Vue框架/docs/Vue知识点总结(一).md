# Vue2重要知识点总结（一）

### Vue.js基础语法

1.Vue.js的特点

```javascript
可复用的组件
前端路由技术(vue-router)
状态管理(vuex)
虚拟DOM
解耦视图和数据
```

2.Vue.js的安装

```javascript
方式一:cdn引入
方式二:npm包下载
方式三:下载引入
```

3.Vue中的MVVM

```javascript
MVVM:即M-Model(数据层),v-VIEW(视图层),VM-ViewModel(视图模型层)
	View层-->通常就是DOM层,给用户展示各种信息
	Model层-->数据层,存放的数据，可能是固定的，也可能是从网络上请求来的
	ViewModel层-->视图模型层，是View和Model沟通的桥梁,一方面它实现了数据绑定，将MOdel的改变实时的反映到View中,另一方面实现了DOM监听，当DOM发生一些事件，可以监听到，并在需要的时候改变对应的data(创建的Vue实例，实际上就是ViewModel)
MVVM的实现原理:响应式，模板解析，渲染
```

![](D:\前端\帮助\img\20190218151600647.jpeg)

4.Vue的生命周期

```javascript
    通俗点来说，vue的生命周期就是从Vue实例从创建到销毁的过程。Vue实例和每一个组件都有一个完整的生命周期，分为三个阶段：初始化，运行中，销毁。
    实例，组件通过new Vue()创建出来后会初始化事件和数据，-->然后执行beforeCreat()钩子函数，这个时候还没有挂载,只是一个空壳，无法访问到数据，一般不作操作挂载数据，绑定事件等等-->然后执行created()函数，这个时候已经可以使用到数据，也可以更改数据不会触发其它钩子函数,一般在这里初始化数据的获取-->接下来开始找组件对应的模板(el),编译模板为虚拟DOM放入到render函数中准备渲染，-->然后执行beforemount()钩子函数,在这个函数中虚拟DOM已经创建完成,马上就要渲染，在这里可以进行渲染前的最后一次的数据更改,不会触发其它钩子函数，-->接下来开始render,渲染出真正的DOM,-->然后执行mounted()函数，此时，组件已经出现在页面中，数据，真实DOM都已经处理好，事件也挂载完毕，在页面中可以操作dom,-->在组件或实例的数据更改之后，执行beforeUpdate()钩子函数,Vue的虚拟DOM机制会重新构建虚拟DOM与上一次的虚拟DOM树利用diff算法进行对比之后重新渲染，-->然后执行updated()函数,数据已经更新完成，DOM也重新渲染render完毕，可以操作更新后的虚拟DOM，-->当通过某种途径调用$destory之后，立即执行beforeDestory()钩子函数，做一些清除指令，事件等，去掉后只剩下DOM空壳，-->这个时候执行destoryed(),在这里做善后处理。
```

5.插值操作

```javascript
1.mustache语法(大括号法):{{data或者computed或者methods}}
2.v-once:该指定后不需要跟任何值，它会使该元素的组件只渲染一次，不会随着数据的改变而改变
3.v-html:该指令会将html格式的代码进行解析，并显示对应内容	 
  	<h2 v-html="url"></h2>
    data: {
      message: '你好啊',
      url: '<a href="http://www.baidu.com">百度一下</a>'
    }
4.v-text:该指令和mustache语法类似，但是它只接受一个字符串
5.v-pre:它会使对应的Mustache语法中的内容是显示原本的mustache语法
```

6.绑定属性

```javascript
Vue中用v-bind绑定属性，语法糖：':'加上要绑定的属性名
  <!-- 错误的做法: 这里不可以使用mustache语法-->
  <!--<img src="{{imgURL}}" alt="">-->
  <!-- 正确的做法: 使用v-bind指令 -->
  <img v-bind:src="imgURL" alt="">
  <a v-bind:href="aHref">百度一下</a>
  <!--语法糖的写法-->
  <img :src="imgURL" alt="">
  <a :href="aHref">百度一下</a>
    data: {
      imgURL: 'https://img11.360buyimg.com/mobilecms/s350x250_jfs/t1/20559/1/1424/73138/5c125595E3cbaa3c8/74fc2f84e53a9c23.jpg!q90!cc_350x250.webp',
      aHref: 'http://www.baidu.com'
    }

用v-bind动态绑定class和style，有两种方式,对象语法和数组写法，对象写法最常见
用法一：直接通过{}绑定一个类
<h2 :class="{'active': isActive}">Hello World</h2>
 
用法二：也可以通过判断，传入多个值
<h2 :class="{'active': isActive, 'line': isLine}">Hello World</h2>
 
用法三：和普通的类同时存在，并不冲突
注：如果isActive和isLine都为true，那么会有title/active/line三个类
<h2 class="title" :class="{'active': isActive, 'line': isLine}">Hello World</h2>
 
用法四：如果过于复杂，可以放在一个methods或者computed中
注：classes是一个计算属性
<h2 class="title" :class="classes">Hello World</h2>
```

7.计算属性

```javascript
computed:{}//里边定义的是计算属性
当我们需要对数据进行一些处理后在显示，或者需要将多个数据结合起来显示，这个时候我们就可以用计算属性来实现，使用的时候在需要的地方调用即可
//计算属性会进行缓存，如果多次使用，只会被调用一次
```

8.事件监听

```javascript
v-on用来绑定事件监听器，语法糖：'@'+事件名称//@click
click中的函数调用写在methods:{}中
 
<div id="app">
  <!--1.事件调用的方法没有参数 ()可以不添加-->
  <button @click="btn1Click()">按钮1</button>
 
  <button @click="btn1Click">按钮1</button>
 
  <!--2.在事件定义时, 写方法时省略了小括号, 
    但是方法本身是需要一个参数的, 这个时候, Vue会默认将浏览器生产的event事件对象作为参数传入到方法-->
  <!--<button @click="btn2Click(123)">按钮2</button>-->   
 
  <!--调用时不传入参数,那么参数为undefined-->
  <!--<button @click="btn2Click()">按钮2</button>-->
  <button @click="btn2Click">按钮2</button>
 
  <!--3.方法定义时, 我们需要event对象, 同时又需要其他参数-->
  <!-- 在调用方式, 如何手动的获取到浏览器参数的event对象: $event-->
  <button @click="btn3Click(abc, $event)">按钮3</button>
</div>
 
<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊',
      abc: 123
    },
    methods: {
      btn1Click() {
        console.log("btn1Click");
      },
      btn2Click(event) {
        console.log('--------', event);
      },
      btn3Click(abc, event) {
        console.log('++++++++', abc, event);
      }
    }
  })
```

9.条件判断

```javascript
v-if、v-else、v-else-if
这三个指令与javascript的条件语句类似
v-show的用法和v-if非常相似，也用于决定一个元素是否渲染：
v-if和v-show对比
v-if和v-show都可以决定一个元素是否渲染，那么开发中我们如何选择呢？
v-if当条件为false时，压根不会有对应的元素在DOM中。
v-show当条件为false时，仅仅是将元素的display属性设置为none而已。
开发中如何选择呢？
当需要在显示与隐藏之间切换很频繁时，使用v-show
当只有一次切换时，通过使用v-if
```

10.循环遍历

```javascript
v-for循环遍历数组，对象
v-for='(item,index) in items'--数组
v-for='(value,item,index) in obj'--对象
//注意，在循环遍历的时候一定要给其绑定key,这样可以防止组件的复用性:key='index'，绑定的值还必须是唯一的
```

11.阶段案例

```javascript
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    table {
      border: 1px solid #333;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 8px 16px;
      text-align: center;
      border: 1px solid #ccc;
    }

    th {
      background-color: #c5d6e2;
    }
  </style>
</head>

<body>
  <div id="app">
    <table>
      <thead>
        <tr>
          <th></th>
          <th>书籍名称</th>
          <th>出版日期</th>
          <th>价格</th>
          <th>购买数量</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='(item,index) in books'>
          <td>{{item.id}}</td>
          <td>{{item.name}}</td>
          <td>{{item.date}}</td>
          <td>
            <!-- 价格 保留两位小数 拼接 ￥ -->
            <!-- 法1  总价格那里也需要这个 所以这样写不太好 -->
            <!-- {{item.price.toFixed(2)}} -->

            <!-- 法2 调用方法 -->
            <!-- {{getFinalPrice(item.price)}} -->

            <!-- 法3 过滤器 -->
            {{item.price | showPrice}}
          </td>
          <td>
            <!-- v-bind动态绑定属性如果为true就表示有这个属性 v-bind:disabled="true" 渲染出来就是disabled 所以这里只需要一个布尔值就行 -->
            <button @click='subNumber(index)' v-bind:disabled='item.count<=1'>-</button>
            {{item.count}}
            <button @click='addNumber(index)'>+</button>
          </td>
          <td><button @click='removeHandle(index)'>删除</button></td>
        </tr>
      </tbody>
    </table>
    <h2>总价格为：{{totalPrice | showPrice}}</h2>
  </div>
  <script src='./js/vue.js'></script>
  <script>
    const app = new Vue({
      el: '#app',
      data: {
        books: [{
            id: 1,
            name: '《算法导论》',
            date: '2006-9',
            price: 85.00,
            count: 1
          },
          {
            id: 2,
            name: '《UNIX编程艺术》',
            date: '2006-2',
            price: 59.00,
            count: 1
          },
          {
            id: 3,
            name: '《编程珠玑》',
            date: '2008-10',
            price: 39.00,
            count: 1
          },
          {
            id: 4,
            name: '《代码大全》',
            date: '2006-3',
            price: 128.00,
            count: 1
          }
        ]
      },
      methods: {
        addNumber(index) {
          this.books[index].count++;
        },
        subNumber(index) {
          this.books[index].count--;
        },
        removeHandle(index) {
          this.books.splice(index, 1);
        }
      },
      computed: {
        // let totalPrice = 0
        // for (let i = 0; i < this.books.length; i++) {
        //   totalPrice += this.books[i].price * this.books[i].count
        // }
        // return totalPrice

        // 其他计算总价格方法
        // for (let i in/of this.books)
        // reduce
        totalPrice() {
          return this.books.reduce((preValue, n) => {
            return preValue + n.price * n.count;
          }, 0)
        }
      },
      filters: {
        showPrice(price) {
          //参数是你要过滤的东西
          //toFixed()保留两位小数
          return '¥' + price.toFixed(2)
        }
      }
    })
  </script>
</body>

</html>
```

12.v-model数据绑定

```javascript
v-model实现表单与数据的双向绑定
实现原理：v-model的双向数据绑定原理实际上是v-bind与v-on的语法糖
也就是说下面的代码等同于:
<input type="text" v-model="message">
<input type="text" v-bind:value="message" v-on:input="message=$event.target.value"
```
