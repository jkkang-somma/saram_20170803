// Author: 안정길 
// Create Date: 2014.12.18
var xml_digester = require("xml-digester");
var _ = require("underscore"); 
var Promise = require('bluebird');
var mysql=Promise.promisifyAll(require('mysql'));
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);
var fs = Promise.promisifyAll(require("fs"));
var debug = require('debug')('DBManager');

var path = require("path");
var digester = xml_digester.XmlDigester({});
var DBManager = function () {
    var db=this;
    db.dbInfo = {
        host: '10.0.0.1',
        user: 'goodguy95',
        password : 'yescnc113',
        port : 3306,
	database :'goodguy95'
        
        //host: '210.220.205.57',
        //user: 'yes',
        //password : 'yescnc1234',
        //port : 3307,
        //database:'yes'
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

DBManager.prototype.queryTransaction = function(connection, queryStr, dataObj, schemaArr){
    return new Promise(
        function(resolve, reject){// promise patten
            connection.beginTransactionAsync().then(function(){
                var promiseArr = [];
                debug("DB Transaction Begin!");
                for(var idx in dataObj){
                    var data = dataObj[idx];
                    var dataArr = [];
                    for(var i = 0; i < schemaArr.length; i++){
                        var key = schemaArr[i];
                        dataArr.push(data[key]);
                    }
                    promiseArr.push(connection.queryAsync(queryStr, dataArr).then(
                        function(result){
                            debug("Query : " + queryStr);
                            debug("Data : " + dataArr);
                            debug(result);
                        }, function(err){
                            debug("DB Query ERROR:"+err.message);
                            throw err;
                        })
                    );
                }
                resolve(promiseArr);
            }).catch(function(e){
                debug("Transaction ERROR:"+e.message);
                reject(e);
            });
        }
    ); 
};

DBManager.prototype.queryV2 = function(queryStr, keyArr){
    var db=this;
    if(keyArr===""||keyArr===undefined||keyArr==="undefined"||keyArr===null||keyArr==="null"){
        return new Promise(
            function(resolve, reject){// promise patten
                db.pool.getConnectionAsync().then(function(connection){ //Connection Success
					debug("Success get DB Connection");
					connection.queryAsync(queryStr).then(function(data){//Query Success
						debug(queryStr);
						var resultArr=data[0];
						connection.release();
						resolve(resultArr);     
						
					})
					.catch(function(e){//Query Error
						debug("Query ERROR:" + e);
						connection.release();
						reject(e);
					});
			
						
				})
				.catch(function(e){//Connection Error
				   debug("Connection ERROR:"+e.message);
				   reject(e);
				});            
			}); 
    }else{
        return new Promise(function(resolve, reject){// promise patten
            db.pool.getConnectionAsync().then(function(connection){//Connection Success
                connection.queryAsync(queryStr, keyArr).then(function(data){//Query Success
                    debug(queryStr + " ["+keyArr+"]");
                    var resultArr=data[0];
                    resolve(resultArr);     
                    connection.release();
                }).catch(function(e){//Query Error
                    debug("Query ERROR: + e");
					gc(true);
                    connection.release();
                    reject(e);
                });
            }).catch(function(e){//Connection Error
               debug("Connection ERROR:"+e.message);
               reject(e);
            });
        });    
    }
};

/**
 * 여러개의 데이터를 insert 할 경우
 * return {
 * 	result: "success",	// success / fail
 *  totalCount: datas.length,
 *  successCount: datas.length,
 *  failCount: 0,
 *  error: ""
 * }
 * 
 */
DBManager.prototype.insertQuerys = function(query, datas){
    var db = this,
    	queryResults = [],
    	querySuccessCount = 0,
    	queryResult = {
    		result: "success",	// success / fail
    		totalCount: datas.length,
    		successCount: datas.length,
    		failCount: 0,
    		error: ""
    	};
    
    return new Promise(function(resolve, reject){// promise patten
        db.pool.getConnectionAsync().then(function(connection){//Connection Success
        	for (var i = 0, len = datas.length; i < len; i++) {
        		queryResults.push(executeQuery(connection, query, datas[i]));
        	}
        	
            Promise.all(queryResults).then(function(result){
            	resolve(queryResult);
            }).catch(function(e) {
            	queryResult.result = "fail";
            	queryResult.successCount = querySuccessCount;
            	queryResult.failCount = queryResult.totalCount - querySuccessCount;
            	queryResult.error = e;
            	
            	reject(queryResult);
            }).finally(function() {
            	connection.release();
            });
        }); //Connection Success
    });
    
    // SQL 실행
    function executeQuery(connection, query, data) {
    	return new Promise(function(resolve, reject){
    		connection.queryAsync(query, data).then(function(result) {
    			querySuccessCount++;
    			resolve(result);
    		}).catch(function(e) {
    			reject(e);
		  });  
	  });
    }
};

module.exports = new DBManager();

