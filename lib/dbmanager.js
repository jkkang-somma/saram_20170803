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
    var pool = mysql.createPool({
    //   host: '210.220.205.57',
    //   user: 'yes',
    //   password : 'yescnc1234',
    //   port : 3307,
    //   database:'yescnc_db'
    	  
    //  host: '210.220.205.24',
    //  user: 'root',
    //  password : 'admin',
    //  port : 3306,
    //  database:'mydb'
    	  
        //  host: 'localhost',
        //  user: 'sangheepark',
        //  password : '',
        //  port : 3306,
        //  database:'c9'

        host: 'localhost',
        user: 'carran',
        password : '',
        port : 3306,
        database:'c9'

        // host: 'localhost',
        //  user: 'ronanhyoung',
        //  password : '',
        //  port : 3306,
        //  database:'c9'
    });
    db.pool=pool;
    
    fs.readFileAsync(path.dirname(module.parent.filename) + "/../xml/query.xml","utf8").then(function (data) {
        digester.digest(data, function(err, result) {
            if (err) { 
                debug(err);
            } else {
                for(var i = 0; i < result.querys.group.length; i++){
                    db.querys[result.querys.group[i].id] = result.querys.group[i].query;
                    debug(result.querys.group[i].id);
                    debug(result.querys.group[i].query);
                }
            }
        });
    }).catch(SyntaxError, function (e) {
        debug("file contains invalid file");
    }).error(function (e) {
        debug("unable to read file, because: ", e.message);
    });
}
DBManager.prototype.querys = [];
DBManager.prototype.getQuery = function(groupid, id){
    var groupitem = this.querys[groupid];
    for(var i = 0; i< groupitem.length ; i++){
        var item = groupitem[i]
        if(item.id == id){
            return item._text;
        }
    }
    throw new Error('Can not find Query');
}

DBManager.prototype.query = function(queryStr){
    var db=this;
    debug(queryStr);
    return new Promise(function(resolve, reject){// promise patten
        db.pool.getConnectionAsync().then(function(connection){//Connection Success
            connection.queryAsync(queryStr).then(function(data){//Query Success
                var resultArr=data[0];
                resolve(resultArr);     
                connection.release();
            }).catch(function(e){//Query Error
                debug("Query ERROR:"+e.message);
                connection.release();
                reject(e);
            });
        }).catch(function(e){//Connection Error
           debug("Connection ERROR:"+e.message);
           reject(e);
        });
    });
};

DBManager.prototype.query = function(queryStr){
    var db=this;
    debug(queryStr);
    return new Promise(function(resolve, reject){// promise patten
        db.pool.getConnectionAsync().then(function(connection){//Connection Success
            connection.queryAsync(queryStr).then(function(data){//Query Success
                var resultArr=data[0];
                resolve(resultArr);     
                connection.release();
            }).catch(function(e){//Query Error
                debug("Query ERROR:"+e.message);
                connection.release();
                reject(e);
            });
        }).catch(function(e){//Connection Error
           debug("Connection ERROR:"+e.message);
           reject(e);
        });
    });
};

DBManager.prototype.queryV2 = function(queryStr, keyArr){
    var db=this;
    if(keyArr===""||keyArr===undefined||keyArr==="undefined"||keyArr===null||keyArr==="null"){
        debug(queryStr);
        return new Promise(function(resolve, reject){// promise patten
            db.pool.getConnectionAsync().then(function(connection){//Connection Success
                connection.queryAsync(queryStr).then(function(data){//Query Success
                    var resultArr=data[0];
                    resolve(resultArr);     
                    connection.release();
                }).catch(function(e){//Query Error
                    debug("Query ERROR:"+e.message);
                    connection.release();
                    reject(e);
                });
            }).catch(function(e){//Connection Error
               debug("Connection ERROR:"+e.message);
               reject(e);
            });
        }); 
    }else{
        debug(queryStr + " ["+keyArr+"]");
        return new Promise(function(resolve, reject){// promise patten
            db.pool.getConnectionAsync().then(function(connection){//Connection Success
                connection.queryAsync(queryStr, keyArr).then(function(data){//Query Success
                    var resultArr=data[0];
                    resolve(resultArr);     
                    connection.release();
                }).catch(function(e){//Query Error
                    debug("Query ERROR:"+e.message);
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
