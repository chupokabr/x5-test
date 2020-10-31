const {Router} = require('express')
const router = Router()

const axios = require('axios')


router.post('/api/register', (req, res) => {
  try {
    axios.post(
      `${process.env.BACKEND_API_URL}/api/auth/register`,
      {
        "name": req.body.name,
        "email": req.body.email,
        "password": req.body.password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(({data}) => {

        if (!data.status) {
          res.json({
            status: 'error',
            message: data.error
          })
          return false;
        } else {
            res.json({
              status: 'ok',
              user: data.user
            })
        }

      })
      .catch(error => {
        res.json({
          status: 'error',
          message: error.response.data.error
        })
        return false;
      })

  } catch (error) {
    res.json({
      status: 'error',
      message: 'Ошибка при регистрации'
    })
    return false;
  }
})

module.exports = router
