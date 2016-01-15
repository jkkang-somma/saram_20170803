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
        remove:function(){
            return this.destroy(); 
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