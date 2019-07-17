var express = require('express');
var debug = require('debug')('roomRouter');
var router = express.Router();
var Room = require('../service/Room.js');

// 회의실 조회
router.route('/')
  .get(function (req, res, next) {
    Room.getRoomList().then(function (result) {
      return res.send(result);
    }).catch(function (err) {
      next(err);
    });

  });

// 회의실 등록
router.route('/')
  .post(function (req, res) {
    debug("ADD ROOM CODE:" + req.body.name);

    Room.addRoomList(req.body).then(function (e) {
      debug("Complete Add Room.");
      res.send({ success: true, msg: "Complete Add Room.", index: e.insertId});
    }).catch(function (e) {
      debug("Error Add Room.");
      res.status(500);
      res.send({
        success: false,
        message: e.message,
        error: e
      });
    });
  });

  //회의실 수정
  router.route('/:index')
  .put(function (req, res) {
    Room.editRoomList(req.body).then(function (result) {
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


module.exports = router;