var Promise = require('bluebird');
var excelbuilder = require('msexcel-builder');
var path = require('path');
var fs = require('fs');
var	excelFileDirPath = path.normalize(__dirname + '/../excel/files/');

var CommuteYearExcelCreater = function () {

	var COL_DEPT = 1;	// 부서	
	var COL_NAME = 2;	// 이름
	var COL_LEAVE_COMPANY = 3;	// 퇴사

	// 지각 현황
	var COL_LATE_WORKER = 4;
	var COL_LATE_WORKER_END = 16;

	//연차 사용 현황
	var COL_USED_HOLIDAY = 17;
	var COL_USED_HOLIDAY_END = 30;

	//잔업시간(분) 현황 ( 평일 잔업시간 )
	var COL_OVER_TIME_WORKE = 31;
	var COL_OVER_TIME_WORKE_END = 43;

	// 잔업 수당 타입 현황
	var COL_OVER_TIME_WORK_TYPE = 44;
	var COL_OVER_TIME_WORK_TYPE_END = 82;

	//잔업 수당 금액 현황
	var COL_OVER_TIME_WORK_PAY	= 83;
	var COL_OVER_TIME_WORK_PAY_END	= 95;

	//휴일 근무 타입 현황
	var COL_HOLIDAY_WORK_TYPE =  96;
	var COL_HOLIDAY_WORK_TYPE_END =  134;

	//휴일근무 수당 금액 현황
	var COL_HOLIDAY_WORK_PAY =  135;
	var COL_HOLIDAY_WORK_PAY_END =  147;

	function _createExcelTitle(sheet, searchValObj) {

		_setTitleCellStyle(sheet, 1, 1, " 검색기간 ")
//		for (var i = 1, len = 200; i < len; i++) {
//			_setTitleCellStyle(sheet, i, 1, i);
//		}

		sheet.merge({col:2, row:1},{col:4, row:1});
		_setTitleCellStyle(sheet, 2, 1, (searchValObj.startDate + " ~ " + searchValObj.endDate) );

		sheet.merge({col:COL_DEPT, row:2},{col:COL_DEPT, row:4});
		_setTitleCellStyle(sheet, COL_DEPT, 2, " 부서 ");
		

		sheet.merge({col:COL_NAME, row:2},{col:COL_NAME, row:4});
		_setTitleCellStyle(sheet, COL_NAME, 2, " 사원명 ");
		
		sheet.merge({col:COL_LEAVE_COMPANY, row:2},{col:COL_LEAVE_COMPANY, row:4});
		_setTitleCellStyle(sheet, COL_LEAVE_COMPANY, 2, " 퇴사일 ");
		

		// 지각 현황 
		sheet.merge({col:COL_LATE_WORKER, row:2},{col:COL_LATE_WORKER_END, row:2});
		_setTitleCellStyle(sheet, COL_LATE_WORKER, 2, " 지각현황 ");		
		for (var i = 0, len = 11; i <= len; i++) {
			_setTitleMergeStyle(sheet, COL_LATE_WORKER + i, 3, i+1);
		}
		_setTitleMergeStyle(sheet, COL_LATE_WORKER_END, 3, ' 합계 ');

		// 연차 사용 현황 
		sheet.merge({col:COL_USED_HOLIDAY, row:2},{col:COL_USED_HOLIDAY_END, row:2});
		_setTitleCellStyle(sheet, COL_USED_HOLIDAY, 2, " 연차 사용 현황 ");
		for (var i = 0, len = 11; i <= len; i++) {
			_setTitleMergeStyle(sheet, COL_USED_HOLIDAY + i, 3, i+1);		
		}
		_setTitleMergeStyle(sheet, COL_USED_HOLIDAY_END - 1, 3, ' 가용 ');
		_setTitleMergeStyle(sheet, COL_USED_HOLIDAY_END, 3, ' 잔여 ');

		//잔업시간(분) 현황 (평일 잔업시간)
		sheet.merge({col:COL_OVER_TIME_WORKE, row:2},{col:COL_OVER_TIME_WORKE_END, row:2});
		_setTitleCellStyle(sheet, COL_OVER_TIME_WORKE, 2, " 잔업시간(분) 현황 ( 평일 잔업시간 ) ");
		for (var i = 0, len = 11; i <= len; i++) {
			_setTitleMergeStyle(sheet, COL_OVER_TIME_WORKE + i, 3, i+1);
		}
		_setTitleMergeStyle(sheet, COL_OVER_TIME_WORKE_END, 3, ' 합계 ');

		//잔업 수당 타입 현황
		sheet.merge({col:COL_OVER_TIME_WORK_TYPE, row:2},{col:COL_OVER_TIME_WORK_TYPE_END, row:2});
		_setTitleCellStyle(sheet, COL_OVER_TIME_WORK_TYPE, 2, " 잔업 수당 타입 현황 ");
		for (var i = 0, len = 11; i <= len; i++) {
			_setTitleABCCellType(sheet, COL_OVER_TIME_WORK_TYPE + (3*i), 3, i+1);
		}
		_setTitleABCCellType(sheet, COL_OVER_TIME_WORK_TYPE_END - 2, 3, ' 전체 ');

		//잔업 수당 금액 현황
		sheet.merge({col:COL_OVER_TIME_WORK_PAY, row:2},{col:COL_OVER_TIME_WORK_PAY_END, row:2});
		_setTitleCellStyle(sheet, COL_OVER_TIME_WORK_PAY, 2, " 잔업 수당 금액 현황 ");
		for (var i = 0, len = 11; i <= len; i++) {
			_setTitleMergeStyle(sheet, COL_OVER_TIME_WORK_PAY + i, 3, i+1);
		}
		_setTitleMergeStyle(sheet, COL_OVER_TIME_WORK_PAY_END, 3, ' 전체 ');

		//휴일 근무 타입 현황
		sheet.merge({col:COL_HOLIDAY_WORK_TYPE, row:2},{col:COL_HOLIDAY_WORK_TYPE_END,row:2});
		_setTitleCellStyle(sheet, COL_HOLIDAY_WORK_TYPE, 2, " 휴일 근무 타입 현황 ");
		for (var i = 0, len = 11; i <= len; i++) {
			_setTitleABCCellType(sheet, COL_HOLIDAY_WORK_TYPE + (3*i), 3, i+1);
		}
		_setTitleABCCellType(sheet, COL_HOLIDAY_WORK_TYPE_END - 2, 3, ' 전체 ');


		//휴일근무 수당 금액 현황
		sheet.merge({col:COL_HOLIDAY_WORK_PAY, row:2},{col:COL_HOLIDAY_WORK_PAY_END, row:2});
		_setTitleCellStyle(sheet, COL_HOLIDAY_WORK_PAY, 2, " 휴일근무 수당 금액 현황 ");
		for (var i = 0, len = 11; i <= len; i++) {
			_setTitleMergeStyle(sheet, COL_HOLIDAY_WORK_PAY + i, 3, i+1);
		}
		_setTitleMergeStyle(sheet, COL_HOLIDAY_WORK_PAY_END, 3, ' 전체 ');
		sheet.border(COL_HOLIDAY_WORK_PAY_END, 3, {left:'thin',top:'thin',right:'medium',bottom:'thin'});
		
		_setTieleBorder(sheet);		
	}

	function _createExcelData(sheet, searchValObj, datas){
		
		var users = datas[0],
			lateWorkers = datas[1],
			usedHolidays = datas[2],
			overTimeWorkes = datas[3],
			overTimeWorkTypes = datas[4],
			overTimeWorkPays = datas[5],
			holidayWorkTypes = datas[6],
			holidayWorkPays = datas[7];

		var currentRow = 4;
		for (var i = 0, len = users.length; i < len; i++) {
			var user = users[i],
				lateWorker = lateWorkers[i],
				usedHoliday = usedHolidays[i],
				overTimeWorke = overTimeWorkes[i],
				overTimeWorkType = overTimeWorkTypes[i],
				overTimeWorkPay = overTimeWorkPays[i],
				holidayWorkType = holidayWorkTypes[i],
				holidayWorkPay = holidayWorkPays[i];
			
			if ( !searchValObj.isInLeaveWorker ){
				if (user.leave_company != null && user.leave_company != "") {
					continue;
				}
			}
			
			if (user.dept_code == "0000") {	// 임원 제외 
				continue;
			}			
			else {
				currentRow++;
			}
			
			sheet.set(COL_DEPT, currentRow, user.dept_name);
			sheet.border(COL_DEPT, currentRow, {left:'medium',top:'thin',right:'medium',bottom:'thin'});		
			
			sheet.set(COL_NAME, currentRow, user.name);
			_setDataCellStyle(sheet, COL_NAME, currentRow);
			sheet.border(COL_NAME, currentRow, {left:'medium',top:'thin',right:'medium',bottom:'thin'});
			
			sheet.set(COL_LEAVE_COMPANY, currentRow, user.leave_company);
			_setDataCellStyle(sheet, COL_LEAVE_COMPANY, currentRow);
			sheet.border(COL_LEAVE_COMPANY, currentRow, {left:'medium',top:'thin',right:'medium',bottom:'thin'});
			
			if (user.id == lateWorker.id) {
				_setLateWorkerRow(sheet, COL_LATE_WORKER, currentRow, lateWorker);
			}
			
			if (user.id == usedHoliday.id) {
				_setUsedHolidayRow(sheet, COL_USED_HOLIDAY, currentRow, usedHoliday);
			}
	
			if (user.id == overTimeWorke.id) {
				_setOverTimeWorkeRow(sheet, COL_OVER_TIME_WORKE, currentRow, overTimeWorke);
			}
	
			if (user.id == overTimeWorkType.id) {
				_setOverTimeWorkTypeRow(sheet, COL_OVER_TIME_WORK_TYPE, currentRow, overTimeWorkType);
			}
			
			if (user.id == overTimeWorkPay.id) {
				_setOverTimeWorkPayRow(sheet, COL_OVER_TIME_WORK_PAY, currentRow, overTimeWorkPay);
			}
	
			if (user.id == holidayWorkType.id) {
				_setHolidayWorkTypeRow(sheet, COL_HOLIDAY_WORK_TYPE, currentRow, holidayWorkType);
			}		
			
			if (user.id == holidayWorkPay.id) {
				_setHolidayWorkPayRow(sheet, COL_HOLIDAY_WORK_PAY, currentRow, holidayWorkPay);
			}
		}
	}

	function _setLateWorkerRow(sheet, startCol, startRow, lateWorker) {
		for (var i = 0, len = 11; i <= len; i++) {
			sheet.set( startCol, startRow, lateWorker[i+1]);
			_setDataCellStyle(sheet, startCol, startRow);
			
			if (i == 0) {
				sheet.border(startCol, startRow, {left:'medium',top:'thin',right:'thin',bottom:'thin'});
			}
			startCol++;
		}
		
		sheet.set( startCol, startRow, lateWorker.total);
		_setDataCellStyle(sheet, startCol, startRow);
	}

	function _setUsedHolidayRow(sheet, startCol, startRow, usedHoliday) {
		for (var i = 0, len = 11; i <= len; i++) {
			sheet.set( startCol, startRow, usedHoliday[i+1]);
			_setDataCellStyle(sheet, startCol, startRow);
			
			if (i == 0) {
				sheet.border(startCol, startRow, {left:'medium',top:'thin',right:'thin',bottom:'thin'});
			}
			startCol++;
		}	
		sheet.set( startCol, startRow, usedHoliday.total_day);
		_setDataCellStyle(sheet, startCol, startRow);
		startCol++;
		
		sheet.set( startCol, startRow, usedHoliday.holiday);
		_setDataCellStyle(sheet, startCol, startRow);
	}

	function _setOverTimeWorkeRow(sheet, startCol, startRow, datas) {
		for (var i = 0, len = 11; i <= len; i++) {
			sheet.set( startCol, startRow, datas[i+1]);
			_setDataCellStyle(sheet, startCol, startRow);
			
			if (i == 0) {
				sheet.border(startCol, startRow, {left:'medium',top:'thin',right:'thin',bottom:'thin'});
			}
			startCol++;
		}
		sheet.set( startCol, startRow, datas.total);
		_setDataCellStyle(sheet, startCol, startRow);
	}

	function _setOverTimeWorkTypeRow(sheet, startCol, startRow, datas) {
		for (var i = 0, len = 11; i <= len; i++) {
			sheet.set( startCol, startRow, datas[ (i+1)+'a' ]);
			_setDataCellStyle(sheet, startCol, startRow);
			
			if (i == 0) {
				sheet.border(startCol, startRow, {left:'medium',top:'thin',right:'thin',bottom:'thin'});
			}		
			
			sheet.set( startCol+1, startRow, datas[ (i+1)+'b' ]);
			_setDataCellStyle(sheet, startCol+1, startRow);
			
			sheet.set( startCol+2, startRow, datas[ (i+1)+'c' ]);
			_setDataCellStyle(sheet, startCol+2, startRow);
			startCol = startCol + 3;
		}	

		sheet.set( startCol, startRow, datas.a_total);
		_setDataCellStyle(sheet, startCol, startRow);
		startCol++;
		
		sheet.set( startCol, startRow, datas.b_total);
		_setDataCellStyle(sheet, startCol, startRow);
		startCol++;
		
		sheet.set( startCol, startRow, datas.c_total);
		_setDataCellStyle(sheet, startCol, startRow);
	}


	function _setOverTimeWorkPayRow(sheet, startCol, startRow, datas) {
		for (var i = 0, len = 11; i <= len; i++) {
			sheet.set( startCol, startRow, datas[i+1]);
			_setDataCellStyle(sheet, startCol, startRow);
			
			if (i == 0) {
				sheet.border(startCol, startRow, {left:'medium',top:'thin',right:'thin',bottom:'thin'});
			}
			startCol++;
		}
		
		sheet.set( startCol, startRow, datas.total);
		_setDataCellStyle(sheet, startCol, startRow);
	}


	function _setHolidayWorkTypeRow(sheet, startCol, startRow, datas) {
		for (var i = 0, len = 11; i <= len; i++) {
			sheet.set( startCol, startRow, datas[ (i+1)+'a' ]);
			_setDataCellStyle(sheet, startCol, startRow);

			if (i == 0) {
				sheet.border(startCol, startRow, {left:'medium',top:'thin',right:'thin',bottom:'thin'});
			}
			
			sheet.set( startCol+1, startRow, datas[ (i+1)+'b' ]);
			_setDataCellStyle(sheet, startCol + 1, startRow);
			
			sheet.set( startCol+2, startRow, datas[ (i+1)+'c' ]);
			_setDataCellStyle(sheet, startCol + 2, startRow);
				
			startCol = startCol + 3;
		}
		sheet.set( startCol, startRow, datas.a_total);
		_setDataCellStyle(sheet, startCol, startRow);
		startCol++;
		
		sheet.set( startCol, startRow, datas.b_total);
		_setDataCellStyle(sheet, startCol, startRow);
		startCol++;
		
		sheet.set( startCol, startRow, datas.c_total);
		_setDataCellStyle(sheet, startCol, startRow);
		sheet.border(startCol, startRow, {left:'thin',top:'thin',right:'medium',bottom:'thin'});
	}

	function _setHolidayWorkPayRow(sheet, startCol, startRow, datas) {
		for (var i = 0, len = 11; i <= len; i++) {
			sheet.set( startCol, startRow, datas[i+1]);
			_setDataCellStyle(sheet, startCol, startRow);	
			
			if (i == 0) {
				sheet.border(startCol, startRow, {left:'medium',top:'thin',right:'thin',bottom:'thin'});
			}
			startCol++;
		}
		
		sheet.set( startCol, startRow, datas.total);
		_setDataCellStyle(sheet, startCol, startRow);
		sheet.border(startCol, startRow, {left:'thin',top:'thin',right:'medium',bottom:'thin'});
	}

	function _setTitleCellStyle(sheet, col, row, value) {
		sheet.set(col, row, value);
		sheet.valign(col, row, 'center');
		sheet.align(col, row, 'center');	
	}

	function _setTitleMergeStyle(sheet, col, row, value) {
		sheet.set(col, row, value);
		sheet.merge({col:col,row:row},{col:col,row:row+1});
		sheet.valign(col, row, 'center');
		sheet.align(col, row, 'center');
	}

	function _setDataCellStyle(sheet, startCol, startRow) {
		sheet.valign(startCol, startRow, 'center');
		sheet.align(startCol, startRow, 'center');	
		sheet.border(startCol, startRow, {left:'thin',top:'thin',right:'thin',bottom:'thin'});
	}


	function _setTitleABCCellType(sheet, col, row, value) {
		sheet.set(col, row, value);
		sheet.merge({col:col,row:row},{col:col+2,row:row});
		sheet.valign(col, row, 'center');
		sheet.align(col, row, 'center');
		
		_setTitleCellStyle(sheet, col, 4, 'A');
		_setTitleCellStyle(sheet, col + 1, 4, 'B');
		_setTitleCellStyle(sheet, col + 2, 4, 'C');
	}

	function _setTieleBorder(sheet) {
		for (var i = 1; i <= COL_HOLIDAY_WORK_PAY_END; i++ ) {
			sheet.border(i, 2, {left:'medium',top:'medium',right:'medium',bottom:'medium'});
			sheet.border(i, 3, {left:'medium',top:'medium',right:'medium',bottom:'medium'});
			sheet.border(i, 4, {left:'medium',top:'medium',right:'medium',bottom:'medium'});
		}	
	}	
	
	var _createExcel = function(searchValObj, datas) {
		return new Promise(function(resolve, reject){// promise patten
			var fileName = "근태자료_"+ searchValObj.startDate + "_" + searchValObj.endDate + "_" +new Date().getTime() + ".xlsx";
			var workbook = excelbuilder.createWorkbook(excelFileDirPath, fileName);
			
			// 파일 폴더 체크 
			if (!fs.existsSync(excelFileDirPath)) {
				try {
					fs.mkdirSync(excelFileDirPath);
				} catch(e) {
					if ( e.code != 'EEXIST' ) {
						console.log("Fail create excel file dir");
						throw e;
					}
				}
			}
			
			// sheet 기본 크기 
			var sheet1 = workbook.createSheet('sheet1', 200, 150);
			
			_createExcelTitle(sheet1, searchValObj);		
			_createExcelData(sheet1, searchValObj, datas);

			// Save it
			workbook.save(function(err){
				if (err) {
				    workbook.cancel();
				  	reject(err);
				} else {
					resolve(excelFileDirPath + fileName);
				}
			});
		});
	};
	
	return {
		createExcel: _createExcel
	}
};

module.exports = new CommuteYearExcelCreater();