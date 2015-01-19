define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
	
    var OutOfficeModel = Backbone.Model.extend({
        urlRoot: '/outOffice',
        idAttribute:"_id",
        initialize: function () {
            
        },
        defaults:{
        	year:"",
            date:"",
            id:"",
            office_code:"",
            day_count:"",
            memo:"",
            doc_num:"",
            start_time : "",
            end_time : "",
            arrInsertDate:[],
        }
        
    });
    
    return OutOfficeModel;
});