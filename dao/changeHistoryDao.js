var debug = require('debug')('ChangeHistoryDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var ChangeHistoryDao = function () {
}

// 변경 이력 조회 
ChangeHistoryDao.prototype.selectChangeHistory =  function (data) {
    var queryStr = util.format(db.getQuery('changeHistory', 'selectChangeHistory'), data.id, data.date, data.change_column);
    debug(queryStr);
    console.log(queryStr);
    return db.query(queryStr);
}

module.exports = new ChangeHistoryDao();

