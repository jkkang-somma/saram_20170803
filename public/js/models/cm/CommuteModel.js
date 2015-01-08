define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var commuteModel=Backbone.Model.extend({
        urlRoot: '/commute',
        
        idAttribute:"_id",
        
        initialize: function () {
            
        },
    
        default:{ 
            date : '',
            team : '',
            id : '',
            name : '',
            work_type : '',
            over_work_bonus : '',
            late_time : '',
            over_work_time : '',
            start_work_time : '',
            end_work_time : '',
            update_comment : '',
        },
        
    });
    
    return commuteModel;
});