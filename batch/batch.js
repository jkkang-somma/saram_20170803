// var exec = require('child_process').exec;
// var db = require('../lib/dbmanager.js');
// var moment = require('moment');
// var debug = require("debug")("DBBatchJob");
// var DBBatchJobExecuter = function(){
// };

// DBBatchJobExecuter.prototype.DbBackup = function(){
//     debug("DB Schedule Start : " + moment().format("YYYYMMDD_HH:mm:ss SSS"));
//     var dbinfo = db.getDbInfo();
//     var filename = moment().format("YYYYMMDD_HHmmss") + ".sql";
//     var cmd = "mysqldump -u"+dbinfo.user+" -p"+dbinfo.password+ " " + dbinfo.database +" > " + filename;

//     debug(cmd);
    
//     exec(cmd, function(error,stdout,stderr){
//         console.log(stdout);
//         console.log(stderr);
//         if(error!==null){
//             console.log('exec error: ' + error);
//         }
//         debug("DB Schedule End : " + moment().format("YYYYMMDD_HH:mm:ss SSS"));
//     });
// };

// module.exports = new DBBatchJobExecuter();



// // var _ = require("underscore");
// // var Promise = require("bluebird");
// // var debug = require("debug")("DBBatchJob");
// // var createDbArr =[
// //     "dept_code_tbl",
// //     "position_code_tbl",
// //     "members_tbl",
// //     "vacation_tbl",
// //     "commute_base_tbl",
// //     "office_code_tbl",
// //     "overtime_code_tbl",
// //     "work_type_code_tbl",
// //     "approval_tbl",
// //     "out_office_tbl",
// //     "in_office_tbl",
// //     "commute_result_tbl",
// //     "comment_tbl",
// //     "change_history_tbl",
// //     "holiday_tbl",
// //     "approval_index_tbl",
// //     "black_mark_tbl",
// //     "msg_tbl"];

// // var dbArr = [
// //     "members_tbl",
// //     "dept_code_tbl",
// //     "position_code_tbl",
// //     "vacation_tbl",
// //     "commute_base_tbl",
// //     "out_office_tbl",
// //     "in_office_tbl",
// //     "approval_tbl",
// //     "comment_tbl",
// //     "change_history_tbl",
// //     "commute_result_tbl",
// //     "overtime_code_tbl",
// //     "work_type_code_tbl",
// //     "office_code_tbl",
// //     "holiday_tbl",
// //     "approval_index_tbl",
// //     "black_mark_tbl",
// //     "msg_tbl"];


// // var DBBatchJobExecuter = function(){
// //     this.result = {};
// //     this.backup = "";
// //     for(var idx =0; idx < dbArr.length ; idx++){
// //         this.result[dbArr[idx]] = {};  
// //     }
// // };

// // DBBatchJobExecuter.prototype.getTables = function(){
// //     return db.query(null,null,null, 'SHOW TABLES');
// // };

// // DBBatchJobExecuter.prototype.doTableEntries = function(tables){
// //     var that = this;
// //     var tableDefinitionGetters = [];
    
// //     for(var key in tables){
// //         var destTableName = tables[key]['Tables_in_'+db.getDbInfo().database];
// //         tableDefinitionGetters.push(
// //             new Promise(function(resolve,reject){
// //                 var tableName = destTableName;
// //                 db.query(null,null,null,'SHOW CREATE TABLE ' + tableName).then(
// //                     function(createTableQryResult){
// //                         that.result[tableName]["dropQuery"] = "drop table if exists " + tableName +";\n\n";
// //                         that.result[tableName]["createQuery"] = createTableQryResult[0]["Create Table"] + ";\n\n";
// //                         resolve();
// //                     }
// //                 );    
// //             })
            
            
// //         );
        
// //         tableDefinitionGetters.push(
// //             new Promise(function(resolve, reject){
// //                 var tableName = destTableName;
// //                 var queryColumn = "";
// //                 var queryItem = "";
// //                 var query ="";
// //                 db.query(null,null,null,'select * from ' + tableName).then(
// //                     function(result){
// //                         query = "INSERT INTO " + tableName;
                        
// //                         queryColumn = "(";
// //                         for(var i in result[0]){
// //                             if(i != "seq")
// //                                 queryColumn += i + ",";    
// //                         }
// //                         queryColumn = queryColumn.slice(0,-1);
// //                         queryColumn += ") ";
                        
// //                         query += queryColumn;
                        
// //                         query += "VALUES";
                        
// //                         queryItem = "";
// //                         for(var key in result){
// //                             queryItem += "(";
// //                             for(var item in result[key]){
// //                                 if(item != "seq"){
// //                                     if(typeof result[key][item] === "number" || result[key][item] == null){   
// //                                         queryItem += result[key][item] + ",";
// //                                     }else{
// //                                         queryItem += "'"+ result[key][item] + "',";
// //                                     }
// //                                 }
// //                             }
// //                             queryItem = queryItem.slice(0,-1);
// //                             queryItem += "),\n";
// //                         }
// //                         if(queryItem != ""){
// //                             queryItem = queryItem.slice(0,-1);
// //                             queryItem += ";\n\n";
// //                             query += queryItem;
// //                             that.result[tableName]["insertQuery"] = query;
// //                         }
// //                         resolve();
// //                     }
// //                 );
// //             })
// //         );
// //     }
// //     return tableDefinitionGetters;
// // };

// // DBBatchJobExecuter.prototype.saveFile = function(){
// //     var filename = moment().format("YYYYMMDD_HHmmss") + ".sql";
// //     for(var i in dbArr){
// //         if(!_.isUndefined(this.result[dbArr[i]].dropQuery)){
// //             this.backup += this.result[dbArr[i]].dropQuery;    
// //         }
// //     }
    
// //     for(var j in createDbArr){
// //         if(!_.isUndefined(this.result[createDbArr[j]].createQuery)){
// //             this.backup += this.result[createDbArr[j]].createQuery;
// //         }
// //     }
    
// //     for(var k in createDbArr){
// //         if(!_.isUndefined(this.result[dbArr[k]].insertQuery)){
// //             this.backup += this.result[dbArr[k]].insertQuery;
// //         }
// //     }
    
// //     return require('fs').writeFile(filename, this.backup);
// // };

// // DBBatchJobExecuter.prototype.backupDb = function(){
// //     var that = this;
// //     debug("DB Schedule Start :" + moment().format("YYYYMMDD_HH:mm:ss SSS"));
    
// //     db.pool.getConnectionAsync().then(function(connection){
// //         debug("Get Connection!!");
// //         debug(connection);
// //         that.getTables().then(function(result){
// //             Promise.all(that.doTableEntries(result)).then(function(){
// //                 that.saveFile();
// //                 debug("DB Schedule End :" + moment().format("YYYYMMDD_HH:mm:ss SSS"));      
// //             });
// //         }).catch( function(err) {
// //             debug('Something went away', err);
// //         }).finally( function() {
// //             connection.release();
// //         });    
// //     });
// // };

// // module.exports = new DBBatchJobExecuter();