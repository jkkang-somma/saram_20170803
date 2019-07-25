var express = require('express');
var _ = require('underscore');
var debug = require('debug')('messageRouter');
var Message = require('../service/Message.js');
var router = express.Router();
var sessionManager = require('../lib/sessionManager');

router.route('/')
  .get(function (req, res) {
    Message.getCleanDay().then(function (result) {
      res.send(result[0]);
    });
  }).post(function (req, res) {
    var adminString=sessionManager.getAdminString(req.cookies.saram);
    if (adminString !== '%') {
      res.status(401);
      res.send({
        success:false,
        message: "권한 없음.",
      });
    } else {
      Message.setCleanDay(req.body).then(function (result) {
        res.send({ result: result, success: true });
      });
    }
  });
module.exports = router;
