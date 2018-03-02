var Promise = require('bluebird');
var excelbuilder = require('msexcel-builder');
var debug = require('debug')('CommuteYearCsvCreater');
var path = require('path');
var fs = require('fs');
var	excelFileDirPath = path.normalize(__dirname + '/../excel/files/');
var csv = require("fast-csv");

var CommuteYearCsvCreater = function () {
    
    var headerInfo = { 
        dept_name : "\ufeff  부서  ",
        part_name : " 파트 ",
        name: " 이름 ",
        position_name :   " 직급 ",
        leave_company :   " 퇴사일  ",

        late1: "지각_1",
        late2: "2", late3: "3", late4: "4", late5: "5", late6: "6", late7: "7", late8: "8", late9: "9", late10: "10", late11: "11", late12: "12", 
        late_total: "합계",

        holi1: "연차_1",
        holi2: "2", holi3: "3", holi4: "4", holi5: "5", holi6: "6", holi7: "7", holi8: "8", holi9: "9", holi10: "10", holi11: "11", holi12: "12", 
        holi_total: "가용",
        holi_remain: "사용",

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

        hwt1: "휴일근무 시간_1", // holiday work time
        hwt2:"2", hwt3:"3", hwt4:"4", hwt5:"5", hwt6:"6", hwt7:"7", hwt8:"8", hwt9:"9", hwt10:"10", hwt11:"11", hwt12:"12",
        hwt_total:"합계",

        pth_1a : "휴일근무 타입_1A",   // pay type holiday
                            pth_1b:"1B",        pth_1c:"1C", 
        pth_2a:"2A",        pth_2b:"2B",        pth_2c:"2C",
        pth_3a:"3A",        pth_3b:"3B",        pth_3c:"3C",
        pth_4a:"4A",        pth_4b:"4B",        pth_4c:"4C",
        pth_5a:"5A",        pth_5b:"5B",        pth_5c:"5C",
        pth_6a:"6A",        pth_6b:"6B",        pth_6c:"6C",
        pth_7a:"7A",        pth_7b:"7B",        pth_7c:"7C",
        pth_8a:"8A",        pth_8b:"8B",        pth_8c:"8C",
        pth_9a:"9A",        pth_9b:"9B",        pth_9c:"9C",
        pth_10a:"10A",      pth_10b:"10B",      pth_10c:"10C",
        pth_11a:"11A",      pth_11b:"11B",      pth_11c:"11C",
        pth_12a:"12A",      pth_12b:"12B",      pth_12c:"12C",
        pth_tot_a:"합계_A",        pth_tot_b:"합계_B",        pth_tot_c:"합계_C",

        hwp1: "휴일근무 타입_1",  // holiday work pay
        hwp2:"2", hwp3:"3", hwp4:"4", hwp5:"5", hwp6:"6", hwp7:"7", hwp8:"8", hwp9:"9", hwp10:"10", hwp11:"11", hwp12:"12",
        hwp_total:"합계"
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
                                // 지각
                                if ( dataIdx == 1 ) {
                                    for ( var pIdx = 1 ; pIdx <= 12 ; pIdx++ ) {
                                        curFR["late"+pIdx] = curR[pIdx];
                                    }
                                    curFR.late_total = curR.total;
                                }

                                // 연차
                                if ( dataIdx == 2 ) {
                                    for ( var pIdx = 1 ; pIdx <= 12 ; pIdx++ ) {
                                        curFR["holi"+pIdx] = curR[pIdx];
                                    }
                                    curFR.holi_total = curR.total_day;
                                    curFR.holi_remain = curR.holiday;
                                }

                                // 평일 잔업 시간
                                if ( dataIdx == 3 ) {
                                    for ( var pIdx = 1 ; pIdx <= 12 ; pIdx++ ) {
                                        curFR["total_ot"+pIdx] = curR[pIdx];
                                    }
                                    curFR.total_ot_total = curR.total;
                                }

                                // 잔업 수당 타입
                                if ( dataIdx == 4 ) {
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
                                if ( dataIdx == 5 ) {
                                    for ( var pIdx = 1 ; pIdx <= 12 ; pIdx++ ) {
                                        curFR["ot_pay_"+pIdx] = curR[pIdx];
                                    }
                                    curFR.ot_pay_total = curR.total;
                                }

                                // 휴일근무 시간
                                if ( dataIdx == 6 ) {
                                    for ( var pIdx = 1 ; pIdx <= 12 ; pIdx++ ) {
                                        curFR["hwt"+pIdx] = curR[pIdx];
                                    }
                                    curFR.hwt_total = curR.total;
                                }

                                // 휴일근무 타입
                                if ( dataIdx == 7 ) {
                                    // pth_1a, ...
                                    for ( var m = 1 ; m <=12 ; m++ ) {
                                        for ( var typeIdx = 0 ; typeIdx < 3 ; typeIdx++ ) {
                                            var param2 = m + abc_arr[typeIdx];
                                            var param1 = 'pth_'+ param2;
                                            curFR[param1] = curR[param2];
                                        }
                                    }
                                    curFR.pth_tot_a = curR.a_total;
                                    curFR.pth_tot_b = curR.b_total;
                                    curFR.pth_tot_c = curR.c_total;
                                }

                                // 휴일근무 수당
                                if ( dataIdx == 8 ) {
                                    for ( var pIdx = 1 ; pIdx <= 12 ; pIdx++ ) {
                                        curFR["hwp"+pIdx] = curR[pIdx];
                                    }
                                    curFR.hwp_total = curR.total;
                                }

                                // 결재 후 평일 잔업시간
                                if ( dataIdx == 9 ) {
                                    curFR.pay_ot1 = curR[1]; curFR.pay_ot2 = curR[2]; curFR.pay_ot3 = curR[3]; curFR.pay_ot4 = curR[4];
                                    curFR.pay_ot5 = curR[5]; curFR.pay_ot6 = curR[6]; curFR.pay_ot7 = curR[7]; curFR.pay_ot8 = curR[8];
                                    curFR.pay_ot9 = curR[9]; curFR.pay_ot10 = curR[10]; curFR.pay_ot11 = curR[11]; curFR.pay_ot12 = curR[12];
                                    curFR.pay_ot_total = curR.total;
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

module.exports = new CommuteYearCsvCreater();