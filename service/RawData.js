var _ = require("underscore"); 
var debug = require('debug')('User');
var Schemas = require("../schemas.js");
var RawDataDao= require("../dao/rawDataDao.js");
var Promise = require("bluebird");
var db = require('../lib/dbmanager.js');

var RawData = function (data) {
    var _selectRawDataList = function(data){
    	if(_.isUndefined(data.end)){
    		return RawDataDao.selectRawDataListV2(data);
    	}else{
        	return RawDataDao.selectRawDataList(data);
    	}
    }
    var _insertRawData = function (data) {
        return new Promise(function(resolve, reject){
			db.getConnection().then(function(connection){
				var insertResult = RawDataDao.insertRawData(connection, data);
				Promise.all([insertResult]).then(function(resultArr){
					connection.commit(function(){
						connection.release();
						resolve();
					});
				},function(){
					connection.rollback(function(){
						connection.release();
						reject();
					})
				});	
			});
		});
    }
    
    return {
        insertRawData:_insertRawData,
        selectRawDataList:_selectRawDataList
    }
}

module.exports = new RawData();

