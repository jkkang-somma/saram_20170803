// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
// code table access 

var debug = require('debug')('codeDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var DepartmentCodeDao = function () {
};
DepartmentCodeDao.prototype.selectDepartmentCodeList =  function () {
    var queryStr = util.format(db.getQuery('dept_code', 'selectDepartmentCodeList'));
    return db.queryV2(queryStr);
};

module.exports = new DepartmentCodeDao();