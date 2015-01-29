var Promise = require('bluebird');
var excelbuilder = require('msexcel-builder');
var path = require('path');
var	excelFileDirPath = path.normalize(__dirname + '/../excel/files/');

var CommuteYearExcelCreater = function () {
	
	var _createExcel = function(year, datas) {
		return new Promise(function(resolve, reject){// promise patten
			var fileName = "근태자료_"+ year + "_" +new Date().getTime() + ".xlsx";
			var workbook = excelbuilder.createWorkbook(excelFileDirPath, fileName);
			
			// sheet 기본 크기 
			var sheet1 = workbook.createSheet('sheet1', 200, 150);
			
			createExcelTitle(sheet1);		
			createExcelData(sheet1, datas);

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


function createExcelTitle(sheet) {

	setTitleCellStyle1(sheet, 1, 1, " 기준년도 ")
//	for (var i = 1, len = 200; i < len; i++) {
//		setTitleCellStyle1(sheet, i, 1, i);
//	}

	setTitleCellStyle1(sheet, 2, 1, " 2015년 ");

	sheet.merge({col:1,row:2},{col:1,row:4});
	setTitleCellStyle1(sheet, 1, 2, " 부서 ");
	

	sheet.merge({col:2,row:2},{col:2,row:4});
	setTitleCellStyle1(sheet, 2, 2, " 사원명 ");

	// 지각 현황 
	sheet.merge({col:3,row:2},{col:15,row:2});
	setTitleCellStyle1(sheet, 3, 2, " 지각현황 ");		
	for (var i = 0, len = 11; i <= len; i++) {
		setTitleCellStyle2(sheet, 3+i, 3, i+1);
	}
	setTitleCellStyle2(sheet, 15, 3, ' 합계 ');

	// 연차 사용 현황 
	sheet.merge({col:16,row:2},{col:29,row:2});
	setTitleCellStyle1(sheet, 16, 2, " 연차 사용 현황 ");
	for (var i = 0, len = 11; i <= len; i++) {
		setTitleCellStyle2(sheet, 16+i, 3, i+1);		
	}
	setTitleCellStyle2(sheet, 28, 3, ' 가용 ');
	setTitleCellStyle2(sheet, 29, 3, ' 잔여 ');

	//잔업시간(분) 현황 (평일 잔업시간)
	sheet.merge({col:30,row:2},{col:42,row:2});
	setTitleCellStyle1(sheet, 30, 2, " 잔업시간(분) 현황 ( 평일 잔업시간 ) ");
	for (var i = 0, len = 11; i <= len; i++) {
		setTitleCellStyle2(sheet, 30+i, 3, i+1);
	}
	setTitleCellStyle2(sheet, 42, 3, ' 합계 ');

	//잔업 수당 타입 현황
	sheet.merge({col:43,row:2},{col:81,row:2});
	setTitleCellStyle1(sheet, 43, 2, " 잔업 수당 타입 현황 ");
	for (var i = 0, len = 11; i <= len; i++) {
		setTitleOverTimeCellType1(sheet, 43 + (3*i), 3, i+1);
	}
	setTitleOverTimeCellType1(sheet, 79, 3, ' 전체 ');

	//잔업 수당 금액 현황
	sheet.merge({col:82,row:2},{col:94,row:2});
	setTitleCellStyle1(sheet, 82, 2, " 잔업 수당 금액 현황 ");
	for (var i = 0, len = 11; i <= len; i++) {
		setTitleCellStyle2(sheet, 82+i, 3, i+1);
	}
	setTitleCellStyle2(sheet, 94, 3, ' 전체 ');

	//휴일 근무 타입 현황
	sheet.merge({col:95,row:2},{col:133,row:2});
	setTitleCellStyle1(sheet, 95, 2, " 휴일 근무 타입 현황 ");
	for (var i = 0, len = 11; i <= len; i++) {
		setTitleHolidayWorkTypeCellType(sheet, 95 + (3*i), 3, i+1);
	}
	setTitleHolidayWorkTypeCellType(sheet, 131, 3, ' 전체 ');


	//휴일근무 수당 금액 현황
	sheet.merge({col:134,row:2},{col:146,row:2});
	setTitleCellStyle1(sheet, 134, 2, " 휴일근무 수당 금액 현황 ");
	for (var i = 0, len = 11; i <= len; i++) {
		setTitleCellStyle2(sheet, 134+i, 3, i+1);
	}
	setTitleCellStyle2(sheet, 146, 3, ' 전체 ');
	sheet.border(146, 3, {left:'thin',top:'thin',right:'medium',bottom:'thin'});
	
	setTieleBorder(sheet);		
}

function createExcelData(sheet, datas){
	
	var users = datas[0],
		lateWorkers = datas[1],
		usedHolidays = datas[2],
		overTimeWorkes = datas[3],
		overTimeWorkTypes = datas[4],
		overTimeWorkPays = datas[5],
		holidayWorkTypes = datas[6],
		holidayWorkPays = datas[7];

	
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i],
			lateWorker = lateWorkers[i],
			usedHoliday = usedHolidays[i],
			overTimeWorke = overTimeWorkes[i],
			overTimeWorkType = overTimeWorkTypes[i],
			overTimeWorkPay = overTimeWorkPays[i],
			holidayWorkType = holidayWorkTypes[i],
			holidayWorkPay = holidayWorkPays[i];		
		
		sheet.set(1, i+5, user.dept_name);
		sheet.border(1, i+5, {left:'medium',top:'thin',right:'medium',bottom:'thin'});		
		
		sheet.set(2, i+5, user.name);
		setDataCellStyle(sheet, 2, i+5);
		sheet.border(2, i+5, {left:'medium',top:'thin',right:'medium',bottom:'thin'});
		
		if (user.id == lateWorker.id) {
			setLateWorkerRow(sheet, 3, i+5, lateWorker);
		}
		
		if (user.id == usedHoliday.id) {
			setUsedHolidayRow(sheet, 16, i+5, usedHoliday);
		}

		if (user.id == overTimeWorke.id) {
			setOverTimeWorkeRow(sheet, 30, i+5, overTimeWorke);
		}

		if (user.id == overTimeWorkType.id) {
			setOverTimeWorkTypeRow(sheet, 43, i+5, overTimeWorkType);
		}
		
		if (user.id == overTimeWorkPay.id) {
			setOverTimeWorkPayRow(sheet, 82, i+5, overTimeWorkPay);
		}

		if (user.id == holidayWorkType.id) {
			setHolidayWorkTypeRow(sheet, 95, i+5, holidayWorkType);
		}		
		
		if (user.id == holidayWorkPay.id) {
			setHolidayWorkPayRow(sheet, 134, i+5, holidayWorkPay);
		}
	}	
}

function setLateWorkerRow(sheet, startCol, startRow, lateWorker) {
	for (var i = 0, len = 11; i <= len; i++) {
		sheet.set( startCol, startRow, lateWorker[i+1]);
		setDataCellStyle(sheet, startCol, startRow);
		
		if (i == 0) {
			sheet.border(startCol, startRow, {left:'medium',top:'thin',right:'thin',bottom:'thin'});
		}
		
		startCol++;
	}
	
	sheet.set( startCol, startRow, lateWorker.total);
	setDataCellStyle(sheet, startCol, startRow);
}

function setUsedHolidayRow(sheet, startCol, startRow, usedHoliday) {
	for (var i = 0, len = 11; i <= len; i++) {
		sheet.set( startCol, startRow, usedHoliday[i+1]);
		setDataCellStyle(sheet, startCol, startRow);
		
		if (i == 0) {
			sheet.border(startCol, startRow, {left:'medium',top:'thin',right:'thin',bottom:'thin'});
		}		
		
		startCol++;
	}	
	sheet.set( startCol, startRow, usedHoliday.total_day);
	setDataCellStyle(sheet, startCol, startRow);
	startCol++;
	
	sheet.set( startCol, startRow, usedHoliday.holiday);
	setDataCellStyle(sheet, startCol, startRow);
}

function setOverTimeWorkeRow(sheet, startCol, startRow, overTimeWorke) {
	for (var i = 0, len = 11; i <= len; i++) {
		sheet.set( startCol, startRow, overTimeWorke[i+1]);
		setDataCellStyle(sheet, startCol, startRow);
		
		if (i == 0) {
			sheet.border(startCol, startRow, {left:'medium',top:'thin',right:'thin',bottom:'thin'});
		}
		
		startCol++;
	}
	sheet.set( startCol, startRow, overTimeWorke.total);
	setDataCellStyle(sheet, startCol, startRow);
}

function setOverTimeWorkTypeRow(sheet, startCol, startRow, overTimeWorkType) {
	for (var i = 0, len = 11; i <= len; i++) {
		sheet.set( startCol, startRow, overTimeWorkType[ (i+1)+'a' ]);
		setDataCellStyle(sheet, startCol, startRow);
		
		if (i == 0) {
			sheet.border(startCol, startRow, {left:'medium',top:'thin',right:'thin',bottom:'thin'});
		}		
		
		sheet.set( startCol+1, startRow, overTimeWorkType[ (i+1)+'b' ]);
		setDataCellStyle(sheet, startCol+1, startRow);
		
		sheet.set( startCol+2, startRow, overTimeWorkType[ (i+1)+'c' ]);
		setDataCellStyle(sheet, startCol+2, startRow);
		startCol = startCol + 3;
	}	

	sheet.set( startCol, startRow, overTimeWorkType.a_total);
	setDataCellStyle(sheet, startCol, startRow);
	startCol++;
	
	sheet.set( startCol, startRow, overTimeWorkType.b_total);
	setDataCellStyle(sheet, startCol, startRow);
	startCol++;
	
	sheet.set( startCol, startRow, overTimeWorkType.c_total);
	setDataCellStyle(sheet, startCol, startRow);
}


function setOverTimeWorkPayRow(sheet, startCol, startRow, overTimeWorkPay) {
	for (var i = 0, len = 11; i <= len; i++) {
		sheet.set( startCol, startRow, overTimeWorkPay[i+1]);
		setDataCellStyle(sheet, startCol, startRow);
		
		if (i == 0) {
			sheet.border(startCol, startRow, {left:'medium',top:'thin',right:'thin',bottom:'thin'});
		}
		
		startCol++;
	}
	
	sheet.set( startCol, startRow, overTimeWorkPay.total);
	setDataCellStyle(sheet, startCol, startRow);
}


function setHolidayWorkTypeRow(sheet, startCol, startRow, holidayWorkType) {
	for (var i = 0, len = 11; i <= len; i++) {
		sheet.set( startCol, startRow, holidayWorkType[ (i+1)+'a' ]);
		setDataCellStyle(sheet, startCol, startRow);

		if (i == 0) {
			sheet.border(startCol, startRow, {left:'medium',top:'thin',right:'thin',bottom:'thin'});
		}
		
		sheet.set( startCol+1, startRow, holidayWorkType[ (i+1)+'b' ]);
		setDataCellStyle(sheet, startCol + 1, startRow);
		
		sheet.set( startCol+2, startRow, holidayWorkType[ (i+1)+'c' ]);
		setDataCellStyle(sheet, startCol + 2, startRow);
			
		startCol = startCol + 3;
	}
	sheet.set( startCol, startRow, holidayWorkType.a_total);
	setDataCellStyle(sheet, startCol, startRow);
	startCol++;
	
	sheet.set( startCol, startRow, holidayWorkType.b_total);
	setDataCellStyle(sheet, startCol, startRow);
	startCol++;
	
	sheet.set( startCol, startRow, holidayWorkType.c_total);
	setDataCellStyle(sheet, startCol, startRow);
	sheet.border(startCol, startRow, {left:'thin',top:'thin',right:'medium',bottom:'thin'});
}

function setHolidayWorkPayRow(sheet, startCol, startRow, holidayWorkPay) {
	for (var i = 0, len = 11; i <= len; i++) {
		sheet.set( startCol, startRow, holidayWorkPay[i+1]);
		setDataCellStyle(sheet, startCol, startRow);	
		
		if (i == 0) {
			sheet.border(startCol, startRow, {left:'medium',top:'thin',right:'thin',bottom:'thin'});
		}
		
		startCol++;
	}
	
	sheet.set( startCol, startRow, holidayWorkPay.total);
	setDataCellStyle(sheet, startCol, startRow);
	sheet.border(startCol, startRow, {left:'thin',top:'thin',right:'medium',bottom:'thin'});
}

function setTitleCellStyle1(sheet, col, row, value) {
	sheet.set(col, row, value);
	sheet.valign(col, row, 'center');
	sheet.align(col, row, 'center');	
}

function setTitleCellStyle2(sheet, col, row, value) {
	sheet.set(col, row, value);
	sheet.merge({col:col,row:row},{col:col,row:row+1});
	sheet.valign(col, row, 'center');
	sheet.align(col, row, 'center');
}

function setDataCellStyle(sheet, startCol, startRow) {
	sheet.valign(startCol, startRow, 'center');
	sheet.align(startCol, startRow, 'center');	
	sheet.border(startCol, startRow, {left:'thin',top:'thin',right:'thin',bottom:'thin'});
}


function setTitleOverTimeCellType1(sheet, col, row, value) {
	sheet.set(col, row, value);
	sheet.merge({col:col,row:row},{col:col+2,row:row});
	sheet.valign(col, row, 'center');
	sheet.align(col, row, 'center');
	
	setTitleCellStyle1(sheet, col, 4, 'A');
	setTitleCellStyle1(sheet, col + 1, 4, 'B');
	setTitleCellStyle1(sheet, col + 2, 4, 'C');
}

function setTitleHolidayWorkTypeCellType(sheet, col, row, value) {
	sheet.set(col, row, value);
	sheet.merge({col:col,row:row},{col:col+2,row:row});
	sheet.valign(col, row, 'center');
	sheet.align(col, row, 'center');
	
	setTitleCellStyle1(sheet, col, 4, 'A');
	setTitleCellStyle1(sheet, col + 1, 4, 'B');
	setTitleCellStyle1(sheet, col + 2, 4, 'C');
}


function setTieleBorder(sheet) {
	for (var i = 1; i <= 146; i++ ) {
		sheet.border(i, 2, {left:'medium',top:'medium',right:'medium',bottom:'medium'});
		sheet.border(i, 3, {left:'medium',top:'medium',right:'medium',bottom:'medium'});
		sheet.border(i, 4, {left:'medium',top:'medium',right:'medium',bottom:'medium'});
	}	
}