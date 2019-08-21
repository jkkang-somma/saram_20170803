var db = require('../lib/dbmanager.js');
var group = "yesCalendar";

var YesCalendarDao = function () {
};

// 일정 조회 calendarTypeIdList 가 있을 경우 
YesCalendarDao.prototype.selectYesCalendar1 = function (member_id, startDate, endDate, calendarTypeIdList) {
  return db.query(group, "selectYesCalendar1", [startDate, endDate, startDate, endDate, member_id, calendarTypeIdList]);
};

// 일정 조회 calendarTypeIdList 가 없을 경우
YesCalendarDao.prototype.selectYesCalendar2 = function (member_id, startDate, endDate) {
  return db.query(group, "selectYesCalendar2", [member_id, startDate, endDate, startDate, endDate]);
};

// 일정 등록
YesCalendarDao.prototype.insertYesCalendar = function (memberId, title, allDay, start, end, alarm, calendarType, memo) {
  return db.query(
    group,
    "insertYesCalendar",
    [memberId, title, allDay, start, end, alarm, calendarType, memo]
  );
};

// 일정 수정
YesCalendarDao.prototype.updateYesCalendar = function (title, allDay, start, end, alarm, calendarType, memo, calendarId) {
  return db.query(group, "updateYesCalendar", [title, allDay, start, end, alarm, calendarType, memo, calendarId]);
};

// 일정 삭제
YesCalendarDao.prototype.deleteYesCalendar = function (calendarId, memberId) {
  return db.query(group, "deleteYesCalendar", [calendarId, memberId]);
};


//// 캘린더 타입
// 캘린더 수정 - 캘린더 삭제에 따른 일괄 변경 필요 시
YesCalendarDao.prototype.updateYesCalendarForType = function (toCalendarType, fromCalendarType, memberId) {
  return db.query(group, "updateYesCalendarForType", [toCalendarType, fromCalendarType, memberId]);
};

module.exports = new YesCalendarDao();

