define([
  'jquery',
  'underscore',
  'backbone', 
], function($, _,Backbone){
    var PartModel=Backbone.Model.extend({
        urlRoot: '/part',
        idAttribute:"_code",
        initialize: function () {
            _.bindAll(this, "remove");
        },
    	        
        remove:function(){
            return this.destroy(); 
        },
        getCustomUrl: function (method) {//idAttribute값을 사용하지 않고 id로 할때
            switch (method) {
                case 'create':
                    return this.urlRoot;
                    break;
                case 'read':
                case 'update':
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
            origin_code: '',
            name: '',                   
            leader: '',
            user_name: '',
            use: 1
        },
        
    });
    
    return PartModel;
});