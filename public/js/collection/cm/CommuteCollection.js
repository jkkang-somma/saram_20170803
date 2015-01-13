define([
  'jquery',
  'underscore',
  'backbone',
  'models/cm/CommuteModel'
], function($, _,Backbone,CommuteModel){
	
    var CommuteCollection = Backbone.Collection.extend({
        model : CommuteModel,
        url:'/commute'
    });
    
    return CommuteCollection;
});