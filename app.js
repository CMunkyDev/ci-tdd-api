const express = require('express')
const app = express()
const PORT = process.env.port || 8000
const bodyParser = require('body-parser')
const cors = require('cors')
const {
    stories: storiesRouter
} = require('./routes')

app.disable('x-powered-by')
app.use(cors())
app.use(bodyParser.json())

app.use('/stories', storiesRouter)

app.use((req, res, next) => {
    next({status: 404, message: 'Not Found'})
})

app.use((err, req, res, next) => {
    let message = err.message || 'Something went wrong!!! oh no!'
    let status = err.status || 500
    res.status(status).json({status, message})
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

module.exports = app