var express = require('express');
var router = express.Router();
var _ = require("underscore"); 
var DocumentList = require('../service/DocumentList.js');
var path = require("path");
var fs = require("fs");

router.route('/')
.get(function(req, res){
    if(_.isUndefined(req.query.file)){
    	DocumentList.getFileList().then(function(result){
    		res.send(result);
        });
    }else{
    	console.log("filename : " + req.query.file);
    	DocumentList.getFilePath(req.query.file).then(function(result){
    		res.download(path.resolve(result), req.query.file);
        });
    }
})
.post(function(req,res){
	DocumentList.fileUpload(req.files["files[]"]).then(function(result){
        res.end();
    });
})
.delete(function(req,res){
  if(req.body.id){
	  DocumentList.deleteFile(req.body.id).then(function(result){
          res.send();
          console.log(result);
      });
  }
});

module.exports = router;
