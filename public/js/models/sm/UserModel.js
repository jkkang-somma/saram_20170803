define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var UserModel=Backbone.Model.extend({
        urlRoot: '/user',
        idAttribute:"id",
        initialize: function () {
            _.bindAll(this, "remove");
        },
    	validate:function(attrs){
    	    for(var name in attrs){
    	        var value=attrs[name];
    	        if (_.isUndefined(value) || _.isNull(value) || _.isEmpty(value)){
    	            return name + " field is require."
    	        }
    	    }
    	},        
        initPassword: function(data){
            this.set(data);
            this.save();
        },
        remove:function(){
            //var model=this;
            return this.destroy(); 
        },
        default:{ 
            id:"",
            password: null, 
            name: '',
            name_commute: '',
            department: '',
            join_company: null,
            leave_company: null,
            privilege : 0,
            admin : 0,
        },
        
    });
    
    return UserModel;
});