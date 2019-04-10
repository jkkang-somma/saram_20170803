// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
// code table access 
var db = require('../lib/dbmanager.js');
var group = "outOffice";

var OutOfficeDao = function () {
};

OutOfficeDao.prototype.selectOutOfficeList =  function (data) {
    if (data.id === undefined) {
        data.id = '%'
    }
    return db.query(group, "selectOutOfficeList", [data.start, data.end, data.id]);
};

OutOfficeDao.prototype.insertOutOffice =  function (data) {
    return {
        group : group,
        item : "insertOutOffice",
        data : [
                data.year, data.date, data.id, data.office_code, data.office_code, data. memo, data.doc_num, data.black_mark, data.start_time, data.end_time
        ]
    };
};
OutOfficeDao.prototype.removeOutOffice =  function (data) {
    return {
        group : group,
        item : "deleteOutOfficeList",
        data : [
                data._id
        ]
    };
};

module.exports = new OutOfficeDao();