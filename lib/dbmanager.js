
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
        host: 'localhost',
        user: 'sangheePark',
        password : '',
        port : 3306,
        database:'c9'
    });
    db.pool=pool;
    
    fs.readFileAsync(path.dirname(module.parent.filename) + "/../xml/query.xml","utf8").then(function (data) {
        digester.digest(data, function(err, result) {
            if (err) { 
                debug(err);
            } else {
                for(var i = 0; i < result.querys.group.length; i++){
                    db.querys[result.querys.group[i].id] = result.querys.group[i].query;
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
    return new Promise(function(resolve, reject){
        db.pool.getConnectionAsync().then(function(connection){
            connection.queryAsync(queryStr).then(function(data){
                var resultArr=data[0];
                resolve(resultArr);
                connection.release();
            })
        });
    });
};

DBManager.prototype.querys = function(querys){
    var db=this;
    return new Promise(function(resolve, reject){
        db.pool.getConnectionAsync().then(function(connection){
        	
        	connection.beginTransaction(function(err) {
        		if (err) {
        			throw err;
        		}
            	for (var i = 0, len = querys.length; i < len; i++) {
            		connection.query(querys[i]);
            	}
            	connection.commit(function(err) {
            		  if (err) {
                          console.error(err);
                          connection.rollback(function () {
                        	  connection.release();
                        	  resolve("fail");
                        	  console.error('rollback error');
                              throw err;
                          });
                      }
            		  
            		  connection.release();
            		  resolve("success");
            	});
        	});
        });
    });
};
module.exports = new DBManager();

