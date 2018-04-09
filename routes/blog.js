const express = require('express')
const router = express.Router()

router.get('/blog', (req, res, next) => {
  res.send('root path!')
})

module.exports = router
