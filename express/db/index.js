const mongoose = require('mongoose')
const bluebird = require('bluebird')

const connectDb = () => {
  mongoose.Promise = bluebird

  const options = {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    dbName: `${ process.env.MONGODB_DATABASE }`
  }
  mongoose.connect(`mongodb://${ process.env.MONGODB_HOST }:27017`, options)
  return mongoose.connection
}


connectDb()
  .on('error', console.log)
  .on('disconnected', connectDb)
  .once('open', function(){console.log('Connect to mongo')})
