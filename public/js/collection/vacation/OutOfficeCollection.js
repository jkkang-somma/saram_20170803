define([
  'jquery',
  'underscore',
  'backbone',
  'models/vacation/OutOfficeModel'
], function($, _,Backbone,OutOfficeModel){
    var OutOfficeCollection = Backbone.Collection.extend({
        model : OutOfficeModel,
        url:'/outoffice',
        filterID: function(id){
            return _.filter(this.models, function(model){
                if(model.get("id") == id){
                    return model;
                }
            })
        }
    });
    
    return OutOfficeCollection;
});