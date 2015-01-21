define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
	
    var OfficeCodeModel = Backbone.Model.extend({
        urlRoot: '/codev2/office',
        initialize: function () {
        },
        default:{
            code: null,
            name: null,
            day_count : null,
        },
        
    });
    
    return OfficeCodeModel;
});