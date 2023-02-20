//连接数据库操作
const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost:27017/lagou-admin',{
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  // useFindAndModify: true
})
//数据库连接
mongoose.connection.on('success',()=>{
  console.log('connect success!')
})

mongoose.connection.on('error',()=>{
  console.log('connect error!')
})

//创建数据模型
const Schema=mongoose.Schema
//用户
const UsersSchema=new Schema({
  username:{
    required:true,
    type:String
  },
  password:{
    required:true,
    type:String
  }
})

//职位列表
const PositionsSchema=new Schema({
  companyName:String,
  positionName:String,
  city:String,
  createTime:String,
  salary:String,
  companyLogo: String
})

//创建集合
const Users=mongoose.model('Users',UsersSchema)
const Positions=mongoose.model('Positions',PositionsSchema)

exports.Users=Users
exports.Positions=Positions