define([
    'jquery',
    'underscore',
    'backbone'
  ], function($, _,Backbone){
      var OfficeItemModel=Backbone.Model.extend({
          urlRoot: '/officeitemmanager',          
          idAttribute:"_id",
          
          initialize: function () {
            _.bindAll(this, "remove");
            _.bindAll(this, "validation");
          },

          validation:function(attrs, validArr, skipArr){
    	    for(var name in attrs){
                var value=attrs[name];
                if(!_.has(skipArr, name)){
                    if (_.isUndefined(validArr)?_.has(this.default, name):_.has(validArr, name)){//default에 있는 필드만 유효성 검사
                        if (_.isUndefined(value) || _.isNull(value) || _.isEmpty(value)){
                            return name + " field is require."
                        }    
                    }
                }
    	    }
    	},  
        remove:function(){
            return this.destroy(); 
        },
        getCustomUrl: function (method) {//idAttribute값을 사용하지 않고 id로 할때
            switch (method) {
                case 'read':
                    return this.urlRoot + "/" + this.attributes.serial_yes;
                    break;
                case 'create':
                    return this.urlRoot;
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
            serial_yes      : "", 
            serial_factory  : "",
            vendor          : "",
            model_no        : "", 
            category_code   : "",
            category_index  : 0,
            category_type   : "", 
            price           : 0,
            surtax          : 0,
            price_buy       : 0,
            buy_date        : "",
            disposal_date   : "",
            disposal_account: "",
            expiration_date : "",
            use_dept        : "",
            use_user        : "",
            location        : "",
            state           : "",
            memo            : ""
          }
      }); 
  
      
      return OfficeItemModel;
  });