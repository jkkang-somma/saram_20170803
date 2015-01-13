define([
  'jquery',
  'underscore',
  'backbone',
  'models/am/RawDataModel'
], function($, _, Backbone, RawDataModel){
    var RawDataCollection = Backbone.Collection.extend({
        model : RawDataModel,
        url:'/rawdata',
        initialize : function(){
            this.wrapper = new RawDataCollectionWrapper(this);
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
    var RawDataCollectionWrapper = Backbone.Model.extend({
        url:'/rawdata/bulk',
        initialize : function(collection){
            this.collection = collection;
        },
        saveAll : function(option){
            var data = this.collection.toJSON();
            this.set({data: data});
            this.save("data", data, option);
        }
    })
    return RawDataCollection;
});