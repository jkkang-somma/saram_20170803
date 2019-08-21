// 부서 Service
var _ = require("underscore"); 
var debug = require('debug')('Department');
var Promise = require('bluebird');
var Schemas = require("../schemas.js");
var DepartmentDao= require('../dao/departmentDao.js');
var YesCalendarTypeDao= require('../dao/YesCalendarTypeDao.js');
var UserDao = require('../dao/userDao.js');


var Department = function (data, isNoSchemas) {
    var _data=_.initial([]);
    var schema=new Schemas('department');
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
        return DepartmentDao.selectDepartmentList();
    };   
    
    var _selectCodeData = function(){ //members_tbl
        return DepartmentDao.selectCodeData(_data);
    };

    var _removeDepartment=function(){
    	return new Promise(function(resolve, reject){// promise patten
    		_selectCodeData().then(function(currentData){
    			//console.log(currentData.length);    			
    			if(currentData.length == 0){ // 부서코드에 해당하는 사람이 없을때
    				//삭제
    				DepartmentDao.deleteDepartment(_data.code).then(function(){
    					debug("삭제되었습니다.");
    					resolve(true);
    				})
    				// 삭제가 되면 true
    			}else{
    				// 있어서 삭제를 못하면 false
    				debug("사용중인 부서입니다.");
    				resolve(false);
    				
    			}  			
            }).catch(function(e){//Connection Error
               debug("_selectCodeData ERROR:"+e.message);
               reject(e);
            });
        });	
    };
    
    var _addDepartment=function(){
       return DepartmentDao.insertDepartment(_data); 
    };
    
    var _editDepartment=function(){
        return new Promise(function(resolve, reject){// promise patten
        	_getManagerList().then(function(currentData){
                var _updateData=_.defaults(_data, currentData[0]);
                DepartmentDao.updateDepartment(_updateData).then(function(result){
                    if (_updateData.code !== _updateData.origin_code) {
                        UserDao.updateUserDept(_updateData.code, _updateData.origin_code).then(function() {
                          YesCalendarTypeDao.updateYesCalendarTypeForDeptCode2(_updateData.code, _updateData.origin_code).then(function() {
                            resolve(result);
                          });
                        });
                    } else {
                        resolve(result);
                    }
                }).catch(function(e){
                    debug("_editDepartment ERROR:"+e.message);
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
        remove:_removeDepartment,
        addDepartment:_addDepartment,
        editDepartment:_editDepartment,
        selectCodeData:_selectCodeData
    }
}
module.exports = Department;

