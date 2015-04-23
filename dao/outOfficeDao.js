// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
// code table access 
var db = require('../lib/dbmanager.js');
var group = "outOffice";

var OutOfficeDao = function () {
};

OutOfficeDao.prototype.selectOutOfficeList =  function () {
    return db.query(group, "selectOutOfficeList");
};

OutOfficeDao.prototype.insertOutOffice =  function (connection, data) {
    return db.queryTransaction(
        connection,
        group, "insertOutOffice",
        data,
        [
            "year", "date", "id", "office_code", "office_code",  "memo", "doc_num", "black_mark", "start_time", "end_time"
        ]
    ); 
};
OutOfficeDao.prototype.removeOutOffice =  function (connection, data) {
    return db.queryTransaction(
        connection,
        group, "deleteOutOfficeList",
        data,
        [
            "_id"
        ]
    ); 
};

module.exports = new OutOfficeDao();