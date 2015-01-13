define([
  'jquery',
  'underscore',
  'backbone',
  'models/cm/CommuteModel'

], function($, _, Backbone, commuteModel){
    var CommuteCollection = Backbone.Collection.extend({
        model : commuteModel,
        url:'/commute',
        initialize : function(){
            this.wrapper = new CommuteCollectionWrapper(this);
        }, 
        save : function(option){
            this.wrapper.saveAll(option);
        }
    });
    
    var CommuteCollectionWrapper = Backbone.Model.extend({
        url:'/commute/bulk',
        initialize : function(collection){
            this.collection = collection;
        },
        saveAll : function(option){
            var data = this.collection.toJSON();
            this.set({data: data});
            this.save("data", data, option);
        }
    });
    
    return CommuteCollection;
});