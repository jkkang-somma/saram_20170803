// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.22
var debug = require('debug')('dashboardDao');
var db = require('../lib/dbmanager.js');

var DashboardDao = function () {
};
DashboardDao.prototype.selectWorkingSummaryById =  function (params) {
    var queryStr = db.getQuery('dashboard', 'selectWorkingSummaryById');
    return db.queryV2(queryStr, [params.start, params.end, params.userId]);
};
module.exports = new DashboardDao();