var debug = require('debug')('vacationDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var VacationDao = function () {
}
VacationDao.prototype.selectVacationsByYear =  function (year) {
    var queryStr = util.format(db.getQuery('vacation', 'selectVacationsByYear'), year);
    return db.query(queryStr);
}
//
//UserDao.prototype.selectVacationsByYear =  function () {//select user;
//    var queryStr = db.getQuery('user', 'selectUserList');
//    return db.query(queryStr);
//}
module.exports = new VacationDao();

