// 부서 Service
var _ = require("underscore"); 
var debug = require('debug')('Part');
var Promise = require('bluebird');
var Schemas = require("../schemas.js");
var PartDao= require('../dao/partDao.js');
var UserDao = require('../dao/userDao.js');

var Part = function (data, isNoSchemas) {
    var _data=_.initial([]);
    var schema=new Schemas('part');
    if (_.isUndefined(isNoSchemas)){// 스키마 미사용
        debug("Part: isNoSchemas : " + JSON.stringify(data));
        _data = schema.get(data);
    } else if (!_.isUndefined(isNoSchemas)||isNoSchemas){
        _data=data;
    }
    
    var _get = function (fieldName) {
        if (_.isNull(fieldName) || _.isUndefined(fieldName)) return _.noop();
        if (_.has(_data, fieldName)){
            return _data[fieldName];
        } else {
            return _.noop;
        }
    };

    var _getManagerList = function(){
        return PartDao.selectPartList();
    };   
    
    var _selectCodeData = function(){ //members_tbl
        return PartDao.selectCodeData(_data);
    };

    var _removePart=function(){
    	return new Promise(function(resolve, reject){// promise patten
    		_selectCodeData().then(function(currentData){
    			//console.log(currentData.length);    			
    			if(currentData.length == 0){ // 부서코드에 해당하는 사람이 없을때
    				//삭제
    				PartDao.deletePart(_data.code).then(function(){
    					debug("삭제되었습니다.");
    					resolve(true);
    				})
    				// 삭제가 되면 true
    			}else{
    				// 있어서 삭제를 못하면 false
    				debug("사용중인 파트입니다.");
    				resolve(false);
    				
    			}  			
            }).catch(function(e){//Connection Error
               debug("_selectCodeData ERROR:"+e.message);
               reject(e);
            });
        });	
    };
    
    var _addPart=function(){
       debug("_addPart:" + JSON.stringify(_data));
       return PartDao.insertPart(_data); 
    };
    
    var _editPart=function(){
        return new Promise(function(resolve, reject){// promise patten
        	_getManagerList().then(function(currentData){
                var _updateData=_.defaults(_data, currentData[0]);
                PartDao.updatePart(_updateData).then(function(result){
                  if (_updateData.code === _updateData.origin_code) {
                    resolve(result);
                    return;
                  }
                  UserDao.updateUserPart(_updateData.code, _updateData.origin_code).then(function() {
                    resolve(result);
                  });

                }).catch(function(e){
                    debug("_editPart ERROR:"+e.message);
                    reject(e);
                });
            }).catch(function(e){//Connection Error
               debug("_getManagerList ERROR:"+e.message);
               reject(e);
            });
        });
    };

    
    return {
        get:_get,
        getManagerList:_getManagerList,
        data:_data,
        remove:_removePart,
        addPart:_addPart,
        editPart:_editPart,
        selectCodeData:_selectCodeData
    }
}
module.exports = Part;

