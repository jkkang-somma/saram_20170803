// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.22
var _ = require("underscore"); 
var debug = require('debug')('Dashboard');
var Schemas = require("../schemas.js");
var DashboardDao= require('../dao/dashboardDao.js');

var Dashboard = function () {
    var _getWorkingSummary=function(params){
        return DashboardDao.selectWorkingSummaryById(params);
    };

    var _getCommuteSummary=function(params){
        return DashboardDao.selectCommuteSummaryById(params);
    };

    var _getAttendacne=function(params){
        return DashboardDao.selectAttendanceById(params);
    };
    
    return {
        getWorkingSummary:_getWorkingSummary,
        getCommuteSummary:_getCommuteSummary,
        getAttendacne:_getAttendacne
    }
}
module.exports = Dashboard;

