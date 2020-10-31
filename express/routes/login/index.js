const {Router} = require('express')
const router = Router()
const axios = require('axios')
const bodyParser = require('body-parser')
const cors = require('cors')

router.use(cors())
router.use(bodyParser.json())


router.post('/api/login', (req, res) => {
  try {
    axios.post(
      `${ process.env.BACKEND_API_URL }/api/auth/login`,
      {
        "email": req.body.email,
        "password": req.body.password
      },
      {
        headers: {
          'Content-Type': 'application/json'
         }
      }
    )
    .then(({ data }) => {
      if (!data.status) {
        res.json({
          status: 'error',
          message: data
        })
        return false;
      } else {
       axios.get(
          `${ process.env.BACKEND_API_URL }/api/user/info`,
          {
            headers: {
              "Authorization": `Bearer ${ data.token }`
            }
          }
        ).then(result => {

         req.session.auth = true
         req.session.user = result.data.user;

          res.json({
            status: 'ok',
            user: result.data.user
          })
        })
      }

    })
    .catch(error => {
      res.json({
        status: 'error',
        message: error.response ? error.response.data.error : "Не удалось подключиться к backend серверу"
      })
      return false;
    })

  } catch(error) {
    res.json({
      status: 'error',
      message: 'Ошибка при авторизации'
    })
    return false;
  }
})


module.exports = router
