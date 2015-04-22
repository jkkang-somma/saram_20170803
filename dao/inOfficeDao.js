// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
// code table access 
var db = require('../lib/dbmanager.js');
var group = 'inOffice';

var InOfficeDao = function () {
};

InOfficeDao.prototype.selectInOfficeList =  function () {
    return db.query(group, "selectInOfficeList");
};

InOfficeDao.prototype.insertInOffice =  function (connection, data) {
    return db.queryTransaction(
        connection,
        group, 
        "insertInOffice",
        data,
        [
            "year", "date", "id", "doc_num"
        ]
    ); 
};

InOfficeDao.prototype.removeInOffice =  function (connection, data) {
     return db.queryTransaction(
        connection,
        group, 
        "deleteInOfficeList",
        data,
        [
            "_id"
        ]
    ); 
};

module.exports = new InOfficeDao();