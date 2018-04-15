const path = require('path')
const fs = require('fs')
const express = require('express')
const router = express.Router()
const sha1 = require('sha1')
const checkNotLogin = require('../middlewares/check').checkNotLogin
const UserModel = require('../models/users')

router.get('/signup', checkNotLogin, (req, res, next) => {
  res.render('signup')
})

router.post('/signup', checkNotLogin, (req, res, next) => {
  const { name, gender, bio, repassword, avatar = req.files.avatar.path.split(path.sep).pop() } = req.fields
  let { password = 0 } = req.fields

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符')
    }
    if (password.length < 6) {
      throw new Error('密码至少为6位字符')
    }
    if (password !== repassword) {
      throw new Error('两次输入的密码不一致')
    }
    if (['m', 'f', 'x'].indexOf === -1) {
      throw new Error('性别只能是m、f或x')
    }
    if (!req.files.avatar.name) {
      throw new Error('缺少头像')
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在 1-30 个字符')
    }
  } catch (e) {
    // 注册失败，异步删除上传头像
    fs.unlink(req.files.avatar.path)
    req.flash('error', e.message)
    return res.redirect('/signup')
  }

  password = sha1(password)

  let user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar
  }

  // 用户信息写入数据库
  UserModel.create(user)
    .then((result) => {
      // 插入mongodb后值，包含_id
      user = result.ops[0]
      // 删除密码，将用户信息存入 session
      delete user.password
      req.session.user = user
      // 写入flash
      req.flash('success', '注册成功')
      // 跳转到首页
      res.redirect('/posts')
    })
    .catch(e => {
      // 注册失败，异步删除上传头像
      fs.unlink(req.files.avatar.path)
      // 用户名被占用则跳回注册页，而不是错误页
      if (e.message.match('duplicate key')) {
        req.flash('error', '用户名已被占用')
        return res.redirect('/signup')
      }
    })
})

module.exports = router
