function Promise(executor) {
  //添加状态属性与结果值属性
  this.PromiseState = 'pending'
  this.PromiseResult = null

  //定义callbacks属性，保存pending状态
  this.callbacks = []

  //保存实例化对象的this 值
  const that = this

  //自定义resolve函数
  function resolve(data) {
    if (that.PromiseState !== 'pending') {
      return;
    }
    //改变状态属性
    that.PromiseState = 'resolved'
    that.PromiseResult = data

    //异步任务成功后执行回调函数
    setTimeout(() => {
      that.callbacks.forEach(item => {
        item.onResolved(data)
      })
    })
  }
  //自定义reject函数
  function reject(reason) {
    if (that.PromiseState !== 'pending') {
      return;
    }
    that.PromiseState = 'rejected'
    that.PromiseResult = reason

    //异步任务成功后执行回调函数
    setTimeout(() => {
      that.callbacks.forEach(item => {
        item.onRejected(reason)
      })
    })
  }
  try {
    //同步调用执行器函数
    executor(resolve, reject)
  } catch (e) {
    //更改Promise对象为失败
    reject(e)
  }
}
//添加then方法
Promise.prototype.then = function (onResolved, onRejected) {
  const self = this

  //判断回调函数是否存在
  if (typeof onRejected !== 'function') {
    onRejected = reason => {
      throw reason
    }
  }
  if (typeof onResolved !== 'function') {
    onResolved = value => value
  }

  return new Promise((resolve, reject) => {
    //封装重复部分
    function callback(type) {
      try {
        //获取回调函数执行结果
        let result = type(self.PromiseResult)
        //判断
        if (result instanceof Promise) {
          //如果是Promise对象
          result.then(v => {
            resolve(v)
          }, r => {
            reject(r)
          })
        } else {
          resolve(result)
        }
      } catch (e) {
        reject(e)
      }
    }
    
    //如果Promise状态变为resolved回调这个函数
    if (this.PromiseState === 'resolved') {
      setTimeout(() => {
        callback(onResolved)
      })
    }

    //如果Promise状态变为rejected回调这个函数
    if (this.PromiseState === 'rejected') {
      setTimeout(() => {
        callback(onRejected)
      })
    }

    //如果Promise状态为pending，保存这个回调函数
    if (this.PromiseState === 'pending') {
      this.callbacks.push({
        onResolved() {
          callback(onResolved)
        },
        onRejected() {
          callback(onRejected)
        }
      })
    }
  })
}

//添加resolve方法
Promise.resolve = function (value) {
  //返回Promise对象
  return new Promise((resolve, reject) => {
    if (value instanceof Promise) {
      value.then(v => {
        resolve(v);
      }, r => {
        reject(r);
      })
    } else {
      resolve(value);
    }
  })
}

//添加reject方法
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  })
}

//添加all方法
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    //添加变量
    let count = 0
    //存放成功的数组
    let arr = []
    //遍历全部
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(v => {
        //能进到证明成功
        count++
        //保存成功结果
        arr[i] = v
        if (count === promises.length) {
          resolve(arr)
        }
      }, r => {
        //能进到证明为失败
        reject(r)
      })
    }
  })
}
//添加race方法
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(v => {
        resolve(v)
      }, r => {
        reject(r)
      })
    }
  })
}