define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
	
    var VacationModel = Backbone.Model.extend({
        urlRoot: '/vacation',
        
        initialize: function () {
            
        },
        
        default:{
        	year: "",		// 휴가 사용 년도 
        	id: "",			// 사번
        	dept_name: "",	// 부서
        	name : "",		// 이름
        	total_day: 0,	// 연차
        	total_holiday: 0,	// 총 휴가일수 (연차 + 대체 휴가 계산)
        	total_holiday_work_day: 0, 	// 대체 휴가
        	used_holiday: 0, 		// 사용 일수  (out_office_tbl - year + id 조홥 조회   )
        	holiday: 0			// 휴가 잔여 일수 (total_holiday - used_holiday) 
        },
        
    });
    
    return VacationModel;
});