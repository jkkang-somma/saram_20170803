// Author: jupil ko <jfko00@yescnc.co.kr>
// Create Date: 2018.1.5
// 비품 Service
var _ = require("underscore"); 
var debug = require('debug')('OfficeItemHistory');
var Promise = require('bluebird');
var Schemas = require("../schemas.js");
var OfficeItemHistoryDao = require('../dao/officeItemHistoryDao.js');

var OfficeItemHistory = function () {

    var _selectOfficeItemHistoryList = function(data){
        console.log(data);
        debug("Select OfficeItemHistory List.");
        return OfficeItemHistoryDao.selectOfficeItemHistoryList(data).then(function(result) {
			console.log(result);
			return result;
		});
    };

    var _selectOfficeItemHistoryListV2 = function(data){
        console.log(data);
        debug("Select OfficeItemHistory List.");
        debug("Select OfficeItemHistory serial_yes : " + data.serial_yes);
        return OfficeItemHistoryDao.selectOfficeItemHistoryListV2(data).then(function(result) {
			console.log(result);
			return result;
		});
    };

    var _addOfficeItemHistory=function(data){
        
        if(data.repair_price ==""){ data.repair_price = null; }
        return OfficeItemHistoryDao.insertOfficeItemHistory(data); 
    };
    
    return {
        selectOfficeItemHistoryList:_selectOfficeItemHistoryList,
        selectOfficeItemHistoryListV2 :_selectOfficeItemHistoryListV2,
        addOfficeItemHistory:_addOfficeItemHistory
    };
}

module.exports = new OfficeItemHistory();