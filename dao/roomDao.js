var db = require('../lib/dbmanager.js');
var group = "room";

var RoomDao = function () {
};

RoomDao.prototype.selectRoomList =  function () {//select user;
    return db.query(group, "selectRoomList", []);
};

module.exports = new RoomDao();

