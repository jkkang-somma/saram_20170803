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
            });
        }, save: function(data, id){
            this.wrapper = new OutOfficeCollectionWrapper(data);
            this.wrapper.set({_id: id});
            return this.wrapper.save();
        }
    });
    
    var OutOfficeCollectionWrapper = Backbone.Model.extend({
       url:'/outoffice/bulk',
       idAttribute : '_id'
    });
    return OutOfficeCollection;
});