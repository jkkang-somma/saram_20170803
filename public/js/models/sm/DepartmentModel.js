define([
  'jquery',
  'underscore',
  'backbone', 
], function($, _,Backbone){
    var DepartmentModel=Backbone.Model.extend({
        urlRoot: '/department',
        idAttribute:"_code",
        initialize: function () {
            _.bindAll(this, "remove");
        },
    	        
        remove:function(){
            return this.destroy(); 
        },
        getCustomUrl: function (method) {//idAttribute값을 사용하지 않고 id로 할때
            switch (method) {
                case 'read':
                    return this.urlRoot + "/" + this.attributes.code;
                    break;
                case 'create':
                    return this.urlRoot;
                    break;
                case 'update':
                    return this.urlRoot + "/" + this.attributes.code;
                    break;
                case 'delete':
                    return this.urlRoot + "/" + this.attributes.code;
                    break;
            }
        },
        sync: function (method, model, options) {
            options || (options = {});
            options.url = this.getCustomUrl(method.toLowerCase());
            return Backbone.sync.apply(this, arguments);
        },
        default:{
            code: '',
            name: '',
            area: '',       
            leader: '',
            user_name: '',
            use: 1
        },
        
    });
    
    return DepartmentModel;
});