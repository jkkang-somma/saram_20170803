var _ = require("underscore"); 
var debug = require('debug')('RoomReg');
var LunarCalendar = require("lunar-calendar");
var RoomRegDao= require('../dao/roomRegDao.js');

var RoomReg = function () {

    var _selectRoomRegList = function(data){
        return RoomRegDao.selectRoomRegList(data);
    };

    var _insertRoomReg = function(data){
        return RoomRegDao.insertRoomReg(data);
    };

    var _checkRoomReg = function(data) {
        return RoomRegDao.selectRoomRegBefore(data);
    };

    var _updateRoomReg = function(data){
        return RoomRegDao.updateRoomReg(data);
    };
    
    var _deleteRoomReg = function(index){
        return RoomRegDao.deleteRoomReg(index);
    };
    
    return {
        selectRoomRegList : _selectRoomRegList,
        insertRoomReg : _insertRoomReg,
        checkRoomReg  : _checkRoomReg,
        updateRoomReg : _updateRoomReg,
        deleteRoomReg : _deleteRoomReg,
    };
};

module.exports = new RoomReg();
