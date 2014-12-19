define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var UserModel=Backbone.Model.extend({
        idAttribute:"user_id",
       // default:{  },
        initialize:function(){
            
        }    
    });
    return UserModel;
});