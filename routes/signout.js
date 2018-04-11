const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin

router.get('/signout', checkLogin, (req, res, next) => {
  res.send('登出页面')
})

module.exports = router
