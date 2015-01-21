// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Vacation');
var Schemas = require("../schemas.js");
var Promise = require('bluebird');
var VacationDao= require('../dao/vacationDao.js');
var UserDao= require('../dao/userDao.js');

/**
 * 금년도 - 입사년도 = A
 * A값에 따라서 계산법을 달리합니다.
 * 
 * A : 0
 *   => 오늘 날짜 - 입사 월/일 로 계산하여 만 a개월 b일 이 지났을 경우 a개월에 해당하는 수가 연차일이 됨.
 *       ex ) 2015/01/05 입사하고 오늘이 2015/03/15 인 경우 2015/03/15 - 2015/01/05 = 2개월 10일 => 연차는 2일
 * 
 * A : 1
 *   => Q : 입사월 
 *        W : ( 12 - 입사월 )
 *        일때
 *        Q + ( 15/12*W) = E
 *        E의 소수점이 0.5 이상이면 +1
 *        E의 소수점이 0.1 이상이면 +0.5
 *        E의 소수점이 0.1 미만인 경우 버림
 *  
 *  
 * A : 2  이상인 경우
 *  => 14 + ( A/2 )
 *       A/2의 계산에서 소수점이 나오면 버림한 후 14와 더한다.
 *       A 값이 3이상일 경우 1을 추가 
 *
 */
var getHoliday = function(joinDate) {
	var joinDateArr = joinDate.split("-"),
		joinYear = parseInt( joinDateArr[0]),
		joinMonth = parseInt( joinDateArr[1]),
		joinDay = parseInt( joinDateArr[2]),
		nowYear = new Date().getFullYear(),
		nowMonth = (new Date().getMonth() +1),
		diffYear = nowYear -  joinYear,
		holiday = 0;
		
	if ( diffYear == 0) {
		return nowMonth - joinMonth;
		
	} else if (diffYear == 1) {
		var a = ( joinMonth + (15 / 12 * (12-joinMonth)) ).toString();
		var aArr = a.split(".");
		var tResult = 0;
		if (aArr.length == 2) {
			var tNum = parseFloat( ("0."+ aArr[1] ) );
			
			if (tNum >= 0.5 ) {
				tResult = 1;
			} else if (tNum >= 0.1) {
				tResult = 0.5;
			}			
			return ( parseInt(aArr[0]) + tResult);
		} else {
			return  parseInt(aArr[0]);
		}

	} else {
		var tNum = 14 + (diffYear/2);
		if (diffYear >= 3) {
			tNum++;
		}
		
		return parseInt(tNum);
	}
};

var Vacation = function() {	

	var _getVacation = function(data, callback) {
		VacationDao.selectVacationsByYear(data.year).then(function(result) {
			return callback(result);	
		});
	};
	
	var _getVacationById = function(data, callback) {
		VacationDao.selectVacatonById(data.id).then(function(result) {
			return callback(result);	
		});
	};

	var _setVacation = function(data, callback) {
		UserDao.selectUserList().then(function(result) {			
			var datas = [],
				obj = {};
			
			for (var i = 0, len = result.length; i < len; i++) {
				
				if (result[i].leave_company != "" && result[i].leave_company != null) {	// 퇴사일이 있는 경우 연차 생성하지 않음 
					continue;
				}
				
				obj = {
						id : (result[i].id),
						year : data.year,
						total_day : ( (result[i].id.length == 7)?15 : getHoliday(result[i].join_company) ) // id 자릿수가 7자리(외주인력)은 휴가 수가 15일
				};
				datas.push(obj);
			}
			
			VacationDao.insertVacation(datas).then(function(result) {
				return callback(result);
			});
		});
	};	
	
	
	var _updateVacation = function(data, callback) {
		VacationDao.updateVacation(data).then(function(result) {
			debug("VacationDao.updateVacation 결과");
			debug(result);
			return callback(result);	
		});
	}
	
	return {
		getVacation : _getVacation,
		getVacationById : _getVacationById,
		setVacation : _setVacation,
		updateVacation : _updateVacation
	}
} 

module.exports = new Vacation();