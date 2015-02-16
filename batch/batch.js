var db = require('../lib/dbmanager.js');
var moment = require('moment');
var _ = require("underscore");
var Promise = require("bluebird");
// var debug = require('debug')('BatchJob');
// var exec = require('exec');

var DBBatchJobExecuter = function(){
    this.insertQuery = "";  
    this.createQuery = "";
    this.dropQuery = "";
};

DBBatchJobExecuter.prototype.getTables = function(){
    return db.queryV2('SHOW TABLES');
};

DBBatchJobExecuter.prototype.doTableEntries = function(theResults){
    var that = this;
    var tables = theResults;
    var tableDefinitionGetters = [];
    
    for(var key in tables){
        var destTableName = tables[key]['Tables_in_'+db.getDbInfo().database];
        tableDefinitionGetters.push(
            new Promise(function(resolve,reject){
                var tableName = destTableName;
                db.queryV2('SHOW CREATE TABLE ' + tableName).then(
                    function(createTableQryResult){
                        that.dropQuery += "DROP TABLE IF EXISTS " + tableName + ";\n\n";
                        that.createQuery += createTableQryResult[0]["Create Table"] + ";\n\n";
                        resolve();
                    }
                );    
            })
            
            
        );
        
        tableDefinitionGetters.push(
            new Promise(function(resolve, reject){
                var tableName = destTableName;
                var queryColumn = "";
                var queryItem = "";
                var query =""
                db.queryV2('select * from ' + tableName).then(
                    function(result){
                        query = "INSERT INTO " + tableName;
                        
                        queryColumn = "(";
                        for(var i in result[0]){
                            if(i != "seq")
                                queryColumn += i + ",";    
                        }
                        queryColumn = queryColumn.slice(0,-1);
                        queryColumn += ") ";
                        
                        query += queryColumn;
                        
                        query += "VALUES";
                        
                        queryItem = "";
                        for(var key in result){
                            queryItem += "(";
                            for(var item in result[key]){
                                if(item != "seq"){
                                    if(typeof result[key][item] === "number" || result[key][item] == null){   
                                        queryItem += result[key][item] + ",";
                                    }else{
                                        queryItem += "'"+ result[key][item] + "',";
                                    }
                                }
                            }
                            queryItem = queryItem.slice(0,-1);
                            queryItem += "),";
                        }
                        if(queryItem != ""){
                            queryItem = queryItem.slice(0,-1);
                            queryItem += ";\n\n";
                            query += queryItem;
                            that.insertQuery += query;
                        }
                        resolve();
                    }
                );
            })
        );
    }
    return tableDefinitionGetters;
};

DBBatchJobExecuter.prototype.saveFile = function(){
    var filename = moment().format("YYYYMMDD_HHmmss") + ".sql";
    this.backup = this.dropQuery + this.createQuery + this.insertQuery;
    return require('fs').writeFile(filename, this.backup);
};

DBBatchJobExecuter.prototype.backupDb = function(){
    var that = this;
    console.log("DB Schedule Start :" + moment().format("YYYYMMDD_HH:mm:ss SSS"));
    
    db.getConnection().then(function(connection){
        that.getTables().then(function(result){
            Promise.all(that.doTableEntries(result)).then(function(){
              that.saveFile();
            });
        }).catch( function(err) {
            console.log('Something went away', err);
        }).finally( function() {
            connection.release();
            console.log("DB Schedule End :" + moment().format("YYYYMMDD_HH:mm:ss SSS"));
        });    
    });
};

module.exports = new DBBatchJobExecuter();




// var DBBatchJobExecuter = function(){
    
// };

// DBBatchJobExecuter.prototype.backupDb = function(){
//     var dbInfo = db.getDbInfo();
//     var filename = moment().format("YYYYMMDD_HHmmss") + ".sql";    
//     var command = ['mysqldump'];
    
//     if(dbInfo.user != "" || _.isNull(dbInfo.user) || _.isUndefined(dbInfo.user)){
//         command += " -u " + dbInfo.user;
//     }else {
//         return;
//     }
    
//     if(dbInfo.password != "" || _.isNull(dbInfo.password) || _.isUndefined(dbInfo.password)){
//         command += " -p " + dbInfo.password;
//     }

//     if(dbInfo.host != "" || _.isNull(dbInfo.host) || _.isUndefined(dbInfo.host)){
//         command += " -h " + dbInfo.host;
//     }
    
//     if(dbInfo.port != "" || _.isNull(dbInfo.port) || _.isUndefined(dbInfo.port)){
//         command += " -P "+ dbInfo.port;
//     }
    
//     if(dbInfo.database != "" || _.isNull(dbInfo.database) || _.isUndefined(dbInfo.database)){
//         command += " "+ dbInfo.database;
//     }
    
    
//     command += " > " + filename;
    
//     console.log(command)
//     exec(command, function(err,out,code){
//         if(err)
//             throw err;
            
//         process.stderr.write(err);
//         process.stderr.write(out);
//         console.log(code);   
//     });
// };