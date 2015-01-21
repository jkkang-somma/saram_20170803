define([
  'jquery',
  'underscore',
  'backbone',
  'models/vacation/InOfficeModel'
], function($, _,Backbone,InOfficeModel){
    var OutOfficeCollection = Backbone.Collection.extend({
        model : InOfficeModel,
        url:'/inoffice',
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