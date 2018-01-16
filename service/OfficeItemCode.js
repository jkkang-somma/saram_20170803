// Author: jupil ko <jfko00@yescnc.co.kr>
// Create Date: 2018.1.5
// 비품 Service
var _ = require("underscore"); 
var debug = require('debug')('OfficeItemCode');
var Promise = require('bluebird');
var Schemas = require("../schemas.js");
var OfficeItemCodeDao = require('../dao/officeItemCodeDao.js');

//var OfficeItemCode = function (data) {
//*
var OfficeItemCode = function (data, isNoSchemas) {
    var _data=_.initial([]);
    var schema=new Schemas('office_item_code');
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
            return _.noop();
        }
    };
//*/
    var _getOfficeItemCodeUseCount = function(category_code){
        return OfficeItemCodeDao.getOfficeItemCodeUseCount(category_code);
    }

    var _getOfficeItemCodeList = function(){
        return OfficeItemCodeDao.selectOfficeItemCodeList();
    };
    var _removeOfficeItemCode=function(category_code){
        //return OfficeItemCodeDao.deleteOfficeItemCode(category_code);
        return new Promise(function (resolve, reject){
            _getOfficeItemCodeUseCount(category_code).then(function(data){
                debug("_getOfficeItemCodeUseCount data:"+data);
                console.log(data[0]);
                var _cnt = data[0].cnt;
                if ( _cnt == 0 ){
                    OfficeItemCodeDao.deleteOfficeItemCode(category_code).then(function(result){
                        console.log(result);
                        resolve(result);
                    }).catch(function (e){
                        debug("deleteOfficeItemCode ERROR:"+e.message);
                        reject(e);
                    });
                } else {
                    debug("_getOfficeItemCodeUseCount Used Code : "+_cnt);
                    resolve(false);
                }
            }).catch(function(e){//Connection Error
                debug("_getOfficeItemCodeUseCount ERROR:"+e.message);
                reject(e.message);
            });
        });
    };
    var _addOfficeItemCode=function(){//_data){
        return OfficeItemCodeDao.insertOfficeItemCode(_data); 
    };
    var _editOfficeItemCode=function(){//_data){
        return new Promise(function(resolve, reject){// promise patten
            _getOfficeItemCodeList().then(function(currentData){
                var _updateData=_.defaults(_data, currentData[0]);
                OfficeItemCodeDao.updateOfficeItemCode(_updateData).then(function(result){
                    resolve(result);
                }).catch(function(e){
                    debug("updateOfficeItemCode ERROR:"+e.message);
                    reject(e);
                });
            }).catch(function(e){//Connection Error
               debug("_editOfficeItemCode ERROR:"+e.message);
               reject(e);
            });
        });
    };

    
    return {
        get:_get,
        data:_data,
        getOfficeItemCodeList:_getOfficeItemCodeList,
        remove:_removeOfficeItemCode,
        add:_addOfficeItemCode,
        edit:_editOfficeItemCode
    };
}

module.exports = OfficeItemCode