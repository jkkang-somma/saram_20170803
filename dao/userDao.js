// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var db = require('../lib/dbmanager.js');
var group = 'user';

var UserDao = function () {
    
};

UserDao.prototype.selectIdByUser =  function (id) {
    return db.query(group, "selectIdByUser", [id]);
};

UserDao.prototype.selectIdByLoginUser =  function (id) {
    return db.query(group, "selectIdByLoginUser", [id]);
};

UserDao.prototype.selectUserList =  function () {
    return db.query(group, "selectUserList");
};

UserDao.prototype.selectUserListNow =  function () {
    return db.query(group, "selectUserListNow");
};

UserDao.prototype.selectUserListNowFull =  function () {
    return db.query(group, "selectUserListNowFull");
};

UserDao.prototype.selectDepartmentList =  function (id) {
    return db.query(group, "selectDepartment", [id]);
};

UserDao.prototype.selectManagerList =  function (id) {
    return db.query(group, "selectManager", [id]);
};

UserDao.prototype.initPassword =  function (id, password) {
    return db.query(group, "initPassword", [password, id]);
};

UserDao.prototype.deleteUser = function(id){
    return db.query(group, "deleteUser",[id]);
};

UserDao.prototype.insertUser = function(user){
      return db.query(group, "insertUser",
        [user.id, user.name, user.dept_code, user.approval_id, user.name_commute,user.join_company, user.leave_company, user.privilege, user.admin, user.affiliated, user.position_code,
        user.ip_pc, user.mac, user.ip_office, user.email, user.phone, user.phone_office, user.emergency_phone, user.birthday, user.wedding_day, user.memo, user.part_code]
    );
};

UserDao.prototype.updateUser = function(user){
    return db.query(group, "updateUser", 
    [user.password, user.name, user.dept_code, user.approval_id, user.name_commute, user.join_company, user.leave_company, user.privilege, user.admin, user.affiliated, user.position_code,
        user.ip_pc, user.mac, user.ip_office, user.email, user.phone, user.phone_office, user.emergency_phone, user.birthday, user.wedding_day, user.memo, user.part_code, user.id]
    );
};

UserDao.prototype.updateUserDept = function(newDeptCode, oldDeptCode){
    return db.query(group, "updateUserDept", [newDeptCode, oldDeptCode]);
};

UserDao.prototype.updateUserGisPos = function(user){
    return db.query(group, "updateUserGisPos", 
        [user.gis_pos, user.id]
    );
};

UserDao.prototype.selectUserByIp =  function (data) {
    return db.query(group, "selectUserByIp", [data.id, data.ip_office, data.ip_pc]);
};

module.exports = new UserDao();
