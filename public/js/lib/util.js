// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore'
], function($, _){
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
	
	// form 태그 내 name 별 값을 json 형식으로 반환  
	var getFormJSON = function($form) {
 		var arr = $form.serializeArray();
 		var data = _(arr).reduce(function(result, field) {
 			result[field.name] = field.value;
 			return result;
 	    }, {});
		
 		return data;
	}
	
	var dateToString = function(date){
		return date.getFullYear() + "-"
        + (date.getMonth() + 1 <10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-"
        + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
	}
	
	var timeToString = function(date){
		return (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":"
        + (date.getMinutes() <10 ? "0" + date.getMinutes() : date.getMinutes()) + ":"
        + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
	}
	
    return {
        isNull:isNull,
        isNotNull:isNotNull,
        inArray:inArray,
        inObject:inObject,
        split:split,
        getFormJSON: getFormJSON,
        dateToString : dateToString,
        timeToString : timeToString
    };
});