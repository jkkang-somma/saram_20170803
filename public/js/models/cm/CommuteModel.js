define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
	
    var CommuteModel=Backbone.Model.extend({
        url: '/commute',
        idAttribute : '',
        defaults:{ 
            year : '',
        	date : '',
            department : '',
            id : '',
            name : '',
            work_type : '',
            late_time : '',	// 지각 시간
            over_time : 0,	// 초과 근무 시간
            in_time : '', 	// 출근 시간
            out_time : '',	// 퇴근 시간
            overtime_type : '',	// 야근 수당 정보
            overtime_pay : '', 	// 야근 수당
            vacation_name : '', // 휴가 타입
            out_office_name : '',	// 외근 정보
            
            in_time_change: 0,	// 출근 시간 변경  수
            out_time_change: 0,  // 퇴근 시간 변경 수
            comment_count : 0	// comment 수
        }
    });    
    
    return CommuteModel;
});