const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const mongolass = new Mongolass() // 实例化mongolass

// 建立连接
mongolass.connect(config.mongodb)

// 根据id生成创建时间_created_at
mongolass.plugin('addCreatedAt', {
  afterFind: results => {
    results.forEach(item => {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  },
  afterFindOne: result => {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
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

// 定义post文档模块
exports.Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId, required: true },
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  pv: { type: 'number', default: 0 }
})

// 正序排列作者，倒序查看用户文章列表
exports.Post.index({ author: 1, _id: -1 }).exec()

// 定义comment模块
exports.Comment = mongolass.model('Comment', {
  author: { type: Mongolass.Types.ObjectId, require: true },
  content: { type: 'string', require: true },
  postId: { type: Mongolass.Types.ObjectId, require: true }
})

// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
exports.Comment.index({ postId: 1, _id: 1 }).exec()
