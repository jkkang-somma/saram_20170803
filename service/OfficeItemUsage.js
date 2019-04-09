var OfficeItemUsageDao = require('../dao/officeItemUsageDao.js');

var OfficeItemUsage = function() {

    var _getUsageDetailList = function(data){
        return OfficeItemUsageDao.selectUsageDetailList(data);
    };

    var _getUsageList = function(data, id){
        return OfficeItemUsageDao.selectUsageList(data, id);
    };

    return {
        getUsageDetailList : _getUsageDetailList,
        getUsageList : _getUsageList
    };
};

module.exports = new OfficeItemUsage();
