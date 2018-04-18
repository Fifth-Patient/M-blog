const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin
const Postmodel = require('../models/post')

// 个人主页
router.get('/', (req, res, next) => {
  let { author } = req.query

  Postmodel.getPosts(author)
    .then(posts => {
      res.render('posts', { posts })
    })
    .catch(next)
})

// 发表文章页
router.get('/create', checkLogin, (req, res, next) => {
  res.render('create')
})

// 发表文章
router.post('/create', checkLogin, (req, res, next) => {
  const { author = req.session.user._id, title, content } = req.fields

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  let post = { author, title, content }

  Postmodel.create(post)
    .then(result => {
      post = result.ops[0]
      req.flash('success', '发布成功')
      res.redirect(`/posts/${post._id}`)
    })
    .catch(next)
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
  const postId = req.params.postId

  Promise.all([
    Postmodel.getPostsById(postId),
    Postmodel.incPv(postId)
  ])
    .then((result) => {
      const post = result[0]
      if (!post) {
        throw new Error('该文章不存在')
      }
      res.render('post', {post: post})
    })
    .catch(next)
})

// 删除一篇文章
router.get('/:postId.remove', checkLogin, (req, res, next) => {
  res.send('删除文章')
})

module.exports = router
