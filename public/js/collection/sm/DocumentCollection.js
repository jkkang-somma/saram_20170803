define([
  'jquery',
  'underscore',
  'backbone',
  'models/sm/DocumentModel'
], function($, _,Backbone,DocumentModel){
	
    var documentCollection = Backbone.Collection.extend({
        model : DocumentModel,
        url:'/documentlist'
    });
    
    return documentCollection;
});