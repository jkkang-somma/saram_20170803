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
        },
        filterID : function(id){
            return _.filter(this.models, function(model){
               if(model.get("id") == id){
                   return model;
               } 
            });
        },
        filterDate : function(charDate){
            return _.filter(this.models, function(model){
                
                var startDate = new Date(charDate + " " + "06:00:00");
                var endDate = new Date(charDate + " " + "06:00:00");
                endDate.setDate(endDate.getDate() + 1);
                
                var modelDate = new Date(model.get("char_date"));
                
                if(modelDate > startDate && modelDate <= endDate){
                    return model;
                }
            
            });
        }
    });
    var CommuteCollectionWrapper = Backbone.Model.extend({
        url:'/rawdata/bulk',
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