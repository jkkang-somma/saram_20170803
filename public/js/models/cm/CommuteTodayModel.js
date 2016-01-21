define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var CommuteTodayModel=Backbone.Model.extend({
        urlRoot: '/commute/today',
        
        idAttribute:"_id",
        
        initialize: function () {
            
        },
    
        default:{
        	idx : 0,
            id : "",
            date : "",
            name : "",
            date : "",
            dept_name : "",
            out_office_name : "",
            start_time : "",
            end_time : "",
            memo : "",            
        }
    });
    
    return CommuteTodayModel;
});