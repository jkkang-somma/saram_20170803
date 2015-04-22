// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
// code table access 

var debug = require('debug')('codeDao');
var db = require('../lib/dbmanager.js');

var OfficeCodeDao = function () {
};
OfficeCodeDao.prototype.selectOfficeCodeList =  function () {
    var queryStr = util.format(db.getQuery('office_code', 'selectOfficeCodeList'));
    return db.queryV2(queryStr);
};
module.exports = new OfficeCodeDao();