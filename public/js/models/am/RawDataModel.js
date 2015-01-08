define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var UserModel=Backbone.Model.extend({
        urlRoot: '/rawdata',
        
        idAttribute:"_id",
        
        initialize: function () {
            
        },
        
        default:{ 
            id : null,
            name : null,
            department : null,
            time: null,
            type: null,
        },
        
    });
    
    return UserModel;
});