var debug = require('debug')('codeDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var CodeV2Dao = function () {
};

CodeV2Dao.prototype.getDepartmentCode =  function () {
    var queryStr = util.format(db.getQuery('code', 'getDepartmentCode'));
    return db.queryV2(queryStr);
};

CodeV2Dao.prototype.getOfficeCode =  function () {
    var queryStr = util.format(db.getQuery('code', 'getOfficeCode'));
    return db.queryV2(queryStr);
};

CodeV2Dao.prototype.getOvertimeCode =  function () {
    var queryStr = util.format(db.getQuery('code', 'getOvertimeCode'));
    return db.queryV2(queryStr);
};

CodeV2Dao.prototype.getWorktypeCode =  function () {
    var queryStr = util.format(db.getQuery('code', 'getWorktypeCode'));
    return db.queryV2(queryStr);
};
		
module.exports = new CodeV2Dao();