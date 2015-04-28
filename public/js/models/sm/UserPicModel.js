define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var UserPicModel = Backbone.Model.extend({
        urlRoot: '/userpic',
        idAttribute:"_id",
        initialize: function () {
            
        },
        defaults:{
        }
    });
    return UserPicModel;
});