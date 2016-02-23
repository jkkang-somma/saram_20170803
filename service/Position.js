// 부서 Service
var _ = require("underscore"); 
var debug = require('debug')('Position');
var Promise = require('bluebird');
var Schemas = require("../schemas.js");
var PositionDao= require('../dao/positionDao.js');


var Position = function (data, isNoSchemas) {
    var _data=_.initial([]);
    var schema=new Schemas('position');
    if (_.isUndefined(isNoSchemas)){// 스키마 미사용
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
        return PositionDao.selectPositionList();
    };   
    
    var _selectPositionCode = function(){ //members_tbl
        return PositionDao.selectPositionCode(_data);
    };

    var _removePosition=function(){
    	return new Promise(function(resolve, reject){// promise patten
    		_selectPositionCode().then(function(currentData){
    			//console.log(currentData.length);    			
    			if(currentData.length == 0){ // 코드에 해당하는 사람이 없을때
    				//삭제
    				PositionDao.deletePosition(_data.code).then(function(){
    					debug("삭제되었습니다.");
    					resolve(true);
    				})
    				// 삭제가 되면 true
    			}else{
    				// 있어서 삭제를 못하면 false
    				debug("사용중인 직급입니다.");
    				resolve(false);
    				
    			}  			
            }).catch(function(e){//Connection Error
               debug("_selectPositionCode ERROR:"+e.message);
               reject(e);
            });
        });	
    };
    
    var _addPosition=function(){
       return PositionDao.insertPosition(_data); 
    };
    
    var _editPosition=function(){
        return new Promise(function(resolve, reject){// promise patten
        	_getManagerList().then(function(currentData){
                var _updateData=_.defaults(_data, currentData[0]);
                PositionDao.updatePosition(_updateData).then(function(result){
                    resolve(result);
                }).catch(function(e){
                    debug("_editPosition ERROR:"+e.message);
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
        remove:_removePosition,
        addPosition:_addPosition,
        editPosition:_editPosition,
        selectPositionCode:_selectPositionCode
    }
}
module.exports = Position;

