define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
	
    var CommuteModel=Backbone.Model.extend({
        urlRoot: '/changeHistory',
        idAttribute : '_id',
        defaults:{
        	seq : 0,
            year : '',
        	date : '',
            id : '',
            name : '',
            change_column : '',
            change_before : '',
            change_after : '',
            change_date : '',
            change_id : '',
            change_name : '',
            change_memo : "",
        }
    });    
    
    return CommuteModel;
});