var debug = require('debug')('ChangeHistoryDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var ChangeHistoryDao = function () {
}

// 변경 이력 조회 
ChangeHistoryDao.prototype.selectChangeHistory =  function (data) {
    //var queryStr = util.format(db.getQuery('changeHistory', 'selectChangeHistory'), data.id, data.date, data.change_column);
	var queryStr = db.getQuery('changeHistory', 'selectChangeHistory');
    debug(queryStr);
    console.log(queryStr);
    return db.queryV2(queryStr, [data.id, data.date, data.change_column]);
}

module.exports = new ChangeHistoryDao();

