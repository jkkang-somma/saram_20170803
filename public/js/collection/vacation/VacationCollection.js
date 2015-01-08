define([
  'jquery',
  'underscore',
  'backbone',
  'models/vacation/VacationModel'
], function($, _,Backbone,VacationModel){
	
    var VacationCollection = Backbone.Collection.extend({
        model : VacationModel,
        url:'/vacation'
    });
    
    return VacationCollection;
});