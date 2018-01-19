define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var IpAssignedManagerModel=Backbone.Model.extend({
        urlRoot: '/IpAssignedManager/IPsearch',
        idAttribute:"_id",
        initialize: function () {
            _.bindAll(this, "remove");
            _.bindAll(this, "validation");
        },
        validation:function(attrs, validArr){
    	    for(var name in attrs){
    	        var value=attrs[name];
    	        if (_.isUndefined(validArr)?_.has(this.default, name):_.has(validArr, name)){//default에 있는 필드만 유효성 검사
        	        if (_.isUndefined(value) || _.isNull(value) || _.isEmpty(value)){
        	            return name + " field is require."
        	        }    
    	        }
    	    }
    	},
        remove:function(){
            return this.destroy(); 
        },
        sync: function (method, model, options) {
            options || (options = {});
            options.url = this.getCustomUrl(method.toLowerCase());
            return Backbone.sync.apply(this, arguments);
        },
        getCustomUrl: function (method) {//idAttribute값을 사용하지 않고 id로 할때
            switch (method) {
                case 'read':
                    return this.urlRoot + "/" + this.attributes.ip;
                    break;
                case 'create':
                    return this.urlRoot;
                    break;
                case 'update':
                    return this.urlRoot + "/" + this.attributes.ip;
                    break;
                case 'delete':
                    return this.urlRoot + "/" + this.attributes.ip;
                    break;
            }
        },
        default:{
            ip : "",
            use_dept : "",
            use_user : "",
            memo : ""
        }
    });
    return IpAssignedManagerModel;
});