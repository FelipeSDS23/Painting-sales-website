const express = require('express')
const exphbs = require('express-handlebars')
const conn = require('./db/conn')

const app = express()

// import routes
const paintingRoutes = require('./routes/paintingRoutes')
const adminRoutes = require('./routes/adminRoutes')

// import controller
const PaintingsController = require('./controllers/PaintingsController')

// template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine','handlebars')

// receber resposta do body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// public path
app.use(express.static('public'))

// Routes
app.use('/paintings', paintingRoutes)
app.use('/admin', adminRoutes)
app.get('/', PaintingsController.showAllPaintings)

conn
    // .sync({force: true})    
    .sync()
    .then(() => {
        app.listen(3000)
    }).catch((error) => {
        console.log(error)
    })