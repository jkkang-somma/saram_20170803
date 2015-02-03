// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var debug = require('debug')('approvalDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var MessageDao = function () {
};
MessageDao.prototype.getMessage =  function (data) {
    var queryStr = db.getQuery('message', 'getMessage');
    return db.queryV2(queryStr);
};
MessageDao.prototype.setMessage =  function (data) {
    var queryStr = db.getQuery('message', 'setMessage');
    return db.queryV2(queryStr, [data.text, data.visible, data.text, data.visible]);
};
module.exports = new MessageDao();