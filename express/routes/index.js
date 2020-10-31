const {Router} = require('express')
const router = Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')
const redis = require("redis");
const redisStore = require('connect-redis')(session);


//init mongo db connection
require('../db')

router.use(cors())
router.use(bodyParser.json())

const clientRedis = redis.createClient({
  host: `${process.env.REDIS_HOST}`,
  port: 6379
});
router.use(session({
  secret: 'x5-secret',
  name: 'x5-sess',
  store: new redisStore({
    client: clientRedis,
    ttl: 86400
  }),
  saveUninitialized: false,
  resave: false
}))

const register = require('./register')
const login = require('./login')
const spreadsheets = require('./spreadsheets')
const user = require('./user')

//use routes
router.use(register)
router.use(login)
router.use(spreadsheets)
router.use(user)


module.exports = router
