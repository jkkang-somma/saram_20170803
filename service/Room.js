var _ = require("underscore"); 
var debug = require('debug')('Room');
var LunarCalendar = require("lunar-calendar");
var RoomDao= require('../dao/roomDao.js');

var Room = function () {
    
    var _getRoomList = function () {
        return RoomDao.selectRoomList();
    };
    
    return {
        getRoomList : _getRoomList,
    };
};

module.exports = new Room();
