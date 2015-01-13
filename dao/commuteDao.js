var debug = require('debug')('CommuteDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var CommuteDao = function () {
}

// 근태자료관리 조회 
CommuteDao.prototype.selectCommute =  function (data) {
    //var queryStr = util.format(db.getQuery('commute', 'selectCommute'), data.startDate, data.endDate);
	var queryStr = db.getQuery('commute', 'selectCommute');
    debug(queryStr);
    console.log(queryStr);
    return db.queryV2(queryStr, [data.startDate, data.endDate]);
}

module.exports = new CommuteDao();