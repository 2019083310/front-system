function lyAxios({
  method = 'GET',
  url,
  params = {},
  data = {}
}) {
  return new Promise((resolve, reject) => {

    // 处理method方法转为大写
    method = method.toUpperCase()

    //处理query参数拼接到url上
    let queryString = ''
    Object.keys(params).forEach(key => {
      queryString += `${key}=${params[key]}&`
    })
    if (queryString) {
      // 去除最后的&
      queryString = queryString.substring(0, queryString.length - 1)
      // 拼接到url
      url += '?' + queryString
    }

    // 创建ajax请求方式
    // 1.创建xhr对象
    const xhr = new XMLHttpRequest()

    // 2.设置请求的方式及参数
    xhr.open(method, url, true)

    // 3.发送请求
    if (method === 'GET' || method === 'DELETE') {
      xhr.send()
    } else if (method === 'POST' || method === 'PUT') {
      // 设置请求头，告诉服务器发送的数据的格式
      xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
      xhr.send(JSON.stringify(data))
    }

    // 4.判断请求的状态
    xhr.onreadystatechange = function () {
      //如果请求没有完成,直接结束
      if (xhr.readyState !== 4) {
        return;
      }
      const {status,statusText}=xhr
      if (status >= 200 && status < 300) {

        // 5.接受响应信息
        //准备结果数据对象response
        const response = {
          data: JSON.parse(xhr.response),
        }
        return resolve(response)
      } else {
        reject(new Error('request error is' + xhr.status))
      }
    }

  })
}