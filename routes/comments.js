const express = require('express')
const router = express.Router()

router.post('/', (req, res, next) => {
  res.send('创建留言')
})

router.get('/:commentId/remove', (req, res, next) => {
  res.send('删除留言：GET')
})

module.exports = router
