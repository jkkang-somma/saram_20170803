// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery', 
], function($){
    var isNull=function(obj){
		if(obj===""||obj===undefined||obj==="undefined"||obj===null||obj==="null") return true;
		return false;
	};
	var isNotNull=function(obj){
		if(obj===""||obj===undefined||obj==="undefined"||obj===null||obj==="null") return false;
		return true;
	};
	var inArray=function(value, arr){
	    if($.inArray(value, arr)> -1) return true;
	    return false;        
	};
	var inObject=function(vName, obj){
		for(var name in obj){
			if (name==vName){
				return true;
			}
		}
		return false;
	};
	var split=function(str, token){
		if(this.isNull(str)){
			return [];
		}else{
			return str.split(token);
		}
	};
    return {
        isNull:isNull,
        isNotNull:isNotNull,
        inArray:inArray,
        inObject:inObject,
        split:split
    };
});