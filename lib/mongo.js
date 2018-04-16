const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const moment = require('moment')
const objectIdToTimeStamp = require('objectid-to-timestamp')
const mongolass = new Mongolass() // 实例化mongolass

// 建立连接
mongolass.connect(config.mongodb)

// 根据id生成创建时间_created_at
mongolass.plugin('addCreatedAt', {
  afterFind: results => {
    results.forEach(item => {
      item.create_at = moment(objectIdToTimeStamp(item.id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  },
  afterFindOne: result => {
    if (result) {
      result.create_at = moment(objectIdToTimeStamp(result.id)).format('YYYY-MM-DD HH:mm')
    }
    return result
  }
})

// 定义user文档模块
exports.User = mongolass.model('User', {
  name: { type: 'string', required: true },
  password: { type: 'string', required: true },
  avatar: { type: 'string', required: true },
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: ['x'] },
  bio: { type: 'string', required: true }
})

// 索引
exports.User.index({ name: 1 }, { unique: true }).exec() // 根据用户名找到用户，用户名全局唯一
