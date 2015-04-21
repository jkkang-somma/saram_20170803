// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
// code table access 

var debug = require('debug')('OutOfficeDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var OutOfficeDao = function () {
};
OutOfficeDao.prototype.selectOutOfficeList =  function () {
    var queryStr = util.format(db.getQuery('outOffice', 'selectOutOfficeList'));
    return db.queryV2(queryStr);
};

OutOfficeDao.prototype.insertOutOffice =  function (connection, data) {
    var queryStr = util.format(db.getQuery('outOffice', 'insertOutOffice'));
    return db.queryTransaction(
        connection,
        queryStr,
        data,
        [
            "year", "date", "id", "office_code", "office_code",  "memo", "doc_num", "black_mark", "start_time", "end_time"
        ]
    ); 
};
OutOfficeDao.prototype.removeOutOffice =  function (connection, data) {
    var queryStr = util.format(db.getQuery('outOffice', 'deleteOutOfficeList'));
    return db.queryTransaction(
        connection,
        queryStr,
        data,
        [
            "_id"
        ]
    ); 
};


module.exports = new OutOfficeDao();