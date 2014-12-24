var express = require('express');
var express_session= require("express-session");
//var SessionStore = require('express-mysql-session');

var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var login = require('./routes/login');
var user = require('./routes/user');
var session = require('./routes/session');


//var error = require('./routes/error');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session manager setup

/*var sessionStore = new SessionStore({
    host: 'localhost',
    user: 'sangheepark',
    password : '',
    port : 3306,
    database:'c9'
});*/

app.use(express_session({
    secret:"express-saram",
    resave:false,
    loginid:"",
    //store : sessionStore,
    saveUninitialized:true
}));


app.use(logger('dev'));
// if session hasn`t loginid, redirect login page
/*app.use(function(req,res,next){
    if(!req.session.loginid && req.originalUrl != "/login"){
        res.writeHead(302, {'Location': '/login'});
        res.end();
    }else{
        next();    
    }
    
});
*/


// route page
app.use('/', index);
app.use('/login', login);
app.use('/user', user);
app.use('/session', session);
//app.use('/error', error);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
