const express = require('express')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin

router.get('/signin', checkNotLogin, (req, res, next) => {
  res.send('signin')
})

router.post('/signin', checkNotLogin, (req, res, next) => {
  res.send('登陆')
})

module.exports = router
