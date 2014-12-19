var express = require('express');
var session= require("express-session");
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var login = require('./routes/login');
//var error = require('./routes/error');
var sm = require('./routes/sm/sm');
var am = require('./routes/am/am');

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
app.use(session({
    secret:"express-saram",
    resave:false,
    loginid:"",
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

//MySQL Connection Setup
/*app.use(
    connection(mysql,{
        host: 'localhost',
        user: 'sangheepark',
        password : '',
        port : 3306,
        database:'c9'
    },'pool')
);
*/


// route page
app.use('/', index);
app.use('/login', login);
app.use('/sm', sm);
app.use('/am', am);
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
