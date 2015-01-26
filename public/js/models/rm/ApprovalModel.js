define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
	
    var ApprovalModel = Backbone.Model.extend({
        urlRoot: '/approval',
        idAttribute:"_id",
        initialize: function () {
        },
        default:{
            doc_num : null,
            submit_id : null,       // 신청자
            manager_id : null,      // 결재자
            submit_date : null,     // 신청 날짜
            decide_date : null,     // 결재 날짜
            submit_comment : null,  // 신청 메모
            decide_comment : null,  // 결재자 메모
            start_date : null,      
            end_date : null,    
            office_code : null,     // 구분
            black_mark : null,     
            state : null,           // 결재 구분
            start_time : null,
            end_time : null,
            day_count : null
        },
        
    });
    
    return ApprovalModel;
});