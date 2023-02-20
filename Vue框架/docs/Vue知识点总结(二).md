# Vue重要知识点总结(二)

### Vue.js组件化开发

1.认识组件化

​	我们面对复杂的问题时，我们不太可能一次性全部搞定，但是我们可以将这个复杂的问题，进行拆解，拆解成一个一个可以处理的小问题，最后在放到整体中，这样一个很复杂的问题就会被解决。

​	组件化也是这样的思想，它提供了一种抽象，让我们可以开发出一个一个独立复用的组件来构造我们的应用。任何的应用都会被抽象成一颗组件树。

2.注册组件

注册组件的步骤

```javascript
1.创建组件构造器
const cpn=Vue.extend({里面接受一个模板})
2.注册组件
//全局组件  Vue.compontent('组件名字',组件构造器)
//局部组件的注册:new Vue({
		compontents:{
            组件名:组件构造器
        }	
	})
	
3.使用组件
//全局组件可以在任意位置使用<cpnc></cpnc>
父子组件正确用法：在 父组件的components注册，在template 中使用子组件标签
```

3.组件其它补充

注册组件的语法糖:

```javascript
这里优化了注册组件的方式，省略了注册组件构造器，以及进行了模板的抽离
 
  <div id="app">
    <cpn></cpn>
    <cpn></cpn>
    <cpn></cpn>
  </div>
 
  <!--1.script标签, 注意:类型必须是text/x-template 然后给它设置一个id -->
  <script type="text/x-template" id="cpn">
    <div>
      <h2>我是标题</h2>
      <p>我是内容,哈哈哈</p>
    </div>
  </script>
 
  <!--2.template标签-->
  <template id="cpn">
    <div>
      <h2>我是标题</h2>
      <p>我是内容,呵呵呵</p>
    </div>
  </template>
 
  <script src="../js/vue.js"></script>
  <script>
    // 1.注册一个全局组件
    Vue.component('cpn', {
      template: '#cpn' // 需要加上选择器
    })
 
    const app = new Vue({
      el: '#app',
      data: {
        message: '你好啊'
      }
    })
  </script>
```

4.组件数据存放

```javascript
组件中的数据也是存放在data中，只不过组件的data必须是一个函数，那么为什么是一个函数？
	这是因为组件的复用性，如果我们想要用这个组件很多次，那么改变一个组件中的data，所有组件的数据都会跟着发生变化，这样肯定是不对的。但是，如果data是一个函数，并且返回一个对象，那么在这个组件被创建挂载到DOM的时候，就会返回一个新的对象，他们的地址是不一样的，这样就会方便我们的开发。
```

5.父子组件通信

父级向子级传递数据：props

```javascript
//对象，对象可以设置传递时的类型，也可以设置默认值等->当需要对props进行类型等验证时
      props: {
        // 1.类型限制
        // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
        // cmovies: Array,
        // cmessage: String,
 
        // 多个可能的类型
        // propB: [String, Number],
 
        // 2.提供一些默认值, 以及必传值
        cmessage: {
          type: String,
          default: 'aaaaaaaa',
          required: true // 必填的字符串
        },
        // 类型是对象或者数组时, 默认值必须是一个工厂函数
        cmovies: {
          type: Array,
          default () {
            return {
              message: 'hello'
            }
          }
        },
        // 自定义验证函数
        propF: {
          validator: function (value) {
            // 这个值必须匹配下列字符串中的一个
            return ['success', 'warning', 'danger'].indexOf(value) !== -1
          }
        }
 
      }

```

```javascript
<!DOCTYPE html>
<html lang="en">
 
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
 
<body>
 
  <div id="app">
    <!--<cpn v-bind:cmovies="movies"></cpn>-->
    
    <!-- 没有v-bind直接这样写是给prop传递一个静态的值，也就是说movies不是一个变量而是一个字符串 -->
    <!--<cpn cmovies="movies" cmessage="message"></cpn>-->
 
    <!-- 步骤2 通过:cmessage="message" 将data中的数据传给子组件props -->
    <cpn :cmessage="message" :cmovies="movies"></cpn>
  </div>
 
 
  <!-- 子组件 -->
  <template id="cpn">
    <div>
      <!-- 步骤3 将props中的值显示在子组件中 -->
      <ul>
        <li v-for="item in cmovies">{{item}}</li>
      </ul>
      <h2>{{cmessage}}</h2>
    </div>
  </template>
 
  <script src="../js/vue.js"></script>
  <script>
    // 父传子: props
 
    // -------子组件------
    const cpn = {
      template: '#cpn',
 
      // 子组件通过prop接收  我们能够在组件实例中访问这个值，就像访问 data 中的值一样
 
      /* ***步骤1*** 在 子组件 定义props */
      // ****方式1：字符串数组，数组中的字符串就是传递时的名称（之后要引用的变量名）
      // props: ['cmovies', 'cmessage'], // 不要把元素当成字符串，把它当成数组
 
 
      
 
      data() {
        return {}
      }
    }
 
 
    // -----父组件-----
    const app = new Vue({
      el: '#app',
      data: {
        message: '你好啊',
        movies: ['海王', '海贼王', '海尔兄弟']
      },
      components: {
        cpn
      }
    })
  </script>
 
<!-- 
  步骤：
  1.在子组件里写props
  2.在子组件的标签加上v-bind  <cpn v-bind:props里定义的名称="父组件data数据名称"></cpn>
  3.将props中的值显示在子组件中
 -->
 
  <!-- 
  工厂函数
    1，它是一个函数。
    2，它用来创建对象。
    3 ，它像工厂一样，“生产”出来的函数都是“标准件”（拥有同样的属性）
 -->
 
</body>
 
</html>
```

