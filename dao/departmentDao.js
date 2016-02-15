// 부서 Service
var db = require('../lib/dbmanager.js');
var group = 'department';

var departmentDao = function () {
    
};

departmentDao.prototype.selectDepartmentList =  function () {
    return db.query(group, "selectDepartment", []);
};


departmentDao.prototype.deleteDepartment = function(code){
    return db.query(group, "deleteDepartment",[code]);
};

departmentDao.prototype.insertDepartment = function(department){
      return db.query(group, "insertDepartment",
        [department.code, department.name, department.area]
    );
};

departmentDao.prototype.updateDepartment = function(department){
    return db.query(group, "updateDepartment", 
        [department.name, department.area, department.code]
    );
};

departmentDao.prototype.selectCodeData =  function (data) {
    return db.query(group, "selectCodeData", [data.code]);
};


module.exports = new departmentDao();
