const express = require('express');
const { request, response } = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');


const helpers = require('./helpers');

require('./models/usuarios');
require('./models/misPedidos');
const db = require('./config/db');

db.sync()
    .then(()=> console.log('Conectado'))
    .catch(error => console.log(error))

const app = express();

app.use(express.static('public'));

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, './views'));

app.use(flash());

//manejo sesiones
app.use(cookieParser());
app.use(session({
    secret:'Secreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());

app.use(passport.session());

app.use((request, response, next)=> {
    response.locals.vardump = helpers.vardump;
    response.locals.mensajes= request.flash();
    response.locals.user=request.user;
    next();
})



app.use('/', routes()); 




app.listen(2000);