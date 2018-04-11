const express = require('express')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin

router.get('/signin', checkNotLogin, (req, res, next) => {
  res.send('登陆页面')
})

router.post('/signin', checkNotLogin, (req, res, next) => {
  res.send('登陆')
})

module.exports = router
