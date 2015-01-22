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
                    return this.urlRoot + "/" +this.attributes.id;
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
            id:null,
            password: null, 
            name: '',
            name_commute: '',
            dept_code: '',
            dept_name:'',
            join_company: null,
            privilege : 0,
            admin : 0,
        },
    });
    return CommuteResultModel;
});