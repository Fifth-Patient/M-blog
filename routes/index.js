module.exports = (app) => {
  app.get('/', (req, res) => {
    res.redirect('/blog')
  })

  app.use('/', require('./blog'))
}
