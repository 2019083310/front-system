import signinTpl from '../views/signin.art'
import { signin as signinModel } from '../models/signin'

const htmlSignin = signinTpl({})

const _handleSubmit = (router) => {
  return async (e) => {
	//console.log(0)
    e.preventDefault()
    const data = $('#signin').serialize()
    let { jqXHR, res } = await signinModel(data)
    const token = jqXHR.getResponseHeader('X-Access-Token')
    localStorage.setItem('lg-token', token)
	//console.log(res)
	//res.ret=true
    if(res.ret) {
      console.log(0)
      router.go('/index/users')
    }
  }
}

// 登录模块
const signin = (router) => {
  return (req, res, next) => {
    res.render(htmlSignin)
    $('#signin').on('submit', _handleSubmit(router))
  }
}

export default signin