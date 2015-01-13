// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var CodeModel=Backbone.Model.extend({
        urlRoot: '/code',
        idAttribute:"_id",
        initialize: function () {
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
            code:"",
            name:""
        }
    });
    
    return CodeModel;
});