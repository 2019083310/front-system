# Promise重要知识点总结

###  1.什么是promise?

promise是在js中进行异步编程的新的解决方案，以前旧的解决方案是单纯使用回调函数，从语法上来说，Promise是一个构造函数，从功能上来说，promise对象用来封装一个异步操作，并且可以获得成功或者失败的返回值。

### 2.为什么使用promise？

```javascript
1.promise使用回调函数更灵活，旧的回调函数必须在启动异步任务前指定。
2.promise支持链式调用，可以解决回调地狱问题。
	回调地狱带来的问题：
    	代码臃肿，可读性差，可维护性差，代码复用性差，容易产生bug，只能在回调里处理异常
```

### 3.promise的三种状态

```javascript
pending:未决定的
resolved:成功的
rejected:失败的
	pending-->resolved,从未决定状态到成功
	pending-->rejected,从未决定状态到失败
特别要注意的是：状态一旦改变，仅能改变一次，无论成功或者失败都只有一个值
```

### 4.promise的工作流程

![img](https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fupload-images.jianshu.io%2Fupload_images%2F25612199-3f73cc01a685293d.png&refer=http%3A%2F%2Fupload-images.jianshu.io&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1639552069&t=0e769215b93c47b72fc5acf5d5f4e363)

### 5.promise常用的API

```javascript
1.构造函数
Promise((exector){})//exector执行器函数，里面有两个参数也是函数,resolve和reject
2.then()方法
Promise.prototype.then((Onresolved,Onrejected)=>{})
成功执行Onresolved函数,失败执行Onrejected函数
3.Promise.prototype.catch()//专门处理reject结果
4.Promise.resolve(value)
	value成功的数据或者Promise对象，该方法会返回一个成功或者失败的Promise对象
    value如果为非Promise对象，则结果为成功的Promise对象，value如果为Promise对象，这结果是由参数value返回的值来决定
5.Promise.reject(reason)
	无论传入什么，只返回一个失败的Promise对象
6.Promise.all(promises)方法
	promises为包含几个Promise对象的数组
    //返回一个新的promise对象，只有所有的promise都成功才会成功，只要有一个失败就会失败，失败的结果为第一个失败的promise得值
7.Promise.race(promises)方法
	该方法和promise.all()方法类似，不同的是第一个完成的Promise的结果为最终的结果
```

### 6.Promise的异常穿透和中断promise链

```javascript
异常穿透：如果前面的promise结果失败，都会调用最后的catch()处理方法
中断promise链:在then()方法中返回一个pending状态的promsie对象就会中断promise链
```

### 7.手写promise

```javascript
function Promise(executor) {
    //添加状态属性与结果值属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    //定义callback属性，保存Pending状态的回调函数
    this.callbacks = [];
    //保存实例化对象的this值
    const self = this;
    //自定义reslove函数,名字不一定拥resolve
    function resolve(data) {
        if (self.PromiseState !== 'pending') {
            return;
        }
        //改变状态属性
        self.PromiseState = 'fulfilled';
        self.PromiseResult = data;
        //异步任务成功后执行回调函数
        setTimeout(() => {
            self.callbacks.forEach(item => {
                item.onResolved(data);
            })
        })
    }
    //自定义reject函数
    function reject(data) {
        //判断状态是否修改过，改过就直接返回
        if (self.PromiseState !== 'pending') {
            return;
        }
        //改变状态属性
        self.PromiseState = 'rejected';
        self.PromiseResult = data;
        //异步任务失败后执行回调函数
        setTimeout(() => {
            self.callbacks.forEach(item => {
                item.onRejected(data);
            })
        })
    }
    try {
        //同步调用【执行器函数】
        executor(resolve, reject);
    } catch (e) {
        //更改Promise对象为失败
        reject(e);
    }
}
//添加then方法
Promise.prototype.then = function (onResolved, onRejected) {
    const that = this;
    //判断回调函数是否存在
    if (typeof onRejected !== 'function') {
        onRejected = reason => {
            throw reason;
        }
    }
    if (typeof onResolved !== 'function') {
        onResolved = value => value;
    }
    return new Promise((resolve, reject) => {
        //封装重复部分
        function callback(type) {
            try {
                //获取回调函数执行结果
                let result = type(that.PromiseResult);
                //判断
                if (result instanceof Promise) {
                    //如果是Promise对象
                    result.then(v => {
                        resolve(v);
                    }, r => {
                        reject(r)
                    })
                } else {
                    resolve(result);
                }
            } catch (e) {
                reject(e);
            }
        }
        //如果Promise状态为fulfilled回调这个函数
        if (this.PromiseState === 'fulfilled') {
           setTimeout(()=>{
               callback(onResolved);
           })
        }
        //如果Promise状态为rejected回调这个函数
        if (this.PromiseState === 'rejected') {
            //将结果值传入
            setTimeout(()=>{
                callback(onRejected);
            })
        }
        //如果Promise状态为pending，保存回调函数
        if (this.PromiseState === 'pending') {
            this.callbacks.push({
                onResolved: function () {
                    callback(onResolved);
                },
                onRejected: function () {
                    callback(onRejected);
                }
            })
        }
    })
}
//添加catch方法
Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected);
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
        let count = 0;
        //存放成功结果数组
        let arr = [];
        //遍历全部
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(v => {
                //能进到证明为成功
                count++;
                //保存成功结果
                arr[i] = v;
                //如果全部成功
                if (count === promises.length) {
                    resolve(arr);
                }
            }, r => {
                //能进到证明为失败
                reject(r);
            });
        }
    })
}

//添加race方法
Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        //遍历全部
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(v => {
                //能进到为成功
                resolve(v);
            }, r => {
                //能进到就失败
                reject(r);
            })
        }
    })
}
```