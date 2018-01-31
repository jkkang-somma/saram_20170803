define([
    'jquery',
    'underscore',
    'backbone'
  ], function($, _,Backbone){
      var OfficeItemHistoryModel=Backbone.Model.extend({
          urlRoot: '/officeitemhistory/history',
          idAttribute:"_id",
          
          initialize: function () {
            _.bindAll(this, "remove");
            _.bindAll(this, "validation");
          },

          validation:function(attrs, validArr){
    	    for(var name in attrs){
    	        var value=attrs[name];
    	        if (_.isUndefined(validArr)?_.has(this.default, name):_.has(validArr, name)){//default
        	        if (_.isUndefined(value) || _.isNull(value) || _.isEmpty(value)){
        	            return name + " field is require."
        	        }    
    	        }
    	    }
    	},  
        remove:function(){
            return this.destroy(); 
        },
        getCustomUrl: function (method) {//idAttribute
            switch (method) {
                case 'read':
                    return this.urlRoot + "/" + this.attributes.serial_yes;
                    break;
                case 'create':
                    return this.urlRoot+ "/";
                    break;
                case 'update':
                    return this.urlRoot + "/" + this.attributes.serial_yes;
                    break;
                case 'delete':
                    return this.urlRoot + "/" + this.attributes.serial_yes;
                    break;
            }
        },
        sync: function (method, model, options) {
            options || (options = {});
            options.url = this.getCustomUrl(method.toLowerCase());
            return Backbone.sync.apply(this, arguments);
        },
        default:{
            seq         : 0, 
            serial_yes  : "", 
            category_type   : "", 
            history_date: "", 
            type	    : "", 
            title	    : "", 
            repair_price: 0,
            use_user	: "", 
            use_dept	: "", 
            name	    : "", 
            change_user_id	: "", 
            memo	    : ""
          }
      });
      
      return OfficeItemHistoryModel;
  });