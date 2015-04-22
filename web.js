#!/usr/bin/env node
process.env.DEBUG = "*,-express:*,-send,-express-session";
var debug = require('debug')('start.js');
var app = require('./app');
var schedule = require('node-schedule');
var batch = require('./batch/batch');
// var memwatch = require('memwatch');
// var moment = require('moment');

app.set('port', process.env.PORT);
// app.set('port', 8002);
// app.set('port', 8001);

var server = app.listen(app.get('port'), function() {
    var date = new Date();
    debug(date);
    debug("==================================================================================================================");
    debug("================================================ Welcome to Saram ================================================");
    debug("==================================================================================================================");
    debug('Saram server listening on port ' + server.address().port);
    
    debug("StartBatchJob");
    schedule.scheduleJob('43 3 * * *', function(){
        batch.backupDb();
    });
});

// var memDebug = require("debug")("memDebug");

// memwatch.on('leak', function(d) {
//     memDebug("######## Memory Leak! ######## " + moment(new Date()).format("YYYYMMDD_HHmmss"));
//     memDebug("Start : " + moment(d.start).format("YYYYMMDD_HHmmss"));
//     memDebug("End : " + moment(d.end).format("YYYYMMDD_HHmmss"));
//     memDebug("Reason : " + d.reason);
//     var currentMemory = process.memoryUsage();
//     memDebug(" CurrentMemory { rss: " + currentMemory.rss + " heapTotal : " + currentMemory.heapTotal + " heapUsed : " + currentMemory.heapUsed + " }");
// });




