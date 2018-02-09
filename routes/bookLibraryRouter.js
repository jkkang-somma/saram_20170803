var express = require('express');
var debug = require('debug')('bookLibraryRouter');
var router = express.Router();
var _ = require("underscore");
var BookLibrary = require('../service/BookLibrary.js');
var sessionManager = require('../lib/sessionManager');

//라이브러리 조회
router.route('/library')
    .get(function(req, res) {
        BookLibrary.getBookLibrary().then(function(result) {
            debug("Complete Select Book Library");
            res.send(result);
        }).catch(function(e) {
            debug("Error Select Book Library");
            res.status(500);
            res.send({
                success: false,
                message: e.message,
                error: e
            });
        });
    }).post(function(req, res) { //등록
        var data = req.body;
        BookLibrary.insertBookLibrary(data).then(function(result) {
            debug("isnert book success");
            res.send(result);
        }).catch(function(e) {
            debug(e);
        });
    }).put(function(req, res) { //삭제
        var data = req.body;
        console.log(data);
        BookLibrary.deleteBookLibrary(data).then(function(result) {
            debug("delete book success");
            res.send(result);
        }).catch(function(e) {
            debug(e);
        });
    });

//이력 조회
router.route('/history')
    .get(function(req, res) {
        var data = req.query;
        BookLibrary.selectRentHistory(data).then(function(result) {
            debug("Complete Select Rent history");
            res.send(result);
        }).catch(function(e) {
            debug("Error Select Rent history");
            res.status(500);
            res.send({
                success: false,
                message: e.message,
                error: e
            });
        });
    });

//대출, 반납
router.route('/rent')
    .get(function(req, res) {

    }).post(function(req, res) { //대출
        var session = sessionManager.get(req.cookies.saram);
        var data = req.body;
        data.user_id = session.user.id; // SessionUser

        BookLibrary.insertRentBook(data).then(function(result) {
            debug("insert rent success");
            BookLibrary.insertRentHistory(data).then(function(result) {
                debug("insert history suecces");
                res.send(result);
            }).catch(function(err) {
                debug(err);
            });
        }).catch(function(e) {
            debug(e);
        });

    }).put(function(req, res) { //반납
        var session = sessionManager.get(req.cookies.saram);
        var data = req.body;
        data.user_id = session.user.id;
        
        console.log(data);

        BookLibrary.deleteRentBook(data).then(function(result) {
            debug("return book success");
            BookLibrary.insertRentHistory(data).then(function(result) {
                debug("insert history success");
                res.send(result);
            }).catch(function(err) {
                debug(err);
            });
        }).catch(function(e) {
            debug(e);
        });
    });


//naver 조회
router.route('/regist')
    .get(function(req, res) {
        var data = req.query;
        BookLibrary.getRegistSearch(data).then(function(result) {
            debug("Complete Regist search");
            res.send(result);
        }).catch(function(e) {
            debug("Error Select Regist search");
            res.status(500);
            res.send({
                success: false,
                message: e.message,
                error: e
            });
        });
    });

//등록시 ManageNo 조회
router.route('/manageno')
    .get(function(req, res) {
        var data = req.query;
        BookLibrary.getManageNo(data).then(function(result) {
            debug("Complete Get Manage Number");
            res.send(result);
        }).catch(function(e) {
            debug("Error Get Manage Number");
            res.status(500);
            res.send({
                success: false,
                message: e.message,
                error: e
            });
        })
    })

module.exports = router;
