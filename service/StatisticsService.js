var _ = require("underscore"); 
var debug = require('debug')('StatisticsService');
var Promise = require('bluebird');
var StatisticsDao = require('../dao/statisticsDao.js');
var VacationDao = require('../dao/vacationDao.js');

var StatisticsService = function () {
    
    var _selectAbnormalDeptSummary = function (type, from, to) {
        return new Promise(function(resolve, reject){// promise patten
            var result = {};
            if ( type == "DEPT" ) {
                StatisticsDao.selectDeptPersonCountType2(from, to).then(function (result2) {
                    result["DeptPersionCount"] = result2;
                    StatisticsDao.selectAbnormalDeptSummary(from, to).then(function (result3) {
                        result["DeptSummary"] = result3;
                        resolve(result);
                    });
                });
            }else{
                StatisticsDao.selectAbnormalPersonSummary(from, to).then(function (result3) {
                    result["DeptSummary"] = result3;
                    resolve(result);
                });
            }
        });
    };

    var _selectDeptDetail = function(from, to, dept, workType) { 
        return StatisticsDao.selectDeptDetail(from, to, dept, workType);
    };

    // 휴가 정보 / 추가근무 정보
    var _selectReport1 = function (type, fromDate, toDate, id) {
        return new Promise(function(resolve, reject){// promise patten
            var result = {};
            
            if ( type == "DEPT"){
                StatisticsDao.selectDeptPersonCountType2(fromDate, toDate).then(function (result2) {
                    result["DeptPersionCount"] = result2;
                    StatisticsDao.selectOverTimeDept(fromDate, toDate).then(function (result3) {
                        result["OverTimeInfo"] = result3;
                        resolve(result);
                    });
                });
            }else{
                StatisticsDao.selectOverTimePersonal(fromDate, toDate).then(function (result2) {
                    result["OverTimeInfo"] = result2;
                    VacationDao.selectVacationsByYear(fromDate.substring(0,4), id).then(function (result3) {
                        result["VacationInfo"] = result3;
                        resolve(result);
                    });
                });
            }
        });
    };

    var _selectAvgInOutTime = function(year, startDate, endDate, id) { 
      return StatisticsDao.selectAvgInOutTime(year, startDate, endDate, id);
    };
    
    return {
        selectAbnormalDeptSummary:_selectAbnormalDeptSummary,
        selectDeptDetail:_selectDeptDetail,
        selectReport1 : _selectReport1,
        selectAvgInOutTime: _selectAvgInOutTime
    };
};

module.exports = new StatisticsService();

