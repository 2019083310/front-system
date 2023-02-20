const express=require('express')
const router=express.Router()

const {add,list,remove,update,listone}=require('../controllers/positions')
const uploadMiddleware=require('../middleware/upload')

//获取职位列表
router.get('/list',list)

//更新
// router.post('/upload',uploadMiddleware)

//添加职位列表
router.post('/add',uploadMiddleware,add)

//删除职位
router.delete('/remove',remove)

//修改职位信息
router.patch('/update',uploadMiddleware,update)

//获取要修改的职位列表的数据
router.post('/listone',listone)

module.exports=router
