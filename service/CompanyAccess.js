// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Vacation');
var Schemas = require("../schemas.js");
var Promise = require('bluebird');
var RawDataDao= require('../dao/rawDataDao.js');
var UserDao= require('../dao/userDao.js');
var Moment = require("moment");

var CompanyAccess = function() {	

  var _makeData = function(req) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g, key;
    ip = ip.match(ipRegex);

    var bodyDecode = {}
    try {
      var b = new Buffer(req.body.p, 'base64')
      var s = b.toString()
      bodyDecode = JSON.parse(s);
      debug('companyAccessRouter in...')
      console.info(req.body)
      console.info(bodyDecode)
    } catch (e) {
      debug('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ 출/퇴근 에러 - 시작 $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
      debug('Exception')
      console.info(e)
      console.info(req)
      debug('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ 출/퇴근 에러 - 끝   $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
    }
    
    if (bodyDecode.t === 'A') {
      bodyDecode.type = '출근(온라인)'
    } else if (bodyDecode.t === 'B') {
      bodyDecode.type = '퇴근(온라인)'
    } else {
      debug('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ 출/퇴근 에러 - 시작 $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
      console.info(req.body)
      console.info(bodyDecode)
      debug('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ 출/퇴근 에러 - 끝   $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
    }

    var inData = {
      type : bodyDecode.type,
      ip_pc : _.isEmpty(bodyDecode.k)?null:bodyDecode.k,
      mac : _.isEmpty(bodyDecode.mac)?null:bodyDecode.mac,
      ip_office : ip, 
      param : bodyDecode.p
    };

    return inData;
  }

	var _setAccess = function(data, user) {
		return new Promise(function(resolve, reject){
			var selDataObj = {
					id: user.id,
					ip_pc: data.ip_pc,		// ip_office 값으로 체크 -> 추후 ip_pc로 변경 될수 있음    
					ip_office: data.ip_office	// ip_office 값으로 체크
			};

			UserDao.selectUserByIp(selDataObj).then(function(result) {
				var need_confirm = 1; // 1: 정상 , 2: 확인 필요	- IVS 무조건 정상
				// if (result.length == 0) {	// 조회 값이 없는 경우 
				// 	need_confirm = 2;
				// }
			
				var insertDataObj = {
						id : user.id,
						name : user.name,
						department : user.dept_name,
						type : data.type,
						ip_pc : data.ip_pc==null?null:data.ip_pc.toString(),
						ip_office : data.ip_office,
						need_confirm : need_confirm,
						char_date : Moment().format("YYYY-MM-DD HH:mm:ss"),
						mac:data.mac==null?null:data.mac.toString(), 
						param : data.param // platform_type
				};
				
				RawDataDao.insertRawDataCompanyAccess(insertDataObj).then(function(inResult) {
				  	resolve({dbResult : inResult, data : insertDataObj});
	    		}).catch(function(e){
            reject(e);
          });
				
			});
		});
	}
	return {
    setAccess : _setAccess,
    makeData : _makeData
	}
} 

module.exports = new CompanyAccess();