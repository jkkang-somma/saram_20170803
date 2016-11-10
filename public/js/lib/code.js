define([
    'jquery',
	'underscore',
    'collection/common/CodeCollection',
], function($, _, CodeCollection){
    
    var _codeCollectionArr=[];
    var _configArr=["position", "approvalUser", "dept", "part", "overTime", "workType", "office"];
    var _getCollection=function(kind){
        var index=_.indexOf(_configArr, kind);
        return index>-1?_codeCollectionArr[index]:null;
    };
    var Code = {
        DEPARTMENT : "dept",
        PART : "part",
        OFFICE : "office",
        OVERTIME : "overTime",
        WORKTYPE : "workType",
        POSITION:"position",
        APPROVAL_USER:"approvalUser",
        
        init : function(){
    		_codeCollectionArr = [];
            var dfdArr=[];
            for (var index in _configArr){
                var codeCollection=new CodeCollection(_configArr[index]);   
                _codeCollectionArr.push(codeCollection);
                dfdArr.push(codeCollection.fetch());
            }
            
            var dfd = new $.Deferred();
            $.when( dfdArr ).done(function(){
                dfd.resolve();
            }).fail(function(){
                dfd.reject();
            });
            return dfd.promise();
        },
        getCollection : function(kind){
            return _getCollection(kind);
        },
        getCodeName : function(kind, code){
            var destCollection = _getCollection(kind);
            if(_.isNull(destCollection)){
                return null;
            }
            var result = destCollection.where({code : code});
            
            if(result.length > 0){
                return result[0].get("name");      
            }else{
                return null;
            }
        },
        getCodes : function(kind){
            var destCollection = _getCollection(kind);
            if(_.isNull(destCollection)){
                return null;
            }
            var result =  _.sortBy(destCollection.toJSON(), "code");
            return result;
        },
        isSuwonWorker : function(code) {	// 수원 근로자 여부 체크
        	var obj = _getCollection(this.DEPARTMENT).where({code: code});
        	if (obj.length > 0) {
        		return (obj[0].get("area") == "수원")?true:false;
        	} else {
        		return false;
        	}
        },
    };
	return Code;
});



