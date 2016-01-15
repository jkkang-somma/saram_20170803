define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
	
    var MessageModel = Backbone.Model.extend({
        urlRoot: '/message',
        idAttribute:"_id",
        initialize: function () {
        },
        default:{
            text : null,
            visible : 0,
        },
    });
    
    return MessageModel;
});