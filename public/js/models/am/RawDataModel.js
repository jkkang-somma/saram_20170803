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
            year: null,
            id : null,
            name : null,
            department : null,
            int_date: null,
            char_date: null,
            type: null,
        },
        
    });
    
    return UserModel;
});