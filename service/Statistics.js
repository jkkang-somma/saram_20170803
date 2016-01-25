var _ = require("underscore"); 
var debug = require('debug')('Approval');
var Schemas = require("../schemas.js");
var StatisticsDao= require('../dao/statisticsDao.js');

var db = require('../lib/dbmanager.js');

var Statistics = function () {
    
    var _updatePageUrlCount = function (pageUrl) {
        StatisticsDao.selectPageUrlCount(pageUrl).then( function (result) {    
        var count = 1;
        if ( !_.isUndefined(result) && result.length != 0 )
            count = result[0].count + 1;
        
        return StatisticsDao.updatePageUrlCount(pageUrl, count);
        });        
    };
    
    return {
        updatePageUrlCount:_updatePageUrlCount
    };
};

module.exports = Statistics;

