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

    var use_makeFormat= function (use_name, use_id){

        var use_value = "유휴";
        if(use_name != null && use_name != ""){
            use_value = use_name +"("+use_id+")";
        }

        return use_value
    }

    var getDefaultLocation= function (_value){

        if(_value == null || _value == ""){
            return "미지정";
        }

        return _value
    }

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
            
            if(data.price_buy ==""){ data.price_buy = null; }
            if(data.price==""){ data.price = null; }
            if(data.surtax==""){ data.surtax = null; }            
            if(data.buy_date==""){ data.buy_date = null; }
            if(data.disposal_date==""){ data.disposal_date = null; }
            if(data.expiration_date==""){ data.expiration_date = null; }
            if(data.disposal_account==""){ data.disposal_account = null; }

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
                        memo	    : ""
                    };

                    if(data.state =="폐기"){
                        indata.type = "폐기"; 
                        indata.title = "폐기일 : "+data.disposal_date+"" ;  
                        memo	    : "";
                    }
                
                    OfficeItemHistoryDao.insertOfficeItemHistory(indata).then(function(result) {
                            //resolve(result);
                            resolve(data);
                        }).catch(function(e){//Connection Error

                            debug("_editOfficeItem ERROR 1111 :"+e);
                            reject(e);
                        });

                    }).catch(function(e){
                        debug("_editOfficeItem ERROR:"+e.message);
                        reject(e);
                    });
               
                //resolve({dbResult : result, data : data});
                }).catch(function(e){//Connection Error

                    debug("_editOfficeItem ERROR 2222 :"+e);
                    reject(e);
                });

            }).catch(function(e){//Connection Error

                debug("_editOfficeItem ERROR 333 :"+e);
                reject(e);
            });
        });
    };

    var _editOfficeItem=function(user){
        return new Promise(function(resolve, reject){// promise patten
            _getOfficeItem().then(function(currentData){

                var _updateData=_.defaults(data, currentData[0]);
                var _currentData = currentData[0];

                let _type = "수정"; 
                let _title = "";
                let _memo  = "";     
                
                let _use_type = "사용자 변경";

                if(data.price_buy ==""){ _updateData.price_buy = null; }
                if(data.price==""){ _updateData.price = null; }
                if(data.surtax==""){ _updateData.surtax = null; }            
                if(data.buy_date==""){ _updateData.buy_date = null; }               
                if(data.expiration_date==""){ _updateData.expiration_date = null; }
                if(data.disposal_account==""){ _updateData.disposal_account = null; }
                if(data.disposal_date==""){ _updateData.disposal_date = null; }
  
                OfficeItemDao.updateOfficeItem(_updateData).then(function(result){        
                    
                    if(data.use_user !="" ){   //사용자 변경                        
                       
                        if(_currentData.use_user == ""){   // 부서 -> 사용 직원 변경
                            //_title = "부서 -> 사용자 변경"
                            _type = _use_type; 
                            _title = use_makeFormat(_currentData.use_dept_name,_currentData.use_dept) 
                                    + " -> "+
                                    use_makeFormat(_updateData.use_user_name,_updateData.use_user);     
                        }else if(_updateData.use_user != _currentData.use_user){ 
                            //_title = "사용자 변경"
                            _type = _use_type; 
                            _title = use_makeFormat(_currentData.use_user_name,_currentData.use_user) 
                                    + " -> "+
                                    use_makeFormat(_updateData.use_user_name,_updateData.use_user);   
                        }

                    }else if(data.use_dept !="" ){    //부서 변경
                        
                       if(_currentData.use_dept == ""){
                           // _title = "사용 사용자 -> 부서 변경"
                           _type = _use_type; 
                           _title = use_makeFormat(_currentData.use_user_name,_currentData.use_user) 
                                    + " -> "+
                                    use_makeFormat(_updateData.use_dept_name,_updateData.use_dept);

                        }else if(_updateData.use_dept != _currentData.use_dept){  
                            //_title = "부서 변경"
                            _type = _use_type; 
                            _title = use_makeFormat(_currentData.use_dept_name,_currentData.use_dept) 
                                    + " -> "+
                                    use_makeFormat(_updateData.use_dept_name,_updateData.use_dept);

                        }
                    }else if(data.use_user =="" && data.use_dept ==""){
                        if(_currentData.use_user != ""){ 
                            _type = _use_type; 
                            //_title = "사용자 삭제"
                            _title = use_makeFormat(_currentData.use_user_name,_currentData.use_user) 
                                    + " -> " 
                                    +use_makeFormat("","");
                        }
                        else if(_currentData.use_dept != ""){ 
                            //_title = "부서 삭제"
                            _type = _use_type; 
                            _title = use_makeFormat(_currentData.use_dept_name,_currentData.use_dept) 
                                    + " -> " 
                                    +use_makeFormat("","");
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

                    if(_type == _use_type){
                        OfficeItemHistoryDao.insertOfficeItemHistory(indata).then(function(result) {                       
                        }).catch(function(e){//Connection Error
                            reject(e);
                        });
                    }

                    if(data.location != _currentData.location){

                        indata.title = "[장소] "+getDefaultLocation(_currentData.location)
                                       + "-> "
                                       +getDefaultLocation(data.location) ;     

                        OfficeItemHistoryDao.insertOfficeItemHistory(indata).then(function(result) {                       
                        }).catch(function(e){//Connection Error
                            reject(e);
                        });
                    }

                    if(data.state != _currentData.state){

                        indata.type = data.state; 
                       
                        if(data.state == "폐기"){
                            indata.title = _currentData.state+ " -> "+data.state+" ("+data.disposal_date+")" ; 
                        }else{
                            indata.title = _currentData.state+ " -> "+data.state ;
                        }

                        OfficeItemHistoryDao.insertOfficeItemHistory(indata).then(function(result) {                       
                        }).catch(function(e){//Connection Error
                            reject(e);
                        });
                    }

                    resolve(data);

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

