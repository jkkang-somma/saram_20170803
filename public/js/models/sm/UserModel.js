define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var UserModel=Backbone.Model.extend({
        urlRoot: '/user',
        
        idAttribute:"id",
        
        initialize: function () {
            
        },
        
        initPassword: function(data){
            this.set(data);
            this.save();
        },
    
        default:{ 
            password: null, 
            name: '',
            name_commute: '',
            department: '',
            join_company: null,
            leave_company: null,
            privilege : 0
        },
        
    });
    
    return UserModel;
});