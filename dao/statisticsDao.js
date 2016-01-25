var db = require('../lib/dbmanager.js');
var group = 'statistics';

var StatisticsDao = function () {
    
};

StatisticsDao.prototype.selectPageUrlCount =  function (url) {
    return db.query(group, "selectPageUrlCount", [url]);
};

StatisticsDao.prototype.updatePageUrlCount =  function (url, count) {
    return db.query(group, "updatePageUrlCount", [url, count, url, count]);
};

module.exports = new StatisticsDao();
