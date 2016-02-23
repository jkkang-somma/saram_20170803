// 직급 Service
var db = require('../lib/dbmanager.js');
var group = 'position';

var positionDao = function () {
    
};

positionDao.prototype.selectPositionList =  function () {
    return db.query(group, "selectPosition", []);
};


positionDao.prototype.deletePosition = function(code){
    return db.query(group, "deletePosition",[code]);
};

positionDao.prototype.insertPosition = function(position){
      return db.query(group, "insertPosition",
        [position.code, position.name]
    );
};

positionDao.prototype.updatePosition = function(position){
    return db.query(group, "updatePosition", 
        [position.name, position.code]
    );
};

positionDao.prototype.selectPositionCode =  function (data) {
    return db.query(group, "selectPositionCode", [data.code]);
};

module.exports = new positionDao();
