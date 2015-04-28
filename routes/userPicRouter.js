var express = require('express');
var router = express.Router();
var _ = require("underscore"); 
var UserPic = require('../service/UserPic.js');
var path = require("path");
router.route('/')
.get(function(req, res){
    if(_.isUndefined(req.query.file)){
        UserPic.getFileList().then(function(result){
            res.send(result);
        });
    }else{
        UserPic.getFilePath(req.query.file).then(function(result){
            res.sendFile(path.resolve(result));
        });
    }
})
.post(function(req,res){
    UserPic.fileUpload(req.files["files[]"]).then(function(result){
        res.end();
    });
})
.delete(function(req,res){
  if(req.body.id){
      UserPic.deleteFile(req.body.id).then(function(result){
          res.send();
      });
  }
});

module.exports = router;
