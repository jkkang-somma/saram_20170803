var debug = require('debug')('CommuteDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var CommuteDao = function () {
}

// 근태자료관리 조회 
CommuteDao.prototype.selectCommute =  function (data) {
    var queryStr = util.format(db.getQuery('commute', 'selectCommute'), data.startDate, data.endDate);
    debug(queryStr);
    console.log(queryStr);
    return db.query(queryStr);
}

module.exports = new CommuteDao();