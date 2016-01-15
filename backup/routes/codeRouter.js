// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12

var express = require('express');
var _ = require("underscore"); 
var debug = require('debug')('code');
var router = express.Router();
var Code = require('../service/Code.js');

//코드 목록  코드 테이블 관리시 ... 사용 현제 x
router.route('/list')
.get(function(req, res) {
    res.send({});
});

//코드 조건 목록
router.route('/list/:category')
.get(function(req, res) {
    var _category=req.param("category");
    if (_.isUndefined(_category) || _.isEmpty(_category)){
        res.status(500);
        res.send({
            success:false,
            message: "Category is null.",
            error:{}
        });
    }
    
    var code = new Code({category:_category});
    code.getCodeList().then(function(result){
        res.send(result);    
    }).catch(function(e){
        debug("Error Select Code List.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});


module.exports = router;
