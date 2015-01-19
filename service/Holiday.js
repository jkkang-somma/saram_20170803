var _ = require("underscore"); 
var debug = require('debug')('Holiday');
var LunarCalendar = require("lunar-calendar");
var HolidayDao= require('../dao/holidayDao.js');

var Holdiay = function (data) {
    var _data = data;
    
    if(_data.year){
        _data.date = _data.year + "-" + _data.date;    
    }
    
    if(_data.lunar){
        //debug("lunarDate : " + _data.date);
        
        var date = new Date(_data.date);
        var solarDate = LunarCalendar.lunarToSolar(date.getFullYear(), date.getMonth()+1, date.getDate());
        _data.date = solarDate.year + "-"
        + (solarDate.month <10 ? "0" + solarDate.month : solarDate.month) + "-"
        + (solarDate.day <10 ? "0" + solarDate.day : solarDate.day)
        _data.year = "" + solarDate.year;
    }
    
    //debug("solarDate : " + _data.date);
    var _getHolidayList = function () {//select user;
        return HolidayDao.selectHolidayList(_data.year);
    }
    
    var _insertHoliday = function(){
        if(_data._3days){
            var resultArr = [];
            for(var i = -1; i <= 1; i++){
                var date = new Date(_data.date);
                date.setDate(date.getDate() + i);
                var newData = {
                    date :date.getFullYear() + "-"
                        + (date.getMonth()+ 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-"
                        + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()),
                    year : "" + date.getFullYear(),
                    memo : _data.memo
                };
                
                resultArr.push(HolidayDao.insertHoliday(newData));
            }
            return resultArr;
        }else{
            return HolidayDao.insertHoliday(_data);
        }
    }
    
    var _deleteHoliday = function(){
        return HolidayDao.deleteHoliday(_data);
    }
    
    return {
        data : _data,
        getHolidayList : _getHolidayList,
        insertHoliday : _insertHoliday, 
        deleteHoliday : _deleteHoliday
    }
}

module.exports = Holdiay;

