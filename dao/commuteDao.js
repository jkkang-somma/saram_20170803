var debug = require('debug')('CommuteDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var CommuteDao = function () {
}

// 연차 조회 
CommuteDao.prototype.selectCommute =  function (data) {
    var queryStr = util.format(db.getQuery('commute', 'selectCommute'), data.startDate, data.endDate);
    debug(queryStr);
    console.log(queryStr);
    return db.query(queryStr);
}

// 연차 갯수 조회 - 해당 년도의 연차 데이터 생성 여부 체크 위해서 
CommuteDao.prototype.selectVacatonCount =  function (year) {
    var queryStr = util.format(db.getQuery('vacation', 'selectVacatonCount'), year);
    debug(queryStr);
    return db.query(queryStr);
}

// vacation 1개 등록
CommuteDao.prototype.insertVacation =  function (data) {	
    var queryStr = util.format(db.getQuery('vacation', 'insertVacation'), data.id, data.year, data.total_day, data.id, data.year);
    debug(queryStr);
    return db.query(queryStr);
}

//vacation 수정
CommuteDao.prototype.updateVacation =  function (data) {
    var queryStr = util.format(db.getQuery('vacation', 'updateVacation'), data.total_day, data.id, data.year);
    console.log(queryStr);
    debug(queryStr);
    return db.query(queryStr);
}
module.exports = new CommuteDao();

