var express = require('express');
var debug = require('debug')('yesCalendarRouter');
var router = express.Router();
var _ = require("underscore");
var YesCalendar = require('../service/YesCalendar.js');
var sessionManager = require('../lib/sessionManager');

// 조회
router.route('/')
  .get(function (req, res) {
    var userId = sessionManager.get(req.cookies.saram).user.id;
    var userDept = sessionManager.get(req.cookies.saram).user.dept_code;
    var yesCalendar = new YesCalendar();
    yesCalendar.getYesCalendar(userId, userDept, req.query.start, req.query.end).then(function (result) {
      debug("Complete Select CalendarList List.");
      res.send(result);
    }).catch(function (e) {
      debug("Error Select CalendarList List.");
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
    var yesCalendar = new YesCalendar(req.body);
    debug("CODE:" + yesCalendar.title);

    var userId = sessionManager.get(req.cookies.saram).user.id;
    yesCalendar.addYesCalendar(userId, req.body.title, 1, req.body.start_date, req.body.end_date, 0, req.body.yescalendar_type, req.body.calendar_memo).then(function (e) {
      debug("Complete Add YesCalendar.");
      res.send({ success: true, msg: "Complete Add YesCalendar." });
    }).catch(function (e) {
      debug("Error Add YesCalendar.");
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
    var param = req.body;
    var yesCalendar = new YesCalendar();
    yesCalendar.editYesCalendar(param.title, 1, param.start_date, param.end_date, 0, param.yescalendar_type, param.calendar_memo, param.calendar_id).then(function (result) {
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
    var yesCalendar = new YesCalendar();
    var userId = sessionManager.get(req.cookies.saram).user.id;
    yesCalendar.removeYesCalendar(req.params.code, userId).then(function (result) {
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
