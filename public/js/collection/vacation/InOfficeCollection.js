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
            });
        }, save: function(data, id){
            this.wrapper = new InOfficeCollectionWrapper(data);
            this.wrapper.set({_id: id});
            return this.wrapper.save();
        }
    });
    
    var InOfficeCollectionWrapper = Backbone.Model.extend({
       url:'/inoffice/bulk',
       idAttribute : '_id'
    });
    return OutOfficeCollection;
});