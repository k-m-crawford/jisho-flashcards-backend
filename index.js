const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
require('dotenv').config()
app.use(express.json())
app.use(cors())

if(process.env.NODE_ENV === 'production') 
  app.use(express.static('build'))

const jishoProxyRouter = require('./controllers/jishoproxy')
const dbPath = require('./controllers/databasepath')
const userPath = require('./controllers/userpath')
app.use('/api/', jishoProxyRouter)
app.use('/api/db/', dbPath)
app.use('/api/users/', userPath)

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'))
})

const url = process.env.MONGODB_URI

console.log('connecting to ', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true, useCreateIndex: true })
        .then(() => {
            console.log('connected to mongoDB')
        })
        .catch((e) => {
            console.log('failure connecting to mongoDB : ', e.message)
        })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

