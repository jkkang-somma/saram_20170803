// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Vacation');
var Schemas = require("../schemas.js");
var Promise = require('bluebird');
var VacationDao= require('../dao/vacationDao.js');
var UserDao= require('../dao/userDao.js');
var db = require('../lib/dbmanager.js');
/**
 * id 자릿수가 7자리(외주인력)은 휴가 수가 15일로 고정 
 * 
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
 *  => 15 + ( rounddwon( A-1 ) / 2 ) 
 *
 */
var getHoliday = function(userId, joinDate) {
	var joinDateArr = joinDate.split("-"),
		joinYear = parseInt( joinDateArr[0]),
		joinMonth = parseInt( joinDateArr[1]),
		joinDay = parseInt( joinDateArr[2]),
		nowYear = new Date().getFullYear(),
		nowMonth = (new Date().getMonth() +1),
		diffYear = nowYear -  joinYear,
		holiday = 0;
	
	if (userId.length >= 7) {	// ID가 7자리 이상 -> 외주 인력은 15일로 고정
		return 15;
	}
		
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
		var tNum = 15 +  parseInt( (diffYear-1) / 2);
		
		return parseInt(tNum);
	}
};

var Vacation = function() {	

	var _getVacation = function(data) {
		return VacationDao.selectVacationsByYear(data.year);
	};
	
	var _getVacationById = function(data) {
		return VacationDao.selectVacatonById(data.id);
	};

	var _setVacation = function(data) {
        return new Promise(function(resolve, reject){// promise patten
    		UserDao.selectUserList().then(function(result) {
    			var datas = [],
    				obj = {};
    			
    			for (var i = 0, len = result.length; i < len; i++) {    				
    				if (result[i].leave_company != "" && result[i].leave_company != null) {	// 퇴사일이 있는 경우 연차 생성하지 않음 
    					continue;
    				}
    				
    				if (result[i].dept_code == '0000') { // 임원의 경우 제회 
    					continue;
    				}    				
    				
    				obj = {
    						id : (result[i].id),
    						year : data.year,
    						total_day : getHoliday(result[i].id, result[i].join_company)
    				};
    				datas.push(obj);
    			}
    			
    			db.getConnection().then(function(connection){
    				var promiseArr = [];
    				promiseArr.concat(VacationDao.insertVacation(connection, datas));
    				Promise.all(promiseArr).then(function(resultArr){
						connection.commit(function(){
							var successCount = _.filter(resultArr,function(result){
								return result[0].affectedRows > 0;
							});
							
							var result = {
								totalCount : resultArr.length,
								successCount : successCount.length,
								failCount : resultArr.length - successCount.length,
							};
						    resolve(result);
						});
					},function(){
						connection.rollback(function(){
							connection.release();
							reject();
						});
					}).catch(function(){
					    connection.rollback(function(){
					        connection.release();
					        reject();
					    });
					});	
    			});
    			
    		}).catch(function(e){//Connection Error
               reject(e);
            });
        });
	};	
	
	var _updateVacation = function(data) {
		return VacationDao.updateVacation(data);
	}
	
	return {
		getVacation : _getVacation,
		getVacationById : _getVacationById,
		setVacation : _setVacation,
		updateVacation : _updateVacation
	}
} 

module.exports = new Vacation();