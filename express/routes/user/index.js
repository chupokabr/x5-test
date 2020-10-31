const {Router} = require('express')
const router = Router()

router.get('/api/user/get-info', (req, res) => {

  if (!req.session.user) {
    res.json({
      status: 'error',
      message: 'Вы не авторизованы'
    })
    return false;
  }

  res.json({
    status: 'ok',
    user: req.session.user
  })
})


router.get('/api/user/logout', (req, res) => {
  if (!!req.session.user) {
    req.session.auth = '';
    req.session.user = '';
  }

  res.json({
    status: 'ok',
    message: 'Вы разлогинены'
  })
})

module.exports = router
