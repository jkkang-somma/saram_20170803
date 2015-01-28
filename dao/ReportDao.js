var debug = require('debug')('ReportDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var ReportDao = function () {
}
//
//// 연차 조회 
//VacationDao.prototype.selectVacationsByYear =  function (year) {
//    var queryStr = db.getQuery('vacation', 'selectVacationsByYear');
//    return db.queryV2(queryStr, [year]);
//}
//
//// 연차 갯수 조회 - 해당 년도의 연차 데이터 생성 여부 체크 위해서 
//VacationDao.prototype.selectVacatonCount =  function (year) {
//    var queryStr = db.getQuery('vacation', 'selectVacatonCount');
//    return db.queryV2(queryStr, [year]);
//}
//
//// 연차 조회 - id 별 연차를 조회하기 위해
//VacationDao.prototype.selectVacatonById =  function (id) {
//    var queryStr = db.getQuery('vacation', 'selectVacationsById');
//    return db.queryV2(queryStr, [id]);
//}
//
//// vacation 1개 등록
//VacationDao.prototype.insertVacation =  function (datas) {	
//    var queryStr = db.getQuery('vacation', 'insertVacation');
//    var values = [];
//    for (var i = 0, len = datas.length; i < len; i++) {
//    	values.push( [datas[i].id, datas[i].year, datas[i].total_day, datas[i].id, datas[i].year] );
//    }
//    
//    return db.insertQuerys(queryStr, values);
//}
//
////vacation 수정
//VacationDao.prototype.updateVacation =  function (data) {
//    var queryStr = db.getQuery('vacation', 'updateVacation');
//    return db.queryV2(queryStr, [data.total_day, data.memo, data.id, data.year]);
//}
module.exports = new ReportDao();

