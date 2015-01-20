define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
	
    var InOfficeModel = Backbone.Model.extend({
        urlRoot: '/inOffice',
        idAttribute:"_id",
        initialize: function () {
            
        },
        defaults:{
        	year:"",
            date:"",
            id:"",
            doc_num:"",
            arrInsertDate:[]
        }
        
    });
    
    return InOfficeModel;
});