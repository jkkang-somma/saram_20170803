var db = require('../lib/dbmanager.js');
var _ = require('underscore');
var group = "rawData";

var RawDataDao = function () {
};

RawDataDao.prototype.insertRawData =  function (data) {
    return {
        group : group,
        item : "insertRawData",
        data : [
                data.id, data.name, data.department, data.char_date, data.year, data.type, data.char_date, data.type
        ]
    };
};

// 툴퇴근 정보 등록 
RawDataDao.prototype.insertRawDataCompanyAccess =  function (data) {
    return db.query(group, "insertRawDataCompanyAccess", 
        [data.char_date, data.id, data.name, data.department, data.char_date, data.type, data.ip_pc, data.ip_office, data.need_confirm, data.mac]
    );
};

RawDataDao.prototype.selectRawDataList =  function (data) {
    if(_.isUndefined(data.dept) || data.dept == "전체")
        return db.query(group, 'selectRawDataListAll', [data.start, data.end]);
    else
        return db.query(group, 'selectRawDataList', [data.start, data.end, data.dept]);
};

RawDataDao.prototype.selectRawDataListV2 =  function (data) {
    return db.query(group, "selectRawDataListV2", [data.start]);
};

module.exports = new RawDataDao();