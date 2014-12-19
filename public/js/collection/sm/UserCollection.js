define([
  'jquery',
  'underscore',
  'backbone',
  'models/sm/UserModel'
], function($, _, Backbone, UserModel){
    var UserCollection=Backbone.Collection.extend({
        url:"sm/userlist",
        model:UserModel,
        initialize:function(){
            
        }    
    });
    return UserCollection;
});