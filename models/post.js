const marked = require('marked')
const Post = require('../lib/mongo').Post
const CommentModel = require('./comments')

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

// 给 post 添加留言数 commentsCount
Post.plugin('addCommentsCount', {
  afterFind: (posts) => {
    return Promise.all(posts.map((post) => {
      return CommentModel.getCommentsCount(post._id).then((commentsCount) => {
        post.commentsCount = commentsCount
        return post
      })
    }))
  },
  afterFindOne: (post) => {
    if (post) {
      return CommentModel.getCommentsCount(post._id).then((count) => {
        post.commentsCount = count
        return post
      })
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
      .addCreatedAt()
      .addCommentsCount()
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
      .addCommentsCount()
      .sort({ _id: -1 })
      .exec()
  },
  // 通过文章id增加pv
  incPv: (postId) => {
    return Post
      .update({ _id: postId }, { $inc: { pv: 1 } })
  },
  // 通过文章 id 获取一篇原生文章（编辑文章）
  getRawPostById: (postId) => {
    return Post
      .findOne({ _id: postId })
      .populate({ path: 'author', model: 'User' })
      .exec()
  },
  // 通过文章 id 更新一篇文章
  updatePostById: (postId, data) => {
    return Post.update({ _id: postId }, { $set: data }).exec()
  },
  // 通过文章 id 删除一篇文章
  delPostById: (postId) => {
    return Post.deleteOne({ _id: postId }).exec()
      .then((res) => {
        if (res.result.ok && res.result.n > 0) {
          return CommentModel.delCommentsByPostId(postId)
        }
      })
  }
}
