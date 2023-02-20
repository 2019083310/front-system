const express = require('express');
const router = express.Router();

const {auth}=require('../middleware/auth')

const {
  signup,
  list,
  remove,
  signIn,
  isAuth,
  signout
} = require('../controllers/users')
/* GET users listing. */

//登录
router.post('/signin', signIn)

//获取用户列表
router.get('/', auth,list)

//注册
router.post('/', auth,signup);

//删除用户
router.delete('/',auth, remove)

//退出
router.get('/signout',auth,signout)

//权限验证
router.get('/isAuth', isAuth)
module.exports = router;