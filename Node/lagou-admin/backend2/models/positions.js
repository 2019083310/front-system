const {Positions}=require('../utils/db')

//添加职位
exports.add=(data)=>{
  return new Positions(data).save()
}

//获取职位列表
exports.list=()=>{
  return Positions.find()
}

//删除职位
exports.remove=(id)=>{
  return Positions.deleteOne({_id:id})
}

//获取当前要修改的职位列表的数据
exports.listone = (id) => {
  return Positions.findOne({_id: id})
}

//更新职位
exports.update=(data)=>{
  return Positions.findByIdAndUpdate(data.id,data)
}