// express
const express = require('express')
// 路由
const route = require('./routes')
// 初始化express实例
const app = express()
// 挂载路由
route(app)

// 监听端口
app.listen(3000, e => {
  console.log('Server is start!')
  if (e) {
    Error(e.message)
  }
})
