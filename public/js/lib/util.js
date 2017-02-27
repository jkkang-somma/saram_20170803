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

    var getMonday = function(date) { //월요일 ~ 일요일 구하기 201-01-01
    	var intDayCnt1 = 0;
    	var intDayCnt2 = 0;

        var year = date.substring(0, 4);
        var month = date.substring(5, 7);
        var day = date.substring(8, 10);
        var week = new Array("일", "월", "화", "수", "목", "금", "토");

        var vn_day1 = new Date(year, month - 1, day);

        var i = vn_day1.getDay(); //기준일의 요일을 구한다.( 0:일요일, 1:월요일, 2:화요일, 3:수요일, 4:목요일, 5:금요일, 6:토요일 )

        if ((i > 0) && (i < 7)) { //기준일이 월~토 일때
            intDayCnt1 = 1 - i;
            intDayCnt2 = 7 - i;
        }
        else if (i == 0) {  //기준일이 일요일일때
            intDayCnt1 = -6;
            intDayCnt2 = 0;
        }

        //기준일의 주의 월요일의 날짜와 토요일의 날짜
		var Cal_st = new Date(vn_day1.getFullYear(), vn_day1.getMonth(), vn_day1.getDate() + intDayCnt1);
        // var Cal_en = new Date(vn_day1.getYear(), vn_day1.getMonth(), vn_day1.getDate() + intDayCnt2);
        
        return Cal_st;
    }
	
    return {
        isNull:isNull,
        isNotNull:isNotNull,
        inArray:inArray,
        inObject:inObject,
        split:split,
        getFormJSON: getFormJSON,
        dateToString : dateToString,
        timeToString : timeToString,
        getMonday: getMonday
    };
});