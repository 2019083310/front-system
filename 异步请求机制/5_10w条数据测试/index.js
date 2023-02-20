// 封装一个ajax请求函数

function getList() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open('get', 'http://localhost:5000')

    xhr.send()

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText))
      }
    }
  })
}

// 获取container对象
// const container = document.querySelector('#container')

//方法1-直接渲染
// 一次渲染10w个节点，非常耗时，差不多要7s
// async function renderList() {
//   console.time('列表时间')
//   const list = await getList()
//   list.forEach(item => {
//     const divEl = document.createElement('div')
//     divEl.className = 'coder'
//     divEl.innerHTML = `<img src=${item.src} /><span>${item.text}</span>`
//     container.appendChild(divEl)
//   })

//   console.timeEnd('列表时间')
// }

// 方法2-setTimeout分页渲染
// 时间不到1秒 
// async function renderList() {
//   console.time('列表时间')
//   const list = await getList()
//   const total = list.length

//   const page = 0
//   const limit = 200
//   const totalPage = Math.ceil(total / limit)

//   function render(page) {
//     if (page >= totalPage) return
//     setTimeout(() => {
//       for (let i = page * limit; i < page * limit + limit; i++) {
//         const item = list[i]
//         const divEl = document.createElement('div')
//         divEl.className = 'coder'
//         divEl.innerHTML = `<img src=${item.src} /><span>${item.text}</span>`
//         container.appendChild(divEl)
//       }

//       render(page+1)
//     },0)
//   }

//   render(page)
//   console.timeEnd('列表时间')
// }

// 方法3-使用requestAnimationFrame替代setTimeout减少重排次数,极大的提高了性能
// 不到0.5秒 400多毫秒
// async function renderList() {
//   console.time('列表时间')
//   const list = await getList()
//   const total = list.length

//   const page = 0
//   const limit = 200
//   const totalPage = Math.ceil(total / limit)

//   function render(page) {
//     if (page >= totalPage) return
//     requestAnimationFrame(() => {
//       for (let i = page * limit; i < page * limit + limit; i++) {
//         const item = list[i]
//         const divEl = document.createElement('div')
//         divEl.className = 'coder'
//         divEl.innerHTML = `<img src=${item.src} /><span>${item.text}</span>`
//         container.appendChild(divEl)
//       }

//       render(page+1)
//     })
//   }

//   render(page)
//   console.timeEnd('列表时间')
// }

// 方法4-文档碎片+requestAnimationFrame    300多毫秒
// 不必每次创建一个div就立即添加到页面。可以先把一个页面所有的div放到fragment文档碎片中
// 然后一次性的添加到container中
// 浏览器不会渲染文档碎片
// async function renderList() {
//   console.time('列表时间')
//   const list = await getList()
//   const total = list.length

//   const page = 0
//   const limit = 200
//   const totalPage = Math.ceil(total / limit)

//   function render(page) {
//     if (page >= totalPage) return
//     // 创建一个文档碎片
//     const fragment=document.createDocumentFragment()
//     requestAnimationFrame(() => {
//       for (let i = page * limit; i < page * limit + limit; i++) {
//         const item = list[i]
//         const divEl = document.createElement('div')
//         divEl.className = 'coder'
//         divEl.innerHTML = `<img src=${item.src} /><span>${item.text}</span>`
//         fragment.appendChild(divEl)
//       }

//       container.appendChild(fragment)
//       render(page+1)
//     })
//   }

//   render(page)
//   console.timeEnd('列表时间')
// }

// 方法5-图片懒加载--见imageLazy文件夹

// 方法6-虚拟列表--见imageLazy文件夹

// renderList()