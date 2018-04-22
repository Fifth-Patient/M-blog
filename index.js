// 主文件
const config = require('config-lite')(__dirname)
const pkg = require('./package') // package
const path = require('path') // path
const express = require('express') // express
const route = require('./routes') // 路由
const session = require('express-session') // session
const flash = require('connect-flash') // 页面通知的中间件，基于 session 实现
const formidable = require('express-formidable') // Form 表单数据处理
const app = express() // 初始化express实例

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))

// 设置渲染引擎
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// 设置session
app.use(session({
  name: config.session.key, // skey
  secret: config.session.secret, // 用来对session id相关的cookie进行签名
  saveUninitialized: false, // 是否自动保存未初始化的会话
  resave: true, // 强制写入session
  cookie: { // 设置cookie有效期
    maxAge: config.session.maxAge
  }
}))

// falsh中间件，显示通知
app.use(flash())

// 处理表单及文件上传中间件
app.use(formidable({
  uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
  keepExtensions: true // 保留后缀
}))

// 设置模版全局变量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
}

// 添加模块必需的三个变量
app.use((req, res, next) => {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

// 挂载路由
route(app)

// 错误页面
app.use(function (err, req, res, next) {
  console.error(err)
  req.flash('error', err.message)
  res.redirect('/posts')
})

// 监听端口
app.listen(config.port, e => {
  if (e) {
    Error(e.message)
  }
  console.log(`${pkg.name} listening on port ${config.port}`)
})
