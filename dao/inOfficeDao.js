// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
// code table access 
var db = require('../lib/dbmanager.js');
var group = 'inOffice';

var InOfficeDao = function () {
};

InOfficeDao.prototype.selectInOfficeList =  function (data) {
    if (data.id === undefined) {
        data.id = '%'
    }
    return db.query(group, "selectInOfficeList", [data.start, data.end, data.id]);
};

InOfficeDao.prototype.insertInOffice =  function (data) {
    return {
        group : group,
        item : "insertInOffice",
        data : [
                data.year, data.date, data.id, data.doc_num
        ]
    };
};

InOfficeDao.prototype.removeInOffice =  function (data) {
    console.log(data);
    return {
        group : group,
        item : "deleteInOfficeList",
        data : [
                data._id    
        ]
    };
};

module.exports = new InOfficeDao();