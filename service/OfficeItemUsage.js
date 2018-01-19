var OfficeItemUsageDao = require('../dao/OfficeItemUsageDao.js');
var debug = require('debug')('OfficeItem');

var OfficeItemUsage = function() {

    var _getUsageDetailList = function(data){
        return OfficeItemUsageDao.selectUsageDetailList(data);
    };

    var _getUsageList = function(data){
        return OfficeItemUsageDao.selectUsageList(data);
    };

    return {
        getUsageDetailList : _getUsageDetailList,
        getUsageList : _getUsageList
    };
};

module.exports = new OfficeItemUsage();
