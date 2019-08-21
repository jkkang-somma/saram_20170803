var db = require('../lib/dbmanager.js');
var group = "yesCalendar";

var YesCalendarTypeDao = function () {
};

// 캘린더 리스트 조회 
YesCalendarTypeDao.prototype.selectYesCalendarType = function (id) {
  return db.query(group, "selectYesCalendarType", [id]);
};

// 캘린더 등록
YesCalendarTypeDao.prototype.insertYesCalendarType = function (memberId, deptCode, calendarTypeStr, color, fcolor, visible, shareDept) {
  console.log("insertYesCalendarType")
  return db.query(group, "insertYesCalendarType",[memberId, deptCode, calendarTypeStr, color, fcolor, visible, shareDept]);
};

// 캘린더 수정
YesCalendarTypeDao.prototype.updateYesCalendarType = function (calendarTypeStr, color, fcolor, visible, shareDept, calendarTypeId, memberId) {
  return db.query(group, "updateYesCalendarType", [calendarTypeStr, color, fcolor, visible, shareDept, calendarTypeId, memberId]);
};

// 사원의 부서가 변경될 경우 수행되어야 함. 
YesCalendarTypeDao.prototype.updateYesCalendarTypeForDeptCode1 = function (deptCode, memberId) {
  return db.query(group, "updateYesCalendarTypeForDeptCode1", [deptCode, memberId]);
};

// 부서코드가 변경될 경우 실행되어야 함.
YesCalendarTypeDao.prototype.updateYesCalendarTypeForDeptCode2 = function (deptCodeOld, deptCodeNew) {
  return db.query(group, "updateYesCalendarTypeForDeptCode2", [deptCodeOld, deptCodeNew]);
};

// 캘린더 삭제
YesCalendarTypeDao.prototype.deleteYesCalendarType = function (calendarTypeId, member_id) {
  return db.query(group, "deleteYesCalendarType", [calendarTypeId, member_id]);
};


//// 공유 캘린더 관련
// 조회
// YesCalendarTypeDao.prototype.selectYesCalendarTypeShare = function (member_id) {
//   return db.query(group, "selectYesCalendarTypeShare", [member_id]);
// };

// 공유 캘린더 추가 - bulk 용
YesCalendarTypeDao.prototype.insertYesCalendarTypeShare = function (member_id, calendarTypeId, shareMemberId) {
  return {
    group : group,
    item : "insertYesCalendarTypeShare",
    data : [member_id, calendarTypeId, shareMemberId]
  };
};

// 공유 캘린더 삭제
YesCalendarTypeDao.prototype.deleteYesCalendarTypeShare = function (member_id, calendarTypeId) {
  return db.query(group, "deleteYesCalendarTypeShare", [member_id, calendarTypeId]);
};

// 조회 가능한 캘린더 조회
YesCalendarTypeDao.prototype.selectCalendarTypeIdForMe = function (member_id, member_dept_code) {
  return db.query(group, "selectCalendarTypeIdForMe", [member_id, member_id, member_dept_code]);
};


module.exports = new YesCalendarTypeDao();

