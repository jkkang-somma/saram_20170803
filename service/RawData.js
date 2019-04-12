var _ = require("underscore"); 
var Schemas = require("../schemas.js");
var RawDataDao= require("../dao/rawDataDao.js");
var Promise = require("bluebird");
var db = require('../lib/dbmanager.js');

var RawData = function (data) {
    var _selectRawDataList = function(data, id){
    	if(_.isUndefined(data.end)){
    		return RawDataDao.selectRawDataListV2(data, id);
    	}else{
        	return RawDataDao.selectRawDataList(data, id);
    	}
    }
    var _insertRawData = function (data) {
        return new Promise(function(resolve, reject){
			var queryArr = [];
			for(var idx in data){
                queryArr.push(RawDataDao.insertRawData(data[idx]));
			}
			db.queryTransaction(queryArr).then(function(resultArr){
				resolve();
			}, function(err){
				reject(err);
			});
		});
    };
    
    return {
        insertRawData:_insertRawData,
        selectRawDataList:_selectRawDataList
    }
}

module.exports = new RawData();

