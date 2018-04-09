const express = require('express')
const router = express.Router()

router.get('/signin', (req, res, next) => {
  res.send('登陆页面')
})

router.post('/signin', (req, res, next) => {
  res.send('登陆')
})

module.exports = router
