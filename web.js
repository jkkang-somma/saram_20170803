#!/usr/bin/env node
process.env.DEBUG = "*";
var debug = require('debug')('start.js');
var app = require('./app');
var schedule = require('node-schedule');
var batch = require('./batch/batch');
// var memwatch = require('memwatch');

// memwatch.on('leak', function(info){
//   console.error('Memory leak detected : ' + info);
// });

app.set('port', 8002);
var server = app.listen(app.get('port'), function() {
    debug("==================================================================================================================");
    debug("================================================ Welcome to Saram ================================================");
    debug("==================================================================================================================");
    debug('Saram server listening on port ' + server.address().port);
    
    //batchJob
    debug("StartBatchJob");
    schedule.scheduleJob('43 4 * * *', function(){
        batch.backupDb();
    });
});




