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