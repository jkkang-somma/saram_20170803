define([
  'jquery',
  'underscore',
  'backbone',
  'models/sm/UserModel'
], function($, _, Backbone, UserModel){
    var UserCollection = Backbone.Collection.extend({
        model : UserModel,
        url:'/user/list'
    });
    
    return UserCollection;
});