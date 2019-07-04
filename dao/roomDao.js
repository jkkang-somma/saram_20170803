var db = require('../lib/dbmanager.js');
var group = "room";

var RoomDao = function () {
};

RoomDao.prototype.selectRoomList =  function () {
    return db.query(group, "selectRoomList", []);
};

RoomDao.prototype.addRoomList =  function (name, use) {
  return db.query(group, "insertRoomList", [name, use]);
};

// RoomDao.prototype.removeRoomList =  function (index, name, use) {
//   return db.query(group, "deleteRoomList", [index, name, use]);
// };

RoomDao.prototype.editRoomList =  function (index, name, use) {
  return db.query(group, "updateRoomList", [name, use, index]);
};

module.exports = new RoomDao();
