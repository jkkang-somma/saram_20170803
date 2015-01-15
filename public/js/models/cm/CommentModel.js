define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    
	var CommentModel = Backbone.Model.extend({
        urlRoot: '/comment',        
        idAttribute:"_id",
        default:{
            year : "",    
            date : "",            
            id : "",
            seq : 0,
            comment : "",
            comment_date : "",
            comment_reply : "",
            comment_reply_date : "",
            state : ""
        }
    });

    
    return CommentModel;
});