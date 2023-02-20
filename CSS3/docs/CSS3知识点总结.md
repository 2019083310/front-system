# CSS面试知识点总结

1.说一下css盒模型

​	盒模型就是用来装页面上的元素的矩形区域，css中的盒模型包括两种，标准的W3C盒模型，以及IE盒模型。

​	区别：标准盒模型的width指的是内容区(content)的宽度，IE盒模型width指的是内容区的宽度(content)+边				框(border)+左右内边距(padding)

​	在css3中引入了box-sizing属性：它有三个值，其中content-box表示标准盒模型，border-box表示IE盒模型。

2.css选择器有哪些，哪些属性可以继承？

​	ID选择器，类选择器，通配选择器(*)，标签选择器(tag)，属性选择器，伪类选择器(:nth-child)，兄弟选择器(li~a)，子选择器(ul>li)，伪元素选择器(::before)

​	可继承的属性：font,color,text-align,list-style

​	不可继承的属性：border,padding,margin,display,background,height,width,overflow,position,z-index,left,right,top,bottom等

3.选择器优先级的计算

​	!important>内联选择器(1000)>id选择器(100)>类和伪类选择器(10)>标签选择器(1)>通配选择器

​	如果优先级相同，优先选择最后出现的样式(属性选择器和为类选择器以及类选择器优先级相同)

4.如何居中div?居中一个浮动元素？让绝对定位的div居中？

div的居中的五大方案:

```javascript
1.定位+margin.
2.定位+transfrom:translate
	position:absolute;
	top:50%;
    left:50%;
	transfrom:translate(-50%,-50%);
3.flex:
	display:flex;
	justify-content:center;
	align-items:center;
4.table-cell
	父元素中:display:table-cell;
5.利用text-align:center;实现
```

5.display有哪些值？有什么作用?

```javascript
block--块元素
inline--行内元素
inline-block--行内块元素
none--隐藏元素
table--表格显示
flex--实现水平布局和居中对齐
```

6.position的值？

```javascript
static(默认值)--没有定位效果，按照正常文档流进行排列
relative--相对定位，不会脱离文档流，提高自身层级，参考自身静态位置通过top,bottom,left,right定位。
absolute--绝对定位，脱离文档流,相对于包含块进行定位，包含块(离它最近的定位了的父元素)
fixed--固定定位，是参照浏览器可视窗口定位
stricky--粘滞定位，元素到某一位置就不动了
```

7.CSS3的新特性？

- 圆角border-radius,如果值为50%则是圆形
- 盒阴影box-shadow:10px 10px 5px #888;第一个值为水平偏移量，第二个值为垂直偏移量，第三个值为阴影的模糊半径，第四个值为阴影的颜色。
- 文字阴影：text-shadow:5px 5px 5px #bfa;(水平阴影 垂直阴影 模糊半径 阴影颜色)
- background-image background-repeat background-size background-position background-origin
- 渐变:线性渐变、径向渐变
- font-face:定义自己的字体
- rgba和透明度：rgba(255,255,255,0.1)--最后一个为0-1的值，用来设置透明度，0.5半透明
- flexbox弹性盒--flex布局
- 动画animation,transform

8.css3的flexbox（弹性盒布局模型），以及适用场景？

​	任何一个容器都可以指定flex布局。行内元素也可以使用flex布局。

​	display:flex;--块级弹性盒子          display:inline-flex;--行内级弹性盒子

​	弹性盒子内的元素称为弹性容器。一个元素既可以是弹性容器也可以是弹性元素。

​	弹性盒子的属性：

​		flex-direction:row(默认值)/row-reverse/column/column-reverse.--在弹性容器内的排列方式

​		flex-wrap:wrap/no-wrap(默认值)/wrap-reverse--弹性容器内的元素换不换行

​		flex-flow:wrap和direction的简写属性

​		justify-content:center/space-between/space-around/sapce-evenly--如何分配主轴上的空白空间

​		align-items--副轴上的元素对齐方式

​	弹性元素的属性：

​		flex-grow:弹性增长系数，默认是0

​		flex-shrink:弹性的缩减系数，默认是1

​		flex-basic:元素基础长度,指的是在主轴上的基础长度

​	flex:0/1;flex布局常用值

9.用css创建一个三角形

```javascript
/* 
  采用的是相邻边框链接处的均分原理
  将元素的宽高设为0，只设置 border ,
  将任意三条边隐藏掉（颜色设为 transparent ）,剩下的就是一个三角形
*/
#demo{
  width: 0;
  height: 0;
  border-width: 20px;
  border-style: solid;
  border-color: transparent transparent red transparent;
}
```

10.一个满屏品字布局如何设计？

第一种真正的品字：三块高度是确定的，上面那块用margin:0 auto;居中对齐，下面两块用float或者inline-block不换行，再用margin调整他们的位置。

第二种满屏的品字：上面的div宽度设置成100%,下面的两个div分别宽50%,然后用float或者inline-block使其不换行。

11.常见的兼容性问题？

- 不同的浏览器的默认的padding,margin的默认样式是不一样的，因此需要去除浏览器的默认样式	
- Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示,可通过加入 CSS 属性 -webkit-text-size-adjust: none; 解决
- 超链接访问过后hover样式就不出现了，被点击访问过的超链接样式不再具有hover和active了。解决方法是改变CSS属性的排列顺序:L-V-H-A ( love hate ): a:link {} a:visited {} a:hover {} a:active {}
- 设置较小高度标签（一般小于10px），在IE6，IE7中高度超出自己设置高度。hack：给超出高度的标签设置overflow:hidden;或者设置行高line-height 小于你设置的高度。

12.使用base64编码的优缺点？

​	base64编码是一种图片处理格式，通过特定的算法将图片编码成字符串，在页面上显示时可以使用base64来代替url属性。

​	优点：减少了一个图片的HTTP请求。

​	缺点：base64编码后的文件大小比源文件大1/3，造成文件体积增加，影响文件的加载速度和对浏览器的文件解析渲染时间增加。IE8以前的浏览器不支持base64格式的图片。

13.link标签和import标签的区别？

​	link标签的html标签，没有兼容性，会在页面加载时同时被加载。

​	import标签不是html标签，是css提供的，只有ie5以上才能识别，且要在页面加载完成之后才能加载。

14.BFC块级格式化处理(block formatting context)

​	浮动之后的元素会脱离文档流，这样就造成了父元素的高度丢失(父元素高度是子元素撑起来的)，导致了页面布局的混乱，因此要解决这种高度丢失问题是必要性的，解决的办法就是设置BFC。

​	设置BFC的好处：变成了一个独立的布局区域；计算BFC的高度，浮动元素也会参与；最重要的是父元素高度不会丢失在设置float以后。	

​	怎么设置成BFC：overflow:hidden(推荐)/float/display:table,inline-block,table-cell;/position:absolute

15.块元素和行内元素

​	块元素-->页面独占一行，宽度默认是父元素的100%，高度由内容撑开，可以设置宽度高度。

​	行内元素-->页面不会独占一行，不可以设置宽度和高度，但可以设置padding/border/margin

16.为什么会出现浮动和什么时候需要清除浮动？清除浮动的方式？

​	当设置属性float以后，元素会脱离文档流，块级元素变成行内元素，行内元素变成块级元素，导致浮动的元素会漂浮在文档流上。	

​	浮动带来的问题：父元素的高度无法被撑开影响页面布局，页面混乱。

​	清除浮动：BFC、clear:both、给父元素定义一个高度、

​				使用伪类.clearfix::before,.clearfix::after{

​						content:'';						

​						display:table;

​						clear:both;

​				}

17.外边距的重叠

​	多个相邻(兄弟或者父子关系)的块元素垂直方面的margin 会重叠.

​	父子元素：父子元素间的相邻外边距子元素会传递给父元素（上外边距）,这种重叠会影响到页面的布局，必须处理，通过clearfix处理。

​	兄弟元素：兄弟元素间的外边距对于开发是有利的，不需要处理。

18.怎么样让一个元素消失？

​	display:none;把元素隐藏起来，并且会改变页面的布局，可以理解成在页面中把该元素删除掉。

​	visibility:hidden;把元素隐藏起来，但不会改变页面布局，但是不会触发该元素已经绑定的事件。

​	opacity：0;该元素隐藏起来了，但不会改变页面的布局，并且如果该元素已经绑定一些事件，点击该区域，也会触发。

​	css中对溢出的处理--overflow:hidden/scroll

19.calc属性--用于动态计算长度值，任何长度值都可以使用calc（）函数计算,需要注意的是运算符前后都需要保留一个空格，如：width:calc(100%-10px);

20.png、jpg、gif图片格式，还有webp

```javascript
1.JPG格式图片：支持的颜色比较丰富，不支持透明效果，不支持动图效果，一般用来显示照片
2.png格式图片：支持的颜色丰富，不支持动图，支持透明效果
3.gif格式图片：支持的颜色比较少，支持动图，支持简单透明，一般用来显示动图
4.webp格式图片：是谷歌新推出的，专门用来表示网页中的图片的一种格式，兼容性不太好。
```

21.line-height和height区别？

​	line-height指的是行高，指在布局里面一段文字上下文之间的高度，是针对字体来设置的。

​	height指的是盒子的整体高度。

22.background-color设置的背景颜色会填充元素的content,padding,border区域。

23.css预处理器有什么--less,sass等

​		CSS 预处理器是用一种专门定义的编程语言，为 CSS 增加编程特性，可以在 CSS 中使用变量、循环、嵌套等功能，将 CSS 作为目标生成文件，让 CSS 更加简洁、可读性强、可维护性强等好处，主要有三种 CSS 预处理器：Sass、LESS 和 Stylus，通常使用 webpack 构建工具将它们生成的文件转换成 CSS 文件.

24.相邻的两个inline-block节点为什么会出现间隔，该如何解决

是换行符引起的间隔问题，间隙为 4px。消除间隙的方法：

```javascript
1）去掉换行符；
2）对父元素添加 font-size:0，将字体大小设置为 0，换行符也会为 0px，从而消除间隙，再为 inline-block 元素设置我们需要的字体大小；
3）将 inline-block 的 margin-right/left 设置为 -4px；
4）将父元素的 letter-spacing 或 word-spacing 设置为 -4px，这两个属性会增加或减少字符间隔。
```

inline-block 还有两个问题：即不同高度的两个 inline-block 顶部不对齐，以及 inline-block 底部多出几像素（多出空白）。解决方法是为 inline-block 元素设置 vertical-align:top。

25.在CSS中为元素分配某种颜色的方法有哪些

```javascript
1、十六进制颜色码：
十六进制颜色码就是在软件中设定颜色值的代码。通过一个以“#”开头的6位十六进制数值表示一种颜色。6位数字分为3组，每组两位，依次表示红、绿、蓝三种颜色的强度。
2、RGB颜色模式：颜色由表明红色，绿色，和蓝色各成分强度的三个数值表示。从极小值0到最大值255，当所有颜色,都在最低值被显示的颜色将是黑色，当所有颜色都在他们的最大值被显示的颜色将是白色。
3、HSL标记：设计师和美术师通常更喜欢使用HSL（色相/饱和度/亮度）颜色方法进行工作。在Web上，使用HSL功能符号表示HSL颜色。HSL（）CSS函数在用法上与RGB（）函数非常相似。
```

26.列举一些CSS框架？

```javascript
Bootstrap：是美国Twitter公司的设计师Mark Otto和Jacob Thornton合作基于HTML、CSS、JavaScript 开发的简洁、直观、强悍的前端开发框架，使得 Web 开发更加快捷。Bootstrap提供了优雅的HTML和CSS规范，它即是由动态CSS语言Less写成。

Layui：是一款采用自身模块规范编写的前端 UI 框架，遵循原生 HTML/CSS/JS 的书写与组织形式，门槛极低，拿来即用。其外在极简，体积轻盈，组件丰盈，非常适合界面的快速开发。

ElementUI：一套为开发者、设计师和产品经理准备的基于 Vue 2.0的桌面端组件库。

antd：是基于 Ant Design 设计体系的 React UI 组件库，主要用于研发企业级中后台产品。开箱即用的高质量 React 组件，全链路开发和设计工具体系，数十个国际化语言支持
```

27.CSS有哪些单位?
	CSS 有两种类型的长度单位：相对和绝对。设置 CSS 长度的属性有 width, margin, padding, font-size, border-width, 等。
相对长度：

| em   | 它是描述相对于应用在当前元素的字体尺寸，所以它也是相对长度单位。一般浏览器字体大小默认为16px，则2em == 32px； |
| :--- | ------------------------------------------------------------ |
| rem  | 是根 em（root em）的缩写，rem作用于非根元素时，相对于根元素字体大小；rem作用于根元素字体大小时，相对于其出初始字体大小。 |
| vh   | viewpoint height，视窗高度，1vh=视窗高度的1%                 |
| vw   | viewpoint width，视窗宽度，1vw=视窗宽度的1%                  |
| vmin | vw和vh中较小的那个                                           |
| vmax | vw和vh中较大的那个                                           |
| %    | 相对父元素                                                   |
|      | 提示: rem与em有什么区别呢？区别在于使用rem为元素设定字体大小时，仍然是相对大小，但相对的只是HTML根元素 |

27.CSS3动画Animation

​	动画可以自动触发动态效果，设置动画必须要设置一个关键帧，关键帧设置了动画的执行的每一个步骤。

​	关键帧:@keyframes 关键贞名{from，to}

​	animation-name:要对当前元素生效的关键帧的名字

​	animation-delay:动画的延时

​	animation-duration:动画的执行时间

​	animation-timing-function:动画的执行方式

​	animation-iteration-count:动画的执行的次数ifinite--无限执行

​	animation-direction:指定动画的执行的方向

​	animation:动画的简写属性

28.过渡transition

​	通过过渡可以指定一个属性发生变化时的切换方式，可以创键一些非常好的效果，提升用户体验。

​	transition-property:指定要过渡的属性，多个属性用逗号隔开，若所有属性都需要过渡，则使用all关键字

​	transition-duration:指定过渡效果的持续时间（ms）

​	transition-timing-function:过渡的时序函数，指定过渡的执行方式，可选值：ease/linear/ease-in/ease-out/ease-out等

​	transition-delay:过渡效果的延迟时间

​	transition--过渡的简写属性

29.变形平移旋转缩放--transform

​	平移transfrom:translate

​			translateX()--沿着x轴方向平移,translateY()--沿着y轴方向平移,translateZ()--沿着z轴方向平移

​	旋转transfrom:rotato

​			rotatoX()/rotatoY()/rotatoZ()在里面要指定旋转的度数

​	缩放transfrom:scale

​			scaleX()/scaleY()/scaleZ()水平、垂直、双方向的缩放