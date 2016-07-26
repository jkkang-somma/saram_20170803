var _ = require("underscore"); 
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var path = require("path");
var docPath = path.dirname(module.parent.filename) + "/../public/doc";

var DocumentList = function () {
    var _getFileList = function () {
        return new Promise(
            function(resolve,reject){
                fs.readdirAsync(docPath).then(function(files){
                    files = _.reject(files, function(file){
                        return file == "";
                    });
                    var i =0;
                    FilesName =[];
                    for(i=0;i<files.length;i++){
                    	FilesName[i] = {filename : files[i]};
                    }
                    resolve(FilesName);
                }).catch(function(err){
                    throw(err);
                });
            }
        );
    };
    var _getFilePath = function(id){
        var filePath = docPath + "/" + id;
        return new Promise(
            function(resolve, reject){
                fs.exists(filePath, function(isExist){
                    if(isExist){
                        resolve(filePath);
                    }
                });
            }
        );
    };
    
    var _deleteFile = function(id){
        var filePath = docPath + "/" + id;
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
                console.log(file);
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

module.exports = new DocumentList();

