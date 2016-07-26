define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var DocumentModel = Backbone.Model.extend({
        urlRoot: '/documentlist',
        idAttribute:"_id",
        initialize: function () {
            
        },   
	    default:{
	    },
    });
    return DocumentModel;
});