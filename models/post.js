const Post = require('../lib/mongo').Post

module.exports = {
  create: (post) => {
    return Post.create(post).exec()
  }
}
