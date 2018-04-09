const express = require('express')
const router = express.Router()

router.get('/signout', (req, res, next) => {
  res.send('登出页面')
})

module.exports = router
