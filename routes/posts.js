const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin

// 个人主页
router.get('/', (req, res, next) => {
  let { author } = req.query
  if (author) {
    res.send(`这是${author}的主页!`)
  }
  next()
})

// 文章主页
router.get('/', (req, res, next) => {
  res.send('文章主页')
})

// 发表文章页
router.get('/create', checkLogin, (req, res, next) => {
  res.send('发表文章页')
})

// 发表文章
router.post('/create', checkLogin, (req, res, next) => {
  res.send('发表文章')
})

// 修改文章页
router.get('/:postId/edit', checkLogin, (req, res, next) => {
  res.send('修改文章页')
})

// 修改文章
router.post('/:postId/edit', checkLogin, (req, res, next) => {
  res.send('修改文章')
})

// 查看一篇文章（包含留言）
router.get('/:postId', (req, res, next) => {
  res.send(`id为${req.params.postId}文章的内容`)
})

// 删除一篇文章
router.get('/:postId.remove', checkLogin, (req, res, next) => {
  res.send('删除文章')
})

module.exports = router
