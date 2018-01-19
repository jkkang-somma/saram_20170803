var db = require('../lib/dbmanager.js');
var group = "IpAssignedManage";

var IpAssignedManagerDao = function () {
};

// 근태자료관리 조회
IpAssignedManagerDao.prototype.selectIpTbl =  function (data) {
    return db.query(group, 'selectIpAll');
};

IpAssignedManagerDao.prototype.selectUserInfo =  function (data) {
    return db.query(group, 'selectUserInfo');
};

IpAssignedManagerDao.prototype.deleteIP =  function (ip) {
    return db.query(group, "deleteIP",[ip]);
};
IpAssignedManagerDao.prototype.updateIP =  function (data) {
    return db.query(group, "updateIP", [data.use_dept, data.use_user, data.memo, data.ip]);
};
IpAssignedManagerDao.prototype.insertIP =  function (data) {
    return db.query(group, "insertIP", [data.ip, data.use_dept, data.use_user, data.memo]);
};

module.exports = new IpAssignedManagerDao();