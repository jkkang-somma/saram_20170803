// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
// code table access 

var debug = require('debug')('InOfficeDao');
var db = require('../lib/dbmanager.js');

var InOfficeDao = function () {
};
InOfficeDao.prototype.selectInOfficeList =  function () {
    var queryStr = db.getQuery('inOffice', 'selectInOfficeList');
    return db.queryV2(queryStr);
};
InOfficeDao.prototype.insertInOffice =  function (connection, data) {
    var queryStr = db.getQuery('inOffice', 'insertInOffice');
    return db.queryTransaction(
        connection,
        queryStr,
        data,
        [
            "year", "date", "id", "doc_num"
        ]
    ); 
};
InOfficeDao.prototype.removeInOffice =  function (connection, data) {
    var queryStr = db.getQuery('inOffice', 'deleteInOfficeList');
     return db.queryTransaction(
        connection,
        queryStr,
        data,
        [
            "_id"
        ]
    ); 
};
module.exports = new InOfficeDao();