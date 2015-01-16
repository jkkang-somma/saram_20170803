var debug = require('debug')('vacationDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var VacationDao = function () {
}

// 연차 조회 
VacationDao.prototype.selectVacationsByYear =  function (year) {
    var queryStr = db.getQuery('vacation', 'selectVacationsByYear');
    return db.queryV2(queryStr, [year]);
}

// 연차 갯수 조회 - 해당 년도의 연차 데이터 생성 여부 체크 위해서 
VacationDao.prototype.selectVacatonCount =  function (year) {
    var queryStr = db.getQuery('vacation', 'selectVacatonCount');
    return db.queryV2(queryStr, [year]);
}

// vacation 1개 등록
VacationDao.prototype.insertVacation =  function (data) {	
    var queryStr = db.getQuery('vacation', 'insertVacation');
    return db.queryV2(queryStr, [data.id, data.year, data.total_day, data.id, data.year]);
}

//vacation 수정
VacationDao.prototype.updateVacation =  function (data) {
    var queryStr = db.getQuery('vacation', 'updateVacation');
    return db.queryV2(queryStr, [data.total_day, data.memo, data.id, data.year]);
}
module.exports = new VacationDao();

