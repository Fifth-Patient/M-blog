// 主文件
const config = require('config-lite')(__dirname)
// package
const pkg = require('./package')
// express
const express = require('express')
// 路由
const route = require('./routes')
// 初始化express实例
const app = express()

// 挂载路由
route(app)

// 监听端口
app.listen(config.port, e => {
  if (e) {
    Error(e.message)
  }
  console.log(`${pkg.name} listening on port ${config.port}`)
})
