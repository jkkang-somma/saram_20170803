define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var CommuteModel=Backbone.Model.extend({
        urlRoot: '/commute',
        
        idAttribute:"_id",
        
        initialize: function () {
            
        },
    
        default:{
        	idx : 0,
            year : "",    
            date : "",            
            id : "",        
            department : "",
            name : "",  
            standard_in_time : "",
            standard_out_time : "",
            in_time : "",
            out_time : "",  
            work_type : "", 
            vacation_code : "", 
            out_office_code : "",
            overtime_code : "",
            overtime_type : "",
            late_time : "",
            over_time : "", 
            in_time_change : 0,
            out_time_change : 0,
            comment_count : 0,
            changeHistoryJSONArr : [],
            in_time_type : 0,
            out_time_type : 0,
            out_office_start_time : "",
            out_office_end_time : "",
        }
    });

    
    return CommuteModel;
});