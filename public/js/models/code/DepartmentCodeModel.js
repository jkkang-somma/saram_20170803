define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
	
    var DepartmentCode = Backbone.Model.extend({
        urlRoot: '/codev2/department',
        initialize: function () {
        },
        default:{
            code: null,
            name: null
        },
        
    });
    
    return DepartmentCode;
});