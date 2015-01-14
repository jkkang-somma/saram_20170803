define([
  'jquery',
  'underscore',
  'backbone',
  'models/cm/CommentModel'
], function($, _, Backbone, CommentModel){
    var CommentCollection = Backbone.Collection.extend({
        model : CommentModel,
        url:'/comment'
    });
    
    return CommentCollection;
});