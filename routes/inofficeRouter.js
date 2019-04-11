// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
var express = require('express');
var debug = require('debug')('InOfficeRouter');
var Promise = require('bluebird');
var router = express.Router();
var InOffice = require('../service/InOffice.js');
var sessionManager = require('../lib/sessionManager');

router.route('/')
    .get(function(req, res) {
        // 관리자이고, 개인 정보만 조회할 경우
        // 관리자이고, 모든 정보를 조회할 경우
        // 관라자가 아닌 경우 ( 무조건 개인정보만 조회 )
        var adminString=sessionManager.getAdminString(req.cookies.saram);
        if (adminString !== '%') {
            // 일반 사용자
            req.query.id = adminString
        }
        InOffice.getInOfficeList(req.query).then(function(result) {
            res.send(result);
        });

    });

router.route('/bulk')
    .put(function(req, res) {
        InOffice.remove(req.body).then(function() {
            debug("Complete Delete User.");
            res.send({
                success: true,
                message: "Complete Delete User."
            });
        }).catch(function(e) {
            debug("Error Delete User.");
            debug(e);
            res.status(500);
            res.send({
                success: false,
                message: e.message,
                error: e
            });
        });
    });

module.exports = router;
