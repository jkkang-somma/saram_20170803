var _ = require("underscore"); 
var debug = require('debug')('OfficeItem');
var Promise = require('bluebird');
var Schemas = require("../schemas.js");
var OfficeItemDao= require('../dao/officeitemDao.js');
var OfficeItemHistoryDao= require('../dao/officeItemHistoryDao.js');

var OfficeItem = function (data) {

    var _data=_.initial([]);

    //Manager -start-
    var _getOfficeItem = function () {
        return OfficeItemDao.selectIdByOfficeItem(data.serial_yes);
    };

    var _getOfficeItemList = function(date){
       
        if(!_.isUndefined(data.category_code) && data.category_code != ""){           
            return OfficeItemDao.selectOfficeItemCategoryCodeList(data.category_code);
        
        }else if(!_.isUndefined(data.category_type) && data.category_type != ""){
            return OfficeItemDao.selectOfficeItemCategoryCodeTypeList(data.category_type);            
        
        }else{
            return OfficeItemDao.selectOfficeItemAllList();
    	}
    }; 

    /*var _getOfficeItemCategoryCodeList = function(){
        return OfficeItemDao.selectOfficeItemCategoryCodeList(data.category_code);
    };*/

    var _addOfficeItem=function(user){
    
        return new Promise(function(resolve, reject){// promise patten	            
        
            OfficeItemDao.getOfficeItemMaxCategoryIndex(data.category_code).then(function(result) {	
            var maxCategory_index = result[0].category_index;
           
            data.category_index = maxCategory_index;
            data.serial_yes = data.category_code+'_'+maxCategory_index;   
            
            if(data.disposal_date ==""){ data.disposal_date = null; }

            OfficeItemDao.insertOfficeItem(data).then(function(result) {

                _getOfficeItem().then(function(currentData) {

                    debug(JSON.stringify(currentData));
                    //console.log(currentData[0].serial_yes);
                    data = currentData[0];
                                              
                    var indata = {
                        serial_yes  : data.serial_yes, 
                        category_type : data.category_type, //category_type 세팅
                        //history_date: "", 
                        type	    : "등록", 
                        title	    : "비품 등록", 
                        repair_price: data.price_buy,
                        use_user	: data.use_user, 
                        use_dept	: data.use_dept, 
                        name	    : (data.use_user != "")?data.use_user_name:data.use_dept_name, 
                        change_user_id : user.name, 
                        memo	    : data.serial_yes+ " 등록 하였습니다."
                    };
                
                    OfficeItemHistoryDao.insertOfficeItemHistory(indata).then(function(result) {
                            //resolve(result);
                            resolve(data);
                        }).catch(function(e){//Connection Error
                            reject(e);
                        });

                    }).catch(function(e){
                        debug("_editOfficeItem ERROR:"+e.message);
                        reject(e);
                    });
               
                //resolve({dbResult : result, data : data});
                }).catch(function(e){//Connection Error
                    reject(e);
                });

            }).catch(function(e){//Connection Error
                reject(e);
            });
        });
    };

    var _editOfficeItem=function(user){
        return new Promise(function(resolve, reject){// promise patten
            _getOfficeItem().then(function(currentData){

                var _updateData=_.defaults(data, currentData[0]);

                var _currentData = currentData[0];
                var _type = "수정"; 
                var _title = "비품 수정";
                var _memo = data.serial_yes+ " 수정 하였습니다.";               

                if(data.disposal_date ==""){ data.disposal_date = null; }

                OfficeItemDao.updateOfficeItem(_updateData).then(function(result){        
                    
                    if(data.use_user !="" ){   //사용자 변경
                        
                        if(_currentData.use_user == ""){   // 부서 -> 사용 직원 변경
                            _type = "사용자 수정"; 
                            _title = "사용 부서 -> 직원 변경"
                            _memo = _currentData.use_dept_name+"("+_currentData.use_dept+") ->"+_updateData.use_user_name+"("+_updateData.use_user+")";  
                        }else if(_updateData.use_user != _currentData.use_user){ 
                            _type = "사용자 수정"; 
                            _title = "사용 직원 변경"
                            _memo = _currentData.use_user_name+"("+_currentData.use_user+") -> "+_updateData.use_user_name+"("+_updateData.use_user+")"; 
                        }  

                    }else{    //부서 변경
                      if(_currentData.use_dept == ""){
                            _type = "사용자 수정"; 
                            _title = "사용 직원 -> 부서 변경"
                            _memo = _currentData.use_user_name+"("+_currentData.use_user+") ->"+_updateData.use_dept_name+"("+_updateData.use_dept+")";  
                        }else if(_updateData.use_dept != _currentData.use_dept){  
                            _type = "사용자 수정"; 
                            _title = "사용 부서 변경"
                            _memo = _currentData.use_dept_name+"("+_currentData.use_dept+") -> "+_updateData.use_dept_name+"("+_updateData.use_dept+")"; 
                        }
                    }
                          
                    //data = currentData[0];
                    data = _updateData;

                    var indata = {
                        serial_yes  : data.serial_yes, 
                        category_type : data.category_type, //category_type 세팅
                        type	    : _type,     //사용자 변경/수정 
                        title	    : _title, 
                        repair_price: data.price_buy,
                        use_user	: data.use_user, 
                        use_dept	: data.use_dept, 
                        name	    : (data.use_user != null && data.use_user != "")?data.use_user_name:data.use_dept_name, 
                        change_user_id : user.name, 
                        memo	    : _memo
                    };
                
                    OfficeItemHistoryDao.insertOfficeItemHistory(indata).then(function(result) {
                            resolve(data);
                           // resolve({dbResult : result, data : data});
                        }).catch(function(e){//Connection Error
                            reject(e);
                        });

                }).catch(function(e){
                    debug("_editOfficeItem ERROR:"+e.message);
                    reject(e);
                });
            }).catch(function(e){//Connection Error
               debug("_editOfficeItem ERROR:"+e.message);
               reject(e);
            });
        });
    };
    var _removeOfficeItem=function(){
        return new Promise(function(resolve, reject){// promise patten
            OfficeItemDao.deleteOfficeItem(data.serial_yes).then(function(result){
                OfficeItemHistoryDao.deleteOfficeItemHistory(data.serial_yes).then(function(result) {
                    resolve(result);
                  }).catch(function(e){//Connection Error
                    reject(e);
                });

            }).catch(function(e){
                debug("_editOfficeItem ERROR:"+e.message);
                reject(e);
            });  
        }).catch(function(e){//Connection Error
            debug("_editOfficeItem ERROR:"+e.message);
            reject(e);
         });
    };
    //Manager -end-

    //Code -start-
    var _getOfficeItemCodeList=function(){
        return OfficeItemDao.selectOfficeItemCodeList(data); 
    };
    //Code -end-
    
    return {
        getOfficeItemList:_getOfficeItemList,
        addOfficeItem:_addOfficeItem,
        editOfficeItem:_editOfficeItem,
        remove:_removeOfficeItem,
        getOfficeItemCodeList:_getOfficeItemCodeList,
    };
}
module.exports = OfficeItem;