子级向父级传递数据--自定义事件

```javascript
 
  <!--父组件模板-->
  <div id="app">
    <!-- 3.在父组件子标签中，通过v-on来监听子组件事件 并添加一个响应该事件的处理方法 -->
    <cpn @item-click="cpnClick"></cpn>
  </div>
 
  <!--子组件模板-->
  <template id="cpn">
    <div>
      <!-- 1.在子组件中创建一个按钮，给按钮绑定一个点击事件 -->
      <button v-for="item in categories" @click="btnClick(item)">
        {{item.name}}
      </button>
    </div>
  </template>
 
  <script src="../js/vue.js"></script>
  <script>
    // 子传父 自定义事件
 
    // 子组件 
    const cpn = {
      template: '#cpn',
      data() {
        return {
          categories: [{
              id: 'aaa',
              name: '热门推荐'
            },
            {
              id: 'bbb',
              name: '手机数码'
            },
            {
              id: 'ccc',
              name: '家用家电'
            },
            {
              id: 'ddd',
              name: '电脑办公'
            },
          ]
        }
      },
      methods: {
        btnClick(item) {
          // 发射事件: 自定义事件
          // 2.在子组件中，通过$emit()来触发事件
          this.$emit('item-click', item)
          // 注意！！！！这里的$emit事件名不要写成驼峰！！！脚手架里可以，会先编译成一个组件对象render函数
        }
      }
    }
 
    // 父组件 
    const app = new Vue({
      el: '#app',
      data: {
        message: '你好啊'
      },
      components: {
        cpn
      },
      methods: {
        cpnClick(item) { // 这里的参数是接收子组件传过来的数据的
          console.log('cpnClick', item);
          
        }
      }
    })
  </script>
```

8.插槽slot

插槽的使用可以更加扩展组件的复用性

```javascript
具名插槽的使用:
   <!-- 
  注意 v-slot 只能添加在 < template > 上，只有当被提供的内容只有默认插槽时，
  组件的标签才可以被当作插槽的模板来使用。这样我们就可以把 v-slot 直接用在组件
 -->
    <div id="app">
        <!-- 默认 -->
        <cpn></cpn>
        <hr>
        <!-- 使用v-slot替换 -->
        <cpn>
            <!-- vscode 快捷语法 vslot-named -->
            <template v-slot:left>
                <span>返回</span>
            </template>
        </cpn>
        <cpn>
            <!--任何没有被包裹在带有 v-slot 的 <template> 中的内容都会被视为默认插槽的内容。或者可以给他起名default-->
            <!--<template v-slot:default>
                    我是内容
                </template>-->
 
            <template v-slot:center>
                <span>标题</span>
            </template>
            <span>替换没有名字的插槽</span>
        </cpn>
        <cpn>
        <!-- 
        跟 v-on 和 v-bind 一样，v-slot 也有缩写，即把参数之前的所有内容 (v-slot:) 替换为字符 #。
        例如 v-slot:header 可以被重写为 #header：，前提是必须要有插槽名！！！
        -->
            <template #right>
                <span>替换后的右边</span>
            </template>
        </cpn>
    </div>
    <template id="cpn">
        <div>
            <slot name="left"><span>左边</span></slot>
            <slot name="center"><span>中间</span></slot>
            <slot name="right"><span>右边</span></slot>
            <slot>默认插槽内容</slot>
        </div>
    </template>
    <!-- 需要重新引入一个vue2.6之后的版本 -->
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
    <script>
        const cpn = {
            template: '#cpn'
        }
        const app = new Vue({
            el: '#app',
            data: {},
            components: {
                cpn
            }
        })
    </script>
```

```javascript
作用域插槽的使用:
 
    <div id="app">
        <!-- 默认 -->
        <h4>默认</h4>
        <cpn></cpn>
        <hr>
        <h4>替换样式</h4>
        <cpn>
            <!-- 具名插槽和作用域插槽混用 -->
            <template v-slot:slot1='props1'>
                <!-- 
                <span>
                    {{props1}}
                </span> -->
 
                <span>{{props1.data1.join('-')}}</span>
                <h3>
                    {{props1.msg}}
                </h3>
            </template>
            <template v-slot:slot2="props2">
                <h2 style="color: red;">
                    {{props2.data2}}
                </h2>
            </template>
        </cpn>
        <!--
            当被提供的内容只有默认插槽时，组件的标签才可以被当作插槽的模板来使用。
            这样我们就可以把 v-slot 直接用在组件上,但是不能和具名插槽混用
            -->
        <cpn v-slot="props3">
            <template>
                <h3 style="color: blue;">
                    {{props3.data3}}
                </h3>
            </template>
        </cpn>
    </div>
    <template id="cpn">
        <div>
            <!-- 可以传多个值 所有的值会包含在一个对象中 在父组件中v-slot=""中定义名字接收 -->
            <slot :data1='movies' :msg='message' name='slot1'>
                <ul>
                    <li v-for="(item, index) in movies" :key="index">
                        {{item}}
                    </li>
                </ul>
            </slot>
            <slot :data2='name' name='slot2'>
                {{name}}
            </slot>
            <slot :data3='defult'>默认插槽</slot>
        </div>
    </template>
    <!-- 需要重新引入一个vue2.6之后的版本 -->
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
    <script>
        const cpn = {
            template: '#cpn',
            data() {
                return {
                    movies: ['战狼', '鬼吹灯', '盗墓笔记'],
                    message: '你好呀',
                    name: 'yangyanyan',
                    defult: '我是默认的数据'
                }
            },
        }
        const app = new Vue({
            el: '#app',
            data: {},
            components: {
                cpn
            }
        })
    </script>
```

