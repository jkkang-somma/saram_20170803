#!/usr/bin/env node
var debug = require('debug')('start.js');
var app = require('./app');

app.set('port', process.env.PORT);
var server = app.listen(app.get('port'), function() {
    debug("==================================================================================================================");
    debug("================================================ Welcome to Saram ================================================");
    debug("==================================================================================================================");
    debug('Saram server listening on port ' + server.address().port);
    debug("dddxxxxdd");
});
