require("dotenv").config();
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
const conn = require('./db/conn');

const app = express();

// import routes
const paintingRoutes = require('./routes/paintingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

// import controller
const PaintingsController = require('./controllers/PaintingsController');

// template engine
app.engine('handlebars', exphbs.engine());
app.set('view engine','handlebars');

// receive response from body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session middleware
app.use(
    session({
        name: "session",
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        // store: new FileStore({
        //     logFn: function() {},
        //     path: require('path').join(require('os').tmpdir(), 'sessions')
        // }),
        cookie: {
            secure: false,
            maxAge: 6000000,
            // expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
);

// flash messages
app.use(flash());

// set session to res
app.use((req, res, next) => {
    if(req.session.userid || req.session.adminid) {
        res.locals.session = req.session 
    }

    next()
})

// public path
app.use(express.static('public'));

// Routes
app.use('/paintings', paintingRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.get('/', PaintingsController.showAllPaintings);

conn
    // .sync({force: true})    
    .sync()
    .then(() => {
        app.listen(3000)
        console.log('Servidor iniciado: http://localhost:3000/')
    }).catch((error) => {
        console.log(error)
    });