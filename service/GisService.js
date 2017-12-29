var _ = require("underscore"); 
var debug = require('debug')('GisService');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var path = require("path");
var picPath = path.dirname(module.parent.filename) + "/../gis_history";

var GisService = function (data) {

    var _getGisHistory = function(){
        return new Promise(
            function(resolve,reject){
                fs.readdirAsync(picPath).then(function(files){
                    console.log(files);
                    resolve(files);
                }).catch(function(err){
                    throw(err);
                });
            }
        );
    };

    var _getGisHistoryPicPath = function(filename) {
        return picPath + "/" + filename;
    };

    var _saveGisHistory = function(data){
        return new Promise(
            function(resolve,reject){
                var newData = new Date();
                var filename = picPath + "/" + newData.format('yyyy-MM-dd') + ".png";
                var img = data.replace(/^data:image\/\w+;base64,/, "");
                var buf = new Buffer(img, 'base64');
                fs.writeFile(filename, buf);
                resolve(true);
            }
        );
    };

    var _deleteGisHistory = function(filename){
        var filePath = picPath + "/" + filename;
        return new Promise(
            function(resolve,reject){
                fs.exists(filePath, function(isExist){
                    if(isExist){
                        fs.unlink(filePath, function(){
                           resolve(filename); 
                        });
                    }  else {
                        resolve(filename);
                    }
                });
            }  
        );
    };
    
    return {
        getGisHistory : _getGisHistory,
        getGisHistoryPicPath : _getGisHistoryPicPath,
        saveGisHistory : _saveGisHistory, 
        deleteGisHistory : _deleteGisHistory
    };

};

module.exports = GisService;
