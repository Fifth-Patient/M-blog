const express = require('express')
const router = express.Router()

router.get('/signup', (req, res, next) => {
  res.send('注册页面')
})

router.post('/signup', (req, res, next) => {
  res.send('注册')
})

module.exports = router
