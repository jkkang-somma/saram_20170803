var express = require('express');
var debug = require('debug')('gisRouter');
var router = express.Router();
var _ = require("underscore"); 
var path = require("path");
var GisService = require('../service/GisService.js');


// 자리 이력 정보 조회
router.route('/GisHistory')
.get(function(req, res){
    var gisService = new GisService();
    gisService.getGisHistory().then(function(result){
        res.send(result);
    }).catch(function(e){
        debug("Error get GIS History.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});

// 사진 전송
router.route('/GisHistoryImg')
.get(function(req, res){
    if(_.isUndefined(req.query.file)){
        res.status(400);
        res.send({
            success:false,
            message:'parameter miss'
        })
    }
    var gisService = new GisService();

    var imgPath = gisService.getGisHistoryPicPath(req.query.file);
    res.sendFile(path.resolve(imgPath));
});

// 자리 이력 정보 추가
router.route('/GisHistory')
.post(function(req, res){
    var gisService = new GisService();
    gisService.saveGisHistory(req.body.data).then(function(result){
        res.send(result);
    });
});

// 자리 이력 정보 삭제
router.route('/GisHistory')
.delete(function(req, res){
    var gisService = new GisService();
    gisService.deleteGisHistory(req.body.id).then(function(result){
        res.send(result);
    }).catch(function(e){
        debug("Error delete GIS History.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});

module.exports = router;
