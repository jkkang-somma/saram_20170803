var _ = require("underscore"); 
var debug = require('debug')('StatisticsService');
var Promise = require('bluebird');
var StatisticsDao= require('../dao/statisticsDao.js');

var StatisticsService = function () {
    
    var _selectAbnormalDeptSummary = function (startDate) {
        return new Promise(function(resolve, reject){// promise patten
            var result = {};
            
            StatisticsDao.selectDeptPersonCount(startDate+"%").then(function (result2) {
                result["DeptPersionCount"] = result2;
                StatisticsDao.selectAbnormalDeptSummary(startDate+"%").then(function (result3) {
                    result["DeptSummary"] = result3;
                    resolve(result);
                });
            });
        });
    };

    var _selectDeptDetail = function(yearMonth, dept, workType) { 
        return StatisticsDao.selectDeptDetail(yearMonth+"%", dept, workType);
    };
    
    return {
        selectAbnormalDeptSummary:_selectAbnormalDeptSummary,
        selectDeptDetail:_selectDeptDetail
    };
};

module.exports = new StatisticsService();

