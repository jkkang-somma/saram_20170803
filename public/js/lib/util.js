// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery', 
  'underscore', 
  'backbone'
], function($, _, Backbone){
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
    return {
        isNull:isNull,
        isNotNull:isNotNull,
        inArray:inArray,
        inObject:inObject
    };
});