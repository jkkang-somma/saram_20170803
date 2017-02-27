define([
  'jquery',
  'underscore',
  'backbone',
  'models/room/RoomModel'
], function($, _, Backbone, RoomModel){
    var RoomCollection = Backbone.Collection.extend({
        model : RoomModel,
        url:'/room'
    });
    
    return RoomCollection;
});