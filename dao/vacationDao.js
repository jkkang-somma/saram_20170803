var debug = require('debug')('vacationDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var VacationDao = function () {
}

// 연차 조회 
VacationDao.prototype.selectVacationsByYear =  function (year) {
    var queryStr = util.format(db.getQuery('vacation', 'selectVacationsByYear'), year);
    debug(queryStr);
    return db.query(queryStr);
}

// 연차 갯수 조회 - 해당 년도의 연차 데이터 생성 여부 체크 위해서 
VacationDao.prototype.selectVacatonCount =  function (year) {
    var queryStr = util.format(db.getQuery('vacation', 'selectVacatonCount'), year);
    debug(queryStr);
    return db.query(queryStr);
}

// vacation 1개 등록
VacationDao.prototype.insertVacation =  function (data) {	
    var queryStr = util.format(db.getQuery('vacation', 'insertVacation'), data.id, data.year, data.total_day, data.id, data.year);
    debug(queryStr);
    return db.query(queryStr);
}

//vacation 수정
VacationDao.prototype.updateVacation =  function (data) {
    var queryStr = util.format(db.getQuery('vacation', 'updateVacation'), data.total_day, data.id, data.year);
    console.log(queryStr);
    debug(queryStr);
    return db.query(queryStr);
}
module.exports = new VacationDao();

