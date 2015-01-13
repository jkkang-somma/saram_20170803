define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var UserModel=Backbone.Model.extend({
        urlRoot: '/user',
        idAttribute:"_id",
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
            return this.destroy(); 
        },
        getCustomUrl: function (method) {//idAttribute값을 사용하지 않고 id로 할때
            switch (method) {
                case 'read':
                    return this.urlRoot + "/" + this.attributes.id;
                    break;
                case 'create':
                    return this.urlRoot;
                    break;
                case 'update':
                    return this.urlRoot + "/" + this.attributes.id;
                    break;
                case 'delete':
                    return this.urlRoot + "/" + this.attributes.id;
                    break;
            }
        },
        sync: function (method, model, options) {
            options || (options = {});
            options.url = this.getCustomUrl(method.toLowerCase());
            return Backbone.sync.apply(this, arguments);
        },
        default:{ 
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