#!/usr/bin/env node
process.env.DEBUG = "*,-express:*,-send,-express-session";
var debug = require('debug')('SARAM');
var app = require('./app');
// var schedule = require('node-schedule');
// var batch = require('./batch/batch');
//test
//app.set('port', process.env.PORT);
// app.set('port', 8002);
 app.set('port', 8001);

var server = app.listen(app.get('port'), function() {
    var date = new Date();
    debug(date);
    debug("==================================================================================================================");
    debug("================================================ Welcome to Saram ================================================");
    debug("==================================================================================================================");
    debug('Saram server listening on port ' + server.address().port);
    
    // schedule.scheduleJob('43 4 * * *', function(){
    //     batch.DbBackup();
    // });
    
   
});

