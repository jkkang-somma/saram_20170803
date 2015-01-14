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
module.exports = new OutOfficeDao();