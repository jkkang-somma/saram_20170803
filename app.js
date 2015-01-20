var express = require('express');
var express_session= require("express-session");
//var favicon = require('serve-favicon');

var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var multer = require('multer');

var sessionManager = require('./lib/sessionManager');

var index = require('./routes/index');
var user = require('./routes/userRouter');
var session = require('./routes/sessionRouter');
var rawData = require('./routes/rawDataRouter');
var holiday = require('./routes/holidayRouter');
var vacation = require('./routes/vacationRouter');
var approval = require('./routes/approvalRouter');
var code = require('./routes/codeRouter');
var commute = require('./routes/commuteRouter');
var changeHistory = require('./routes/changeHistoryRouter');
var outOffice = require('./routes/outofficeRouter');
var inOffice = require('./routes/inofficeRouter');
var officeCode = require('./routes/officeCodeRouter');
var comment = require('./routes/commentRouter');
var department = require('./routes/departmentCodeRouter');
//var error = require('./routes/error');


//var sass = require('node-sass-middleware')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

// set bodyParser(Body Limit 50mb)
app.use(bodyParser.urlencoded({limit: '80mb', extended: true}));
app.use(bodyParser.json({limit: '80mb'}));
app.use(bodyParser({limit : '80mb'}));

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
    //store : sessionStore,
    saveUninitialized:true
}));

// app.use(
//     sass({
//         src: __dirname + '/sass', 
//         dest: __dirname + '/css/sass',
//         debug: true,   
//         outputStyle: 'expanded',
//         prefix: '/style'    
//     })
// );

var authError=function(next){
    var err = new Error('not Authoryty');
    err.status = 401;
    next(err);
}

app.use(logger('dev'));

// if session hasn`t loginid, redirect login page
app.use(function(req,res,next){
    if(req.originalUrl == "/session"||req.originalUrl == "/"){
        next();
    }else{     
        if (req.cookies.saram) {//cookie가 있을 때.
            if (sessionManager.validationCookie(req.cookies.saram)){
                next();
            } else {//유효하지 않은 cookie 삭제.
            
                sessionManager.remove(req.cookies.saram);
                res.clearCookie("saram");
                authError(next);
            }
        } else {// 아예 세션 정보가 없을 때.
            authError(next);
        }
    }
});

var debug = require('debug')('APP');
// route page
app.use('/', index);
app.use('/user', user);
app.use('/session', session);
app.use('/rawdata', rawData);
app.use('/holiday', holiday);
app.use('/vacation', vacation);
app.use('/approval', approval);
app.use('/code', code);
app.use('/commute', commute);
app.use('/changeHistory', changeHistory);
app.use('/outOffice',outOffice);
app.use('/inOffice',inOffice);
app.use('/officeCode',officeCode);
app.use('/comment', comment);
app.use('/department', department);

//app.use('/error', error);


// catch 404 and forward to error handler
app.use(function(req, res, next) {//위에 라우터에까지 안걸리면 404 처리 .
    var err = new Error('Invalid URL.');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {//최종적으로 에러 날리는곳 따로 에러 처리 안되고 쓰로우 되면 여기 탐.
    debug("Not Catch Error");
    res.status(err.status || 500);
    res.send({
        message: err.message,
        success: false,
        err:err
    });
});
module.exports = app;
