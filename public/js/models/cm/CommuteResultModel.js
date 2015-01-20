define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var CommuteResultModel=Backbone.Model.extend({
        urlRoot: '/commute/result',
        idAttribute:"_id",
        initialize: function () {
        }, 
        getCustomUrl: function (method) {//idAttribute값을 사용하지 않고 id로 할때
            switch (method) {
                case 'read':
                    return this.urlRoot ;
                    break;
                case 'create':
                    return this.urlRoot;
                    break;
                case 'update':
                    return this.urlRoot;
                    break;
                case 'delete':
                    return this.urlRoot;
                    break;
            }
        },
        sync: function (method, model, options) {
            options || (options = {});
            options.url = this.getCustomUrl(method.toLowerCase());
            return Backbone.sync.apply(this, arguments);
        },
        default:{
        	
        }
    });
    return CommuteResultModel;
});