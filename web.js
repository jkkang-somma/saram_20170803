#!/usr/bin/env node
var debug = require('debug')('start.js');
var app = require('./app');
var schedule = require('node-schedule');
var batch = require('./batch/batch');

//app.set('port', process.env.PORT);
// app.set('port', 80);
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




