// 부서 Service
var db = require('../lib/dbmanager.js');
var group = 'part';

var partDao = function () {
    
};

partDao.prototype.selectPartList =  function () {
    return db.query(group, "selectPart", []);
};

//leader(user name)
partDao.prototype.selectUserPartList =  function (leader) {
    return db.query(group, "selectUserPartList", [leader]);
};

partDao.prototype.deletePart = function(code){
    return db.query(group, "deletePart",[code]);
};

partDao.prototype.insertPart = function(part){
      return db.query(group, "insertPart",
        [part.code, part.name, part.leader]
    );
};

partDao.prototype.updatePart = function(part){
    return db.query(group, "updatePart", 
        [part.name, part.leader, part.code]
    );
};

partDao.prototype.selectCodeData =  function (data) {
    return db.query(group, "selectCodeData", [data.code]);
};


module.exports = new partDao();
