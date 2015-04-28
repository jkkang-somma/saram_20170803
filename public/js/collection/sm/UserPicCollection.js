define([
  'jquery',
  'underscore',
  'backbone',
  'models/sm/UserPicModel'
], function($, _,Backbone,UserPicModel){
	
    var userPicCollection = Backbone.Collection.extend({
        model : UserPicModel,
        url:'/userpic'
    });
    
    return userPicCollection;
});