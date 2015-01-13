define([
  'jquery',
  'underscore',
  'backbone',
  'models/cm/ChangeHistoryModel'
], function($, _, Backbone, ChangeHistoryModel){
	
    var ChangeHistoryCollection = Backbone.Collection.extend({
        model : ChangeHistoryModel,
        url: '/changeHistory',
    });
    
    return ChangeHistoryCollection;
});