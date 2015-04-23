// Author: 안정길 
// Create Date: 2014.12.18
var _ = require("underscore"); 

var Promise = require('bluebird');
var mysql=Promise.promisifyAll(require('mysql'));
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var fs = Promise.promisifyAll(require("fs"));
var digester = require("xml-digester").XmlDigester({});
var debug = require('debug')('DBManager');
var path = require("path");

var DBManager = function () {
    var db=this;
    db.dbInfo = {
         host: '10.0.0.1',
         user: 'goodguy95',
         password : 'yescnc113',
         port : 3306,
	 database :'goodguy95'
        
    };
    
    var pool = mysql.createPool(db.dbInfo);
    db.pool=pool;
    
    fs.readFileAsync(path.dirname(module.parent.filename) + "/../xml/query.xml","utf8").then(function (data) {
        digester.digest(data, function(err, result) {
            if (err) { 
                debug(err);
            } else {
                for(var i = 0; i < result.querys.group.length; i++){
                    db.querys[result.querys.group[i].id] = result.querys.group[i].query;
                }
            }
        });
    }).catch(SyntaxError, function (e) {
        debug("file contains invalid file");
    }).error(function (e) {
        debug("unable to read file, because: ", e.message);
    });
};

DBManager.prototype.querys = [];

DBManager.prototype.getDbInfo = function(){
    return this.dbInfo;
};

DBManager.prototype.getQuery = function(groupid, id){
    var groupitem = this.querys[groupid];
    for(var i = 0; i< groupitem.length ; i++){
        var item = groupitem[i];
        if(item.id == id){
            return item._text;
        }
    }
    throw new Error('Can not find Query');
};

DBManager.prototype.getConnection = function(){
    var db= this;
    return new Promise(
        function(resolve, reject){
            db.pool.getConnectionAsync().then(function(connection){
                resolve(connection);
            }).catch(function(e){
                debug("Connection ERROR:"+e.message);
                throw e;
            });
        }
    );
        
};

DBManager.prototype.queryTransaction = function(connection, queryGroup, queryItem, dataObj, schemaArr){
    debug("DB Transaction Begin!");
    var db = this;
    var queryStr = db.getQuery(queryGroup, queryItem);

    debug("Query Group : " + queryGroup);
    debug("Query Item : " + queryItem);
    debug("Data Length : " + dataObj.length +"");
    
    return new Promise(
        function(resolve, reject){// promise patten
            connection.beginTransactionAsync().then(function(){
                var promiseArr = [];
                for(var idx in dataObj){
                    var data = dataObj[idx];
                    var dataArr = [];
                    for(var i = 0; i < schemaArr.length; i++){
                        var key = schemaArr[i];
                        dataArr.push(data[key]);
                    }
                    promiseArr.push(connection.queryAsync(queryStr, dataArr));
                }
                resolve(promiseArr);
            }).catch(function(e){
                debug("Transaction ERROR:"+e.message);
                reject(e);
            });
        }
    ); 
};

DBManager.prototype.query = function(queryGroup, queryItem, keyArr, queryStr){
    var db = this;
    var logFlag = false;
    if(_.isUndefined(queryStr) || _.isNull(queryStr)){
        queryStr = db.getQuery(queryGroup, queryItem);
        logFlag = true;
    }
    
    if(_.isUndefined(keyArr) || _.isNull(keyArr)){
        keyArr = [];
    }
    
    return new Promise(function(resolve, reject){// promise patten
        db.pool.getConnectionAsync().then(function(connection){//Connection Success
            connection.queryAsync(queryStr, keyArr).then(function(data){//Query Success
                var resultArr=data[0];
                if(logFlag){
                    debug("Query Group : " + queryGroup);
                    debug("Query Item : " + queryItem);
                    debug("Key : [" + keyArr +"]");
                    debug("Query Result : " + resultArr.length);
                }
                resolve(resultArr);     
            }).catch(function(e){//Query Error
                debug("Query ERROR: " + e);
                reject(e);
            }).finally(function(){
                connection.release();
            });
        }).catch(function(e){//Connection Error
           debug("Connection ERROR:"+e.message);
           reject(e);
        });
    });    
};

module.exports = new DBManager();

