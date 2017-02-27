define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
	
    var RoomModel = Backbone.Model.extend({
        urlRoot: '/room',
        idAttribute:"index",
        initialize: function () {
        },
        defaults:{
        	index: -1,      // 고유번호
        	name: "",       // 방 이름
        }
    });
    
    return RoomModel;
});