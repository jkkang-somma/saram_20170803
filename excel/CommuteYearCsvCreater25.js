var Promise = require('bluebird');
var excelbuilder = require('msexcel-builder');
var debug = require('debug')('CommuteYearCsvCreater');
var path = require('path');
var fs = require('fs');
var	excelFileDirPath = path.normalize(__dirname + '/../excel/files/');
var csv = require("fast-csv");

var CommuteYearCsvCreater25 = function () {
    
    var headerInfo = { 
        dept_name : "\ufeff  부서  ",
        part_name : " 파트 ",
        position_name :   " 직급 ",
        name: " 이름 ",
        leave_company :   " 퇴사일  ",

        total_ot1: "평일 잔업시간_1", // over time
        total_ot2: "2", total_ot3: "3", total_ot4: "4", total_ot5: "5", total_ot6: "6", total_ot7: "7", total_ot8: "8", total_ot9: "9", total_ot10: "10", total_ot11: "11", total_ot12: "12", 
        total_ot_total: "합계",

        pay_ot1: "결재 후 평일 잔업시간_1",
        pay_ot2: "2", pay_ot3: "3", pay_ot4: "4", pay_ot5: "5", pay_ot6: "6", pay_ot7: "7", pay_ot8: "8", pay_ot9: "9", pay_ot10: "10", pay_ot11: "11", pay_ot12: "12", 
        pay_ot_total: "합계",

        pt_1a : "잔업수당 타입_1A",   // pay type
                           pt_1b:"1B",        pt_1c:"1C", 
        pt_2a:"2A",        pt_2b:"2B",        pt_2c:"2C",
        pt_3a:"3A",        pt_3b:"3B",        pt_3c:"3C",
        pt_4a:"4A",        pt_4b:"4B",        pt_4c:"4C",
        pt_5a:"5A",        pt_5b:"5B",        pt_5c:"5C",
        pt_6a:"6A",        pt_6b:"6B",        pt_6c:"6C",
        pt_7a:"7A",        pt_7b:"7B",        pt_7c:"7C",
        pt_8a:"8A",        pt_8b:"8B",        pt_8c:"8C",
        pt_9a:"9A",        pt_9b:"9B",        pt_9c:"9C",
        pt_10a:"10A",      pt_10b:"10B",      pt_10c:"10C",
        pt_11a:"11A",      pt_11b:"11B",      pt_11c:"11C",
        pt_12a:"12A",      pt_12b:"12B",      pt_12c:"12C",
        pt_tot_a:"합계_A",  pt_tot_b:"합계_B",  pt_tot_c:"합계_C",

        ot_pay_1: "잔업수당_1",
        ot_pay_2: "2", ot_pay_3: "3", ot_pay_4: "4", ot_pay_5: "5", ot_pay_6: "6", ot_pay_7: "7", ot_pay_8: "8", ot_pay_9: "9", ot_pay_10: "10", ot_pay_11: "11", ot_pay_12: "12", 
        ot_pay_total: "합계",
    };	
    
    var _createCsv = function(searchValObj, datas) {
        return new Promise(function(resolve, reject){// promise patten
            var fileName = "근태자료_"+ searchValObj.startTime + "_" + searchValObj.endTime + "_" +new Date().getTime() + ".csv";
            debug("3. 엑셀 파일 이름 : " + fileName);

            // 파일 폴더 체크 
			if (!fs.existsSync(excelFileDirPath)) {
				try {
					fs.mkdirSync(excelFileDirPath);
				} catch(e) {
					if ( e.code != 'EEXIST' ) {
						debug("Fail create excel file dir");
						throw e;
					}
				}
            }
            
            try {
				var fileFullName = excelFileDirPath +  fileName;			
				var csvStream = csv.createWriteStream({headers: false}),
			    writableStream = fs.createWriteStream(fileFullName, {encoding: "utf8"});
				writableStream.on("finish", function(){
				  debug("DONE!! create csv file : " + fileName);
				  resolve(excelFileDirPath +  fileName);
				});
                
                // 상수 정의
                var abc_arr = ['a', 'b', 'c'];

                // 데이터 가공
                var finalResult = [];
                var users = datas[0];
                if ( searchValObj.isInLeaveWorker ){
                    finalResult = datas[0];
                }else{
                    for ( var usrIdx = 0 ; usrIdx < datas[0].length ; usrIdx++ ) {
                        if (users[usrIdx].leave_company != null && users[usrIdx].leave_company != "") {
                            continue;
                        }
                        finalResult.push(users[usrIdx]);
                    }
                }

                // 데이터 타입별 loop ( 지각 / 연차 / 잔업 / ... )
                for ( var dataIdx = 1 ; dataIdx < datas.length ; dataIdx++ ) {
                    var commuteResults = datas[dataIdx];

                    // 최종 데이터 기준 loop 
                    for (var i = 0 ; i < finalResult.length ; i++ ) {
                        var curFR = finalResult[i];

                        // 데이터 타입별 개인자료 loop
                        for (var j = 0 ; j < commuteResults.length ; j++) {
                            var curR = commuteResults[j];
                            
                            if ( curFR.id == curR.id ) {

                                // 평일 잔업 시간
                                if ( dataIdx == 1 ) {
                                    for ( var pIdx = 1 ; pIdx <= 12 ; pIdx++ ) {
                                        curFR["total_ot"+pIdx] = curR[pIdx];
                                    }
                                    curFR.total_ot_total = curR.total;
                                }

                                // 잔업 수당 타입
                                if ( dataIdx == 2 ) {
                                    // pt_1a, pt_1b, pt_1c, pt_2a ...
                                    for ( var m = 1 ; m <=12 ; m++ ) {
                                        for ( var typeIdx = 0 ; typeIdx < 3 ; typeIdx++ ) {
                                            var param2 = m + abc_arr[typeIdx];
                                            var param1 = 'pt_'+ param2;
                                            curFR[param1] = curR[param2];
                                        }
                                    }
                                    curFR.pt_tot_a = curR.a_total;
                                    curFR.pt_tot_b = curR.b_total;
                                    curFR.pt_tot_c = curR.c_total;
                                }

                                // 잔업 수당 금액
                                if ( dataIdx == 3 ) {
                                    for ( var pIdx = 1 ; pIdx <= 12 ; pIdx++ ) {
                                        curFR["ot_pay"+pIdx] = curR[pIdx];
                                    }
                                    curFR.total_ot_total = curR.total;
                                }

                                break;
                            }
                        }
                    }
                }

                csvStream.pipe(writableStream);
                //title
                csvStream.write( headerInfo );
                
                for ( var i = 0 ; i < finalResult.length ; i++ ) {
                    csvStream.write( finalResult[i] );
                }
				
				csvStream.end();
			} catch (err) {
				reject(err);
			}
        });
    };

    return {
        createCsv: _createCsv
    }
};

module.exports = new CommuteYearCsvCreater25();