// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
// code table access 

var debug = require('debug')('InOfficeDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var InOfficeDao = function () {
};
InOfficeDao.prototype.selectInOfficeList =  function () {
    var queryStr = util.format(db.getQuery('inOffice', 'selectInOfficeList'));
    return db.queryV2(queryStr);
};
InOfficeDao.prototype.insertInOffice =  function (_data) {
    var queryStr = util.format(db.getQuery('inOffice', 'insertInOffice'));
    var year = _data.date + "";
    year = year.substr(0,4);
    
    return db.queryV2(queryStr, [year, _data.date, _data.id, _data.doc_num]);
};
module.exports = new InOfficeDao();