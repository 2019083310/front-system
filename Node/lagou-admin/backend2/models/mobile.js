const {Positions}=require('../utils/db')

exports.positions=(start,pagesize)=>{
  return Positions.find({}).skip(start).limit(pagesize).sort({_id:-1})
}