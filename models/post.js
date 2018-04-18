const marked = require('marked')
const Post = require('../lib/mongo').Post

// 将 post 的 content 从 markdown 转换成 html
Post.plugin('contentToHtml', {
  afterFind: (posts) => {
    return posts.map((post) => {
      post.content = marked(post.content)
      return post
    })
  },
  afterFindOne: (post) => {
    if (post) {
      post.content = marked(post.content)
    }
    return post
  }
})

module.exports = {
  // 创建文章
  create: (post) => {
    return Post.create(post).exec()
  },
  // 通过id查找一篇文章
  getPostsById: (postId) => {
    return Post
      .findOne({ _id: postId })
      .populate({ path: 'author', model: 'User' })
      .contentToHtml()
      .exec()
  },
  // 时间倒序查找指定用户文章
  getPosts: (author) => {
    const query = {}
    if (author) {
      query.author = author
    }
    return Post
      .find(query)
      .populate({ path: 'author', model: 'User' })
      .addCreatedAt()
      .contentToHtml()
      .sort({ _id: -1 })
      .exec()
  },
  // 通过文章id增加pv
  incPv: (postId) => {
    return Post
      .update({ _id: postId }, { $inc: { pv: 1 } })
  }
}
