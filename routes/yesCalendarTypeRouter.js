var express = require('express');
var debug = require('debug')('yesCalendarTypeRouter');
var router = express.Router();
var _ = require("underscore");
var sessionManager = require('../lib/sessionManager');
var YesCalendarType = require('../service/YesCalendarType.js');


// 조회
router.route('/')
  .get(function (req, res) {
    var userId = sessionManager.get(req.cookies.saram).user.id;
    var yesCalendarType = new YesCalendarType();
    yesCalendarType.getYesCalendarTypeList(userId).then(function (result) {
      debug("Complete Select YesCalendarType List.");
      res.send(result);
    }).catch(function (e) {
      debug("Error Select YesCalendarType List.");
      res.status(500);
      res.send({
        success: false,
        message: e.message,
        error: e
      });
    });
  });

// 추가
router.route('/')
  .post(function (req, res) {
    var yesCalendarType = new YesCalendarType();
    var userId = sessionManager.get(req.cookies.saram).user.id;
    var userDeptCode = sessionManager.get(req.cookies.saram).user.dept_code;
    debug(`ADD YesCalendarType : userId [${userId}] calendarTypeStr [${req.body.calendar_type_str}]`);
    
    var rb = req.body;
    yesCalendarType.addYesCalendarType(userId, userDeptCode, rb.calendar_type_str, rb.color, rb.fcolor, 1, rb.share_dept, rb.share_member_list).then(function (result) {
      debug("Complete Add 'YesCalendarType.");

      yesCalendarType.getYesCalendarTypeList(userId).then(function(selectResult) {
        res.send({ success: true, msg: "Complete Add YesCalendarType.", calendar_type_id: result.insertId , list_all: selectResult});
      });
    }).catch(function (e) {
      debug("Error Add YesCalendarType.");
      res.status(500);
      res.send({
        success: false,
        message: e.message,
        error: e
      });
    });
  });

// 1건 조회 현재는 기능 없음.
router.route('/:code')
  // .get(function(req, res){
  //     var _code=req.param("calendar_id");
  //     var position = new Position({calendar_id:_code});
  //     position.getPositionList().then(function(result){
  //         debug("Complete Select Position.");
  //         res.send(result);
  //     }).catch(function(e){
  //         debug("Error Select Position.");
  //         res.status(500);
  //         res.send({
  //             success:false,
  //             message: e.message,
  //             error:e
  //         });
  //     });
  // })

  // 수정
  .put(function (req, res) {
    var yesCalendarType = new YesCalendarType(req.body);
    var userId = sessionManager.get(req.cookies.saram).user.id;
    yesCalendarType.editYesCalendarType(req.body.calendar_type_str, req.body.color, req.body.fcolor, 1, req.body.share_dept, req.params.code, userId, req.body.share_member_list).then(function (result) {
      res.send(result);
    }).catch(function (e) {
      debug("Error.");
      res.status(500);
      res.send({
        success: false,
        message: e.message,
        error: e
      });
    });
  })

  //삭제
  .delete(function (req, res) {
    var yesCalendarType = new YesCalendarType();
    var userId = sessionManager.get(req.cookies.saram).user.id;
    yesCalendarType.removeYesCalendarType(req.params.code, userId).then(function (result) {
      debug("Complete Delete YesCalendar.");
      res.send(result);
    }).catch(function (e) {
      debug("Error Delete YesCalendar.");
      res.status(500);
      res.send({
        success: false,
        message: e.message,
        error: e
      });
    });
  });

module.exports = router;
