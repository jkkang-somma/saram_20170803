var Promise = require('bluebird');
var debug = require('debug')('CommuteResultExcelCreater');
var excelbuilder = require('msexcel-builder');
var path = require('path');
var fs = require('fs');
var	excelFileDirPath = path.normalize(__dirname + '/../excel/files/');
var csv = require("fast-csv");

var CommuteYearExcelCreater = function () {
//	var colInfos = [
//	    	 		{ col: "dept_name" ,		name: "  부서  ", 			width: 13},
//	    	 		{ col: "name" , 			name: " 이름 ", 			width: 13},
//	    	 		{ col: "position_name", 	name:   " 직급 ", 		width: 13},
//	    	 		{ col: "leave_company", 	name:   " 퇴사일  ", 		width: 13},
//	    	 		{ col: "date",				name: " 일자 ", 			width: 19},
//	    	 		{ col: "standard_in_time", 	name: " 출근 기준시각 ", 		width: 19},
//	    	 		{ col: "standard_out_time", name: " 퇴근 기준 시각 ", 	width: 19},
//	    	 		{ col: "in_time", 			name: " 출근 시각 ", 		width: 19},
//	    	 		{ col: "out_time", 			name: " 퇴근 시각 ", 		width: 19},
//	    	 		{ col: "in_time_type_name", 	name: " 출근시간 구분  ", 	width: 13},
//	    	 		{ col: "out_time_type_name", 	name: " 퇴근시간 구분  ", 	width: 13},
//	    	 		{ col: "work_type_name", 		name: " 근무 형태 ", 		width: 13},
//	    	 		{ col: "vacation_name", 	name: " 휴가정보  ", 		width: 11},
//	    	 		{ col: "out_office_name", 	name: " 외근, 출장 정보  ", 	width: 17},
//	    	 		{ col: "overtime_name", 	name: " 야근수당 정보  ", 	width: 17},
//	    	 		{ col: "late_time", 		name: " 지각 시간 ( 분 ) ", 	width: 17},
//	    	 		{ col: "over_time", 		name: " 초과근무 시간 ( 분 ) ", width: 17},
//	    	 		{ col: "in_time_change", 	name: " 출근시간 수정 Count ", width: 17},
//	    	 		{ col: "out_time_change", 	name: " 퇴근시간 수정 Count ", width: 17},
//	    	 		{ col: "comment_count", 	name: " Comment Count ", width: 17},
//	    	 		{ col: "overtime_code_change", name: " 초과근무 수정 Count ", width: 17},
//	    	 		{ col: "early_time", 		name: " 조기 출근 ( 분 ) ", 		width: 17},
//	    	 		{ col: "not_pay_over_time", name: " 야간 근무 (분) ", 		width: 17}
//	    	 ];

	// \ufeff -> BOM 설정 
	var headerInfo = { dept_name : "\ufeff  부서  ",
	    	 		 name: " 이름 ",
	    	 		position_name :   " 직급 ",
	    	 		leave_company :   " 퇴사일  ",
	    	 		date : " 일자 ",
	    	 		standard_in_time : " 출근 기준시각 ",
	    	 		standard_out_time : " 퇴근 기준 시각 ",
	    	 		in_time : " 출근 시각 ",
	    	 		out_time : " 퇴근 시각 ",
	    	 		in_time_type_name : " 출근시간 구분  ",
	    	 		out_time_type_name : " 퇴근시간 구분  ",
	    	 		work_type_name : " 근무 형태 ",
	    	 		vacation_name : " 휴가정보  ",
	    	 		out_office_name : " 외근, 출장 정보  ",
	    	 		overtime_name : " 야근수당 정보  ",
	    	 		late_time : " 지각 시간 ( 분 ) ",
	    	 		over_time : " 초과근무 시간 ( 분 ) ",
	    	 		in_time_change : " 출근시간 수정 Count ",
	    	 		out_time_change : " 퇴근시간 수정 Count ",
	    	 		comment_count : " Comment Count ",
	    	 		overtime_code_change : " 초과근무 수정 Count ",
	    	 		early_time : " 조기 출근 ( 분 ) ",
	    	 		not_pay_over_time : " 야간 근무 (분) "
	};	
	
	// function _createExcelTitle(sheet, searchValObj) {
	// 	_setBaseCell(sheet, 1, 1, " 검색기간 ");

	// 	sheet.merge({col:2, row:1},{col:4, row:1});
	// 	_setBaseCell(sheet, 2, 1, (searchValObj.startTime + " ~ " + searchValObj.endTime) );

	// 	for (var i = 0, len = colInfos.length; i < len; i++) {
	// 		_setTitleCell(sheet, i+1, 3, colInfos[i].name, colInfos[i].width)
	// 	}
		
	// }

	// /**
	//  * 엑셀 데이터 생성
	//  * 레포트 사용자 리스트와 각 통계 리스트의 정렬 순서는 동일해야함
	//  */
	// function _createExcelData(sheet, searchValObj, datas){
		
	// 	var commuteResults = datas[0],
	// 		currentRow = 3;
		
	// 	debug("3-1. 엑셀 데이터  길이 :  " + commuteResults.length);
	// 	for (var i = 0, len = commuteResults.length; i < len; i++) {
	// 		var commuteResult = commuteResults[i];
			
	// 		if ( !searchValObj.isInLeaveWorker ){
	// 			if (commuteResult.leave_company != null && commuteResult.leave_company != "") {
	// 				continue;
	// 			}
	// 		}
			
	// 		debug("3-2. 엑셀 데이터 생성  중:  " + i);
			
	// 		currentRow++;
			
	// 		for (var k =  0, kLen = colInfos.length; k < kLen; k++) {
	// 			_setDataCell(sheet, k + 1, currentRow, commuteResult[colInfos[k].col] );
	// 		}
	// 	}
	// }

	// function _setBaseCell(sheet, col, row, value) {
	// 	sheet.set(col, row, value);
	// 	sheet.valign(col, row, 'center');
	// 	sheet.align(col, row, 'center');	
	// }
	
	// function _setTitleCell(sheet, col, row, value, width) {
	// 	_setBaseCell(sheet, col, row, value);
	// 	sheet.border(col, row, {left:'medium',top:'medium',right:'medium',bottom:'medium'});		
	// 	sheet.width(col, width);	
	// }
	
	// function _setDataCell(sheet, col, row, value) {
	// 	_setBaseCell(sheet, col, row, value);
	// 	sheet.border(col, row, {left:'thin',top:'thin',right:'thin',bottom:'thin'});		
	// }
	
	var _createExcel = function(searchValObj, datas) {
		return new Promise(function(resolve, reject){// promise patten
			//var fileName = "CommuteResultTbl_"+ searchValObj.startTime + "_" + searchValObj.endTime + "_" +new Date().getTime() + ".xlsx";
			//var workbook = excelbuilder.createWorkbook(excelFileDirPath, fileName);
			
			var fileName = "CommuteResultTbl_"+ searchValObj.startTime + "_" + searchValObj.endTime + "_" +new Date().getTime() + ".csv";
			
			debug("1. 엑셀 파일 이름 : " + fileName);
			
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
				
				csvStream.pipe(writableStream);
				
				//title
				csvStream.write( headerInfo );
				
				var commuteResults = datas[0];
				for (var i = 0, len = commuteResults.length; i < len; i++) {
					
					if ( !searchValObj.isInLeaveWorker ){
						if (commuteResults[i].leave_company != null && commuteResults[i].leave_company != "") {
							continue;
						}
					}					
					
					csvStream.write( commuteResults[i] );
				}
				csvStream.end();				
			} catch (err) {
				reject(err);
			}

		
//			if (err) {
//			debug("엑셀 파일 생성 실패  : " + err);
//		    workbook.cancel();
//		  	reject(err);
//		} else {
//			debug("엑셀 파일 생성 성공 ");
//			resolve(excelFileDirPath + fileName);
//		}			

			
//			var excel_col_size = 30;
//			var excel_row_size = datas[0].length + 10;
//			
//			// sheet 기본 크기 
//			var sheet1 = workbook.createSheet('sheet1', excel_col_size, excel_row_size);
//			
//			debug("2. 엑셀 컬럼 생성 ");
//			_createExcelTitle(sheet1, searchValObj);
//			
//			debug("3. 엑셀 데이터 생성 ");
//			_createExcelData(sheet1, searchValObj, datas);
//
//			debug("4. 엑셀 파일 생성 중 ");
//			// Save it
//			workbook.save(function(err){
//				if (err) {
//					debug("엑셀 파일 생성 실패  : " + err);
//				    workbook.cancel();
//				  	reject(err);
//				} else {
//					debug("엑셀 파일 생성 성공 ");
//					resolve(excelFileDirPath + fileName);
//				}
//			});
		});
	};
	
	return {
		createExcel: _createExcel
	}
};

module.exports = new CommuteYearExcelCreater();