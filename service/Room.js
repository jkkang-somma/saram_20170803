var _ = require("underscore"); 
var debug = require('debug')('Room');
var LunarCalendar = require("lunar-calendar");
var RoomDao= require('../dao/roomDao.js');

var Room = function () {
    
  var _getRoomList = function () {
      return RoomDao.selectRoomList();
  };

  var _addRoomList = function (param) {
    return RoomDao.addRoomList(param.name, param.use);
  };

  var _editRoomList = function (param) {
    return RoomDao.editRoomList(param.index, param.name, param.use);
  };
  
  return {
      getRoomList : _getRoomList,
      addRoomList : _addRoomList,
      editRoomList : _editRoomList,
  };
};

module.exports = new Room();
