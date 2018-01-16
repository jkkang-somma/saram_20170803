// Author: jupil ko <jfko00@yescnc.co.kr>
// Create Date: 2018.1.5
// 비품 관리 Service
var db = require('../lib/dbmanager.js');
var group = 'officeItem';

var OfficeItemCodeDao = function () {
    
};

// 비품코드 관리 조회 
OfficeItemCodeDao.prototype.selectOfficeItemCodeList =  function (data) {
    return db.query(group, 'selectOfficeItemCodeList');
};

OfficeItemCodeDao.prototype.insertOfficeItemCode = function(data){
    return db.query(group, "insertOfficeItemCode", [data.category_code, data.category_type, data.category_name]);
};
OfficeItemCodeDao.prototype.deleteOfficeItemCode = function(category_code){
    return db.query(group, "deleteOfficeItemCode",[category_code]);
};
OfficeItemCodeDao.prototype.updateOfficeItemCode = function(data){
    return db.query(group, "updateOfficeItemCode", [data.category_type, data.category_name, data.category_code]);
};

OfficeItemCodeDao.prototype.getOfficeItemCodeUseCount = function(category_code){
    return db.query(group, "getOfficeItemCodeUseCount",[category_code]);
};

module.exports = new OfficeItemCodeDao();