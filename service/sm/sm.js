var express = require('express');
var debug = require('debug')('/service/sm');
var router = express.Router();
var encryptor = require('../../lib/encryptor.js');
var db = require('../../lib/dbmanager.js');
var util = require('util');


exports.selectUserAll = function(){
    var queryStr = db.getQuery('sm', 'select_user_all');
    debug(queryStr);
    db.query(queryStr, function(result){
        return result;
    });
}

module.exports = router;