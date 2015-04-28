var _ = require("underscore"); 
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var path = require("path");
var picPath = path.dirname(module.parent.filename) + "/../pic/files";

var UserPic = function () {
    var _getFileList = function () {
        return new Promise(
            function(resolve,reject){
                fs.readdirAsync(picPath).then(function(files){
                    files = _.reject(files, function(file){
                        return file == "default.jpg";
                    });
                    console.log(files);
                    resolve(files);
                }).catch(function(err){
                    throw(err);
                });
            }
        );
    };
    var _getFilePath = function(id){
        var filePath = picPath + "/" + id + ".jpg";
        return new Promise(
            function(resolve, reject){
                fs.exists(filePath, function(isExist){
                    if(isExist){
                        resolve(filePath);
                    }else{
                        resolve(picPath + "/../default.jpg");
                    }
                });
            }
        );
    };
    
    var _deleteFile = function(id){
        var filePath = picPath + "/" + id + ".jpg";
        return new Promise(
            function(resolve,reject){
                fs.exists(filePath, function(isExist){
                    if(isExist){
                        fs.unlink(filePath, function(){
                           resolve(id); 
                        });
                    }  else {
                        resolve(id);
                    }
                });
            }  
        );
    };
    var _fileUpload = function(file){
        return new Promise(
            function(resolve,reject){
                resolve();
            }
        );
    };
    return {
        getFileList : _getFileList,
        getFilePath : _getFilePath,
        deleteFile : _deleteFile,
        fileUpload : _fileUpload
    };
};

module.exports = new UserPic();

