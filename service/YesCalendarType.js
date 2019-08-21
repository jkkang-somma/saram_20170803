// 부서 Service
var _ = require("underscore");
var debug = require('debug')('YesCalendarType');
var YesCalendarTypeDao = require('../dao/YesCalendarTypeDao.js');
var YesCalendarDao = require('../dao/YesCalendarDao.js');
var db = require('../lib/dbmanager.js');

var YesCalendarType = function () {
  var _getYesCalendarTypeList = function (userId) {
    return YesCalendarTypeDao.selectYesCalendarType(userId);
  };

  var _addYesCalendarType = function (memberId, deptCode, calendarTypeStr, color, fcolor, visible, shareDept, shareMemberList) {
    // return YesCalendarTypeDao.insertYesCalendarType(memberId, deptCode, calendarTypeStr, color, fcolor, visible, shareDept);

    return new Promise(function (resolve, reject) {// promise patten
      YesCalendarTypeDao.insertYesCalendarType(memberId, deptCode, calendarTypeStr, color, fcolor, visible, shareDept).then(function(result) {
        if (shareMemberList.length === 0) {
          resolve(result);
        } else {
          var queryArr = [];
          for(var memberItem of shareMemberList){
            queryArr.push(YesCalendarTypeDao.insertYesCalendarTypeShare(memberId, result.insertId, memberItem.id));
          }
          
          db.queryTransaction(queryArr).then(function(resultArr){
            resolve(result);
          }, function(err){
            reject(err);
          });
        }
      }, function(err) {
        reject(err);
      });
    });
  };

  var _removeYesCalendarType = function (calendarTypeId, userId) {
    return new Promise(function (resolve, reject) {// promise patten
      if (calendarTypeId === "1") {
        debug("default calendar_type_del is not allow!");
        var e = new Error("default calendar_type_del is not allow");
        // var e = {message: "!"};
        reject(e);
        return;
      }
      YesCalendarTypeDao.deleteYesCalendarType(calendarTypeId, userId).then(function() {
        // 캘린더가 지워지면 일정을 모두 기본 일정으로 변경해야 함.
        YesCalendarDao.updateYesCalendarForType(1, calendarTypeId, userId).then(function() {
          YesCalendarTypeDao.deleteYesCalendarTypeShare(userId, calendarTypeId).then(function() {
            resolve(true);
          });
        });
      });
    }).catch(function (e) {//Connection Error
      debug("_removePart ERROR:" + e.message);
      reject(e);
    });
  };

  var _editYesCalendarType = function (calendarTypeStr, color, fcolor, visible, shareDept, calendarTypeId, memberId, shareMemberList) {
    // return YesCalendarTypeDao.updateYesCalendarType(calendarTypeStr, color, fcolor, visible, calendarTypeId, memberId);
    
    // share 정보 Delete 후 다시 Insert
    return new Promise(function (resolve, reject) {// promise patten
      YesCalendarTypeDao.updateYesCalendarType(calendarTypeStr, color, fcolor, visible, shareDept, calendarTypeId, memberId).then(function(result) {
        YesCalendarTypeDao.deleteYesCalendarTypeShare(memberId, calendarTypeId).then(function() {
          if (shareMemberList.length === 0) {
            resolve(result);
          } else {
            var queryArr = [];
            for(var memberItem of shareMemberList){
              queryArr.push(YesCalendarTypeDao.insertYesCalendarTypeShare(memberId, calendarTypeId, memberItem.id));
            }
            if (queryArr.length === 0) {
              resolve(result);
            }
            db.queryTransaction(queryArr).then(function(resultArr){
              resolve(result);
            }, function(err){
              reject(err);
            });
          }
        });
      });
    });
  };

  //// 공유 캘린더

  // var _selectYesCalendarTypeShare = function (member_id) {
  //   return YesCalendarTypeDao.selectYesCalendarTypeShare(member_id);
  // };

  var _deleteYesCalendarTypeShare = function (member_id, calendarTypeId) {
    return YesCalendarTypeDao.deleteYesCalendarTypeShare(member_id, calendarTypeId);
  };

  return {
    getYesCalendarTypeList: _getYesCalendarTypeList,
    addYesCalendarType: _addYesCalendarType,
    removeYesCalendarType: _removeYesCalendarType,
    editYesCalendarType: _editYesCalendarType,

    deleteYesCalendarTypeShare: _deleteYesCalendarTypeShare,
    // selectYesCalendarTypeShare: _selectYesCalendarTypeShare,
  }
}
module.exports = YesCalendarType;

