const express = require('express')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin

router.get('/signup', checkNotLogin, (req, res, next) => {
  res.send('注册页面')
})

router.post('/signup', checkNotLogin, (req, res, next) => {
  res.send('注册')
})

module.exports = router
