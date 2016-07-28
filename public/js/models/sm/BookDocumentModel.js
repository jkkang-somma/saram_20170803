define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var BookDocumentModel = Backbone.Model.extend({
        urlRoot: '/bookdocument',
        idAttribute:"_id",
        initialize: function () {
            
        },   
	    default:{
	    },
    });
    return BookDocumentModel;
});