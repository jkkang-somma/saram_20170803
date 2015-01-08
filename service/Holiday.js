// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Holiday');
var Schemas = require("../schemas.js");
var HoldiayDao= require('../dao/holidayDao.js');

var Holdiay = function (data) {
    var _getHolidayList = function () {//select user;
        return HoldiayDao.selectHolidayList(data.year);
    }
    
    return {
        getHolidayList:_getHolidayList
    }
}

//new app 은 싱글톤 아니고 app은 계속 생성
module.exports = Holdiay;

