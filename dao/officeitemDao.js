// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var db = require('../lib/dbmanager.js');
var group = 'officeitem';

var OfficeItemDao = function () { };

OfficeItemDao.prototype.selectIdByOfficeItem =  function (serial_yes) {
    return new Promise(function(resolve) {
        resolve(db.query(group, "selectIdByOfficeItem", [serial_yes]));
    });
};

OfficeItemDao.prototype.getOfficeItemMaxCategoryIndex =  function (category_code) {
    return new Promise(function(resolve) {
        resolve(db.query(group, "getOfficeItemMaxCategoryIndex", [category_code]));
    });
};

OfficeItemDao.prototype.selectOfficeItemAllList =  function () {
    return db.query(group, "selectOfficeItemALLList");
};

OfficeItemDao.prototype.selectOfficeItemCategoryCodeList =  function (category_code) {
    return db.query(group, "selectOfficeItemCategoryCodeList",[category_code]);
};

OfficeItemDao.prototype.insertOfficeItem = function(officeitem){
    return db.query(group, "insertOfficeItem",
        [officeitem.serial_yes,officeitem.serial_factory,officeitem.vendor,officeitem.model_no,officeitem.category_code,officeitem.category_index,officeitem.category_code,officeitem.price,officeitem.surtax,
        officeitem.price_buy,officeitem.buy_date,officeitem.disposal_date,officeitem.disposal_account,officeitem.expiration_date,officeitem.use_dept,officeitem.use_user,officeitem.location,officeitem.state,officeitem.memo]
 );
};

OfficeItemDao.prototype.deleteOfficeItem = function(id){
    return db.query(group, "deleteOfficeItem",[id]);
};


OfficeItemDao.prototype.updateOfficeItem = function(officeitem){
    return new Promise(function(resolve) {
        resolve(db.query(group, "updateOfficeItem", 
        [officeitem.serial_factory,officeitem.vendor,officeitem.model_no,officeitem.category_code,officeitem.price,officeitem.surtax,
        officeitem.price_buy,officeitem.buy_date,officeitem.disposal_date,officeitem.disposal_account,officeitem.expiration_date,officeitem.use_dept,officeitem.use_user,officeitem.location,officeitem.state,officeitem.memo,
        officeitem.serial_yes]));
    });
};

module.exports = new OfficeItemDao();
