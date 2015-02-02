// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var debug = require('debug')('userDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var UserDao = function () {
};

UserDao.prototype.selectIdByUser =  function (id) {
    var queryStr = db.getQuery('user', 'selectIdByUser');
    return db.queryV2(queryStr, [id]);
};
UserDao.prototype.selectUserList =  function () {
    var queryStr = db.getQuery('user', 'selectUserList');
    return db.queryV2(queryStr);
};
UserDao.prototype.selectManagerList =  function (id) {
    var queryStr = db.getQuery('user', 'selectManager');
    return db.queryV2(queryStr, [id]);
};
UserDao.prototype.initPassword =  function (id, password) {
    var queryStr = db.getQuery('user', 'initPassword');
    return db.queryV2(queryStr, [password, id]);
};
UserDao.prototype.deleteUser = function(id){
    var queryStr = util.format(db.getQuery('user', 'deleteUser'));
    return db.queryV2(queryStr,[id]);
};
UserDao.prototype.insertUser = function(user){
    var queryStr = db.getQuery('user', 'insertUser');
      return db.queryV2(queryStr, [user.id, user.name, user.dept_code, user.approval_id, user.name_commute,user.join_company, user.leave_company, user.privilege, user.admin, user.position,
        user.ip_pc, user.ip_office, user.email, user.phone, user.phone_office, user.emergency_phone, user.birthday, user.wedding_day, user.memo]);
};
UserDao.prototype.updateUser = function(user){
    var queryStr = db.getQuery('user', 'updateUser');
    return db.queryV2(queryStr, [user.password, user.name, user.dept_code, user.approval_id, user.name_commute, user.join_company, user.leave_company, user.privilege, user.admin, user.position,
        user.ip_pc, user.ip_office, user.email, user.phone, user.phone_office, user.emergency_phone, user.birthday, user.wedding_day, user.memo, user.id]);
};

module.exports = new UserDao();