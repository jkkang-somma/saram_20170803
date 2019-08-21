// 부서 Service
var _ = require("underscore");
var debug = require('debug')('YesCalendarType');
var YesCalendarDao = require('../dao/YesCalendarDao.js');
var YesCalendarTypeDao = require('../dao/YesCalendarTypeDao.js');

var YesCalendar = function () {
  var _getYesCalendar = function (userId, userDept, start, end) {
    // return YesCalendarDao.selectYesCalendar(start, end, calendarTypeIdList);
    return new Promise(function(resolve, reject){// promise patten
      YesCalendarTypeDao.selectCalendarTypeIdForMe(userId, userDept).then(function(calendarTypeIdList) {
        var calendarTypeIdListParam = [];
        for (var item of calendarTypeIdList) {
          calendarTypeIdListParam.push(item.calendar_type_id);
        }
        if (calendarTypeIdListParam.length === 0) {
          YesCalendarDao.selectYesCalendar2(userId, start, end).then(function(result) {
            resolve(result);
          }, function(error) {
            reject(error);
          });
        } else {
          YesCalendarDao.selectYesCalendar1(userId, start, end, calendarTypeIdListParam).then(function(result) {
            resolve(result);
          }, function(error) {
            reject(error);
          });
        }
      }, function(error) {
        reject(error);
      });
    });
  };

  var _addYesCalendar = function (member_id, title, all_day, start, end, alarm, calendar_type, memo) {
    return YesCalendarDao.insertYesCalendar(member_id, title, all_day, start, end, alarm, calendar_type, memo);
  };

  var _removeYesCalendar = function (calendarId, memberId) {
    return YesCalendarDao.deleteYesCalendar(calendarId, memberId);
  };

  var _editYesCalendar = function (title, allDay, start, end, alarm, calendarType, memo, calendarId) {
    return YesCalendarDao.updateYesCalendar(title, allDay, start, end, alarm, calendarType, memo, calendarId);
  };

  return {
    getYesCalendar: _getYesCalendar,
    addYesCalendar: _addYesCalendar,
    removeYesCalendar: _removeYesCalendar,
    editYesCalendar: _editYesCalendar,
  }
}
module.exports = YesCalendar;

