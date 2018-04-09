const express = require('express')
const router = express.Router()

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
router.get('/create', (req, res, next) => {
  res.send('发表文章页')
})

// 发表文章
router.post('/create', (req, res, next) => {
  res.send('发表文章')
})

// 修改文章页
router.get('/:postId/edit', (req, res, next) => {
  res.send('修改文章页')
})

// 修改文章
router.post('/:postId/edit', (req, res, next) => {
  res.send('修改文章')
})

// 查看一篇文章（包含留言）
router.get('/:postId', (req, res, next) => {
  res.send(`id为${req.params.postId}文章的内容`)
})

module.exports = router
