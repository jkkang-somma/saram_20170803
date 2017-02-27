define([
  'jquery',
  'underscore',
  'backbone',
  'models/room/RoomRegModel'
], function($, _, Backbone, RoomRegModel){
    var RoomRegCollection = Backbone.Collection.extend({
        model : RoomRegModel,
        url:'/roomreg'
    });
    
    return RoomRegCollection;
});