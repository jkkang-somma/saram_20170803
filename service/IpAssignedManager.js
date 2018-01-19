// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('User');
var Promise = require('bluebird');
var Schemas = require("../schemas.js");
var IpAssignedManagerDao = require('../dao/IpAssignedManagerDao.js');
var db = require('../lib/dbmanager.js');

var IpAssignedManager = function (data, isNoSchemas) {
	var _data=_.initial([]);
	var schema=new Schemas('IpAssignedManager');

	//if (_.isUndefined(isNoSchemas)){// 스키마 미사용
	//	_data = schema.get(data);
	//} else if (!_.isUndefined(isNoSchemas)||isNoSchemas){
		_data=data;
	//}
	
	var _getIPsearch = function(data) {
		return IpAssignedManagerDao.selectIpTbl(data);
	};
	
	var _removeIP = function(data){
		return IpAssignedManagerDao.deleteIP(_data.ip);
	};

	var _updateIP = function(data){
		//return IpAssignedManagerDao.updateIP(_data);
		return new Promise(function(resolve, reject){// promise patten
			IpAssignedManagerDao.updateIP(_data).then(function(result){
				resolve(result);
			}).catch(function(e){
				debug("_editIP ERROR:"+e.message);
				reject(e);
			});
		});
	};

	var _insertIP = function(data){
		return IpAssignedManagerDao.insertIP(_data);
	};

	return {
		data:_data,
		getIPsearch : _getIPsearch,
		removeIP : _removeIP,
		updateIP : _updateIP,
		insertIP : _insertIP
	};
};

module.exports = IpAssignedManager;
