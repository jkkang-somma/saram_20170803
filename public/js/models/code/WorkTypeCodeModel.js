define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
	
    var WorkTypeCodeModel = Backbone.Model.extend({
        urlRoot: '/codev2/worktype',
        initialize: function () {
        },
        default:{
            code: null,
            name: null
        },
        
    });
    
    return WorkTypeCodeModel;
});