#!/usr/bin/env node
process.env.DEBUG = "*,-express:*,-send,-express-session";
var debug = require('debug')('SARAM');
var app = require('./app');
// var schedule = require('node-schedule');
// var batch = require('./batch/batch');
// test
// app.set('port', process.env.PORT);
app.set('port', 8080);

var server = app.listen(app.get('port'), function() {

    var date = new Date();
    debug(date);
    debug("####################################################################");
    debug("#####      ########       ##                ######           #######");
    debug("######      #####       ###                #####              ######");
    debug("######      ###       #####     ##############      #####      #####");
    debug("######      ##      ######     ###############      ################");
    debug("#######           #######                #####          ############");
    debug("#######          #######                #######           ##########");
    debug("########       ########                ###########         #########");
    debug("########      #########      ########################      #########");
    debug("#######      #########     ##############      #######     #########");
    debug("######      #########                 ####       ##       ##########");
    debug("#####      #########                 #####              ############");
    debug("#####      #########                #########        ###############");
    debug("####################################################################");
    debug('Saram server listening on port ' + server.address().port);
    
    // schedule.scheduleJob('43 4 * * *', function(){
    //     batch.DbBackup();
    // });
});

/*

HTTPS 설정

var express = require('express');
var httpsApp = require('./app');
var https = require('https');
var http = require('http');
var fs = require('fs');

var httpApp = express();
httpApp.set('port', 80);
httpsApp.set('port', 443);

var server = https.createServer({
    //인증서 (실서버 적용시 인증서 교체필요)
    key: fs.readFileSync("./private.key"),
    cert: fs.readFileSync("./ca.cert")
}, httpsApp).listen(httpsApp.get('port'), function() {

    // HTTP Server를 별도로 생성, HTTPS로 Redirect
    http.createServer(httpApp.get("*", function(req, res) {
        res.redirect("https://" + req.headers.host + req.url);
    })).listen(httpApp.get('port'), function() {
        debug("Saram HTTP Server listening on port " + httpApp.get('port'));
    });

    var date = new Date();
    debug(date);
    //debug("==================================================================================================================");
    //debug("================================================ Welcome to Saram ================================================");
    //debug("==================================================================================================================");
    debug("####################################################################");
    debug("#####      ########       ##                ######           #######");
    debug("######      #####       ###                #####              ######");
    debug("######      ###       #####     ##############      #####      #####");
    debug("######      ##      ######     ###############      ################");
    debug("#######           #######                #####          ############");
    debug("#######          #######                #######           ##########");
    debug("########       ########                ###########         #########");
    debug("########      #########      ########################      #########");
    debug("#######      #########     ##############      #######     #########");
    debug("######      #########                 ####       ##       ##########");
    debug("#####      #########                 #####              ############");
    debug("#####      #########                #########        ###############");
    debug("####################################################################");

    debug('Saram HTTPS server listening on port ' + server.address().port);
});
*/



