define([
  'jquery',
  'underscore',
  'backbone',
  'models/sm/BookDocumentModel'
], function($, _,Backbone,BookDocumentModel){
	
    var bookdocumentCollection = Backbone.Collection.extend({
        model : BookDocumentModel,
        url:'/bookdocument'
    });
    
    return bookdocumentCollection;
});