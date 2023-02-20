# MongoDB数据库的基本使用

在这里我将总结mongodb数据库的基本使用以及node中如何操作Mongodb

一、MongoDB数据库的基本使用

1.安装数据库

下载地址：地址：https://www.mongodb.com/download-center/community

2.环境配置：地址：https://www.cnblogs.com/xiaozhaoboke/p/11479144.html

3.启动数据库：控制台输入:mongod

4.关闭数据库：可以直接关闭控制台/也可以直接ctrl+c

5.在服务端启动完还需要在客户端启动：输入mongo连接数据库

6.退出数据库：exit

7.三个概念：

​	数据库：是一个仓库，可以存放集合

​	集合：类似于数组，在集合中可以存放文档

​	文档：文档是数据库中最小的单位

8.Mongo基本命令:

​	show dbs :显示所有数据库

​	use 集合名：使用当前数据库，如果没有，则会自动创建

​	db：显示当前所使用的数据库

​	show collections：显示当前数据库中的所有集合

9.数据库的增删改查操作

```javascript
数据库的添加数据操作：
	db.集合名.insert({})-->插入一个
	db.集合名.insert([{},{},...])-->插入多个
	db.集合名.insertOne({})-->插入一个
	db.集合名.insertMany([{},{},...])-->插入多个
	//注:数据库中的每一个文档都有唯一的id 属性值，你可以自己指定但是要确保唯一
数据库的查找操作:
	db.集合名.find()-->查找该数据库集合所有文档
	db.集合名.findOne({})-->查找符合条件的第一个文档
	db.集合名.find()
数据库的更新操作：
	db.集合名.update({},{})//接受两个对象，第一个对象代表查找的对象，第二个对象代表要更新的数据，但是update默认会用第二个对象替换旧对象，如果想修改某个属性，需要使用条件操作符
	update()默认只会修改符合条件的第一个文档,如果要修改多个要加第三个参数multi:true
    db.集合名.updateMany()--修改多个文档
    db.集合名.updateOne()--修改一个文档
数据库的删除操作:
	db.集合名.deleteOne({})--删除符合条件的第一个文档
    db.集合名.deleteMany({})--删除符合条件的多个文档
    db.集合名.remove({})--删除符合条件的文档，默认也会删除多个
删除数据库：db.dropDatebase()
删除集合:db.集合名.drop()
条件操作符:
	$gt大于     $lt小于   $gte大于等于    $lte小于等于    eq等于   $or:[{},{},....]选择关系
    limit()-设置数据的显示上限，用来分页
	skip()-用于跳过指定的数量的数据
```

二、node中操作mongodb数据库

1.基本使用：node中操作MongoDb数据库需要使用第三方包---mongoose来操作数据库

​	npm i mongoose            require('mongoose')

2.mongoose初识

```javascript
//设计数据库的结构
const mongoose=require('mongoose')

//数据库的连接
mongoose.connect('mongodb://localhost:27017/test2',{
  useNewUrlParser:true,
  useUnifiedTopology:true
})

//规范模型结构和约束
const Schema=mongoose.Schema

const stuSchema=new Schema({
  name:{
    type:String,
    required:true
  },
  age:{
    type:Number,
    required:true
  },
  hobbies:{
    type:String,
    required:true
  },
  gender:{
    type:String,
    enum:[0,1],
    default:0
  }
})

//创建模型并引入规范
module.exports=mongoose.model('Student',stuSchema)
```

3.对数据库中数据的增删改查

```javascript
数据添加：
	let 文档名=new 集合名({数据})
    文档名.save().then()
数据删除：
	集合名.deleteOne({文档内容},function((error,ret){}))
    集合名.deleteMany({文档数据},function((error,ret){}))
数据查找：
	集合名.find((err,ret)=>{})查询全部
    集合名.find({文档数据},(err,ret)=>{})查询符合条件的全部
    集合名.findOne({文档},(err,ret)=>{})查询符合条件的单个对象
数据更改:
	集合名.findByIdAndUpdate({_id:},{更新的内容},(err,ret)=>{返回修改前的数据})
	集合名.findOneAndUpdate({查询条件},{更改内容},(err,ret)=>{})
```

4.用案例来了解node中的具体操作---增删改查

github连接地址：https://github.com/2019083310/exercise

里面还有好多前端练习的项目和小案例，希望可以帮助到大家。

























