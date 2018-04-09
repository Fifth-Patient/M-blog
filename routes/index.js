// 路由模块入口
module.exports = (app) => {
  app.get('/', (req, res) => {
    res.redirect('/blog')
  })

  // 首页
  app.use('/', require('./blog'))
  // 账户
  app.use('/', require('./signup'))
  app.use('/', require('./signin'))
  app.use('/', require('./signout'))
  // 文章
  app.use('/posts', require('./posts'))
  // 留言
  app.use('/comments', require('./comments'))
}
