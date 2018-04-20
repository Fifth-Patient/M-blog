const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin
const PostModel = require('../models/post')
const CommentModel = require('../models/comments')

// 个人主页
router.get('/', (req, res, next) => {
  let { author } = req.query
  PostModel.getPosts(author)
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

  PostModel.create(post)
    .then(result => {
      post = result.ops[0]
      req.flash('success', '发布成功')
      res.redirect(`/posts/${post._id}`)
    })
    .catch(next)
})

// 修改文章页
router.get('/:postId/edit', checkLogin, (req, res, next) => {
  const postId = req.params.postId
  const author = req.session.user._id
  PostModel.getRawPostById(postId)
    .then((post) => {
      if (!post) {
        throw new Error('该文章不存在')
      }
      if (author.toString() !== post.author._id.toString()) {
        throw new Error('权限不足')
      }
      res.render('edit', { post: post })
    })
    .catch(next)
})

// 修改文章
router.post('/:postId/edit', checkLogin, (req, res, next) => {
  const postId = req.params.postId
  const author = req.session.user._id
  const { title, content } = req.fields

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

  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('没有权限')
      }
      PostModel.updatePostById(postId, { title: title, content: content })
        .then(function () {
          req.flash('success', '编辑文章成功')
          // 编辑成功后跳转到上一页
          res.redirect(`/posts/${postId}`)
        })
        .catch(next)
    })
    .catch(next)
})

// 查看一篇文章（包含留言）
router.get('/:postId', (req, res, next) => {
  const postId = req.params.postId

  Promise.all([
    PostModel.getPostsById(postId), // 获取文章信息
    CommentModel.getComments(postId), // 获取该文章所有留言
    PostModel.incPv(postId) // 获取该文章所有留言
  ])
    .then((result) => {
      const post = result[0]
      const comments = result[1]
      if (!post) {
        throw new Error('该文章不存在')
      }
      res.render('post', { post: post, comments: comments })
    })
    .catch(next)
})

// 删除一篇文章
router.get('/:postId/remove', checkLogin, (req, res, next) => {
  const postId = req.params.postId
  const author = req.session.user._id

  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('没有权限')
      }
      PostModel.delPostById(postId)
        .then(function () {
          req.flash('success', '删除文章成功')
          // 删除成功后跳转到主页
          res.redirect('/posts')
        })
        .catch(next)
    })
})

module.exports = router
