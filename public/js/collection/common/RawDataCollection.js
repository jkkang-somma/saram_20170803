define([
  'jquery',
  'underscore',
  'backbone',
  'models/common/RawDataModel'
], function($, _, Backbone, RawDataModel){
    var RawDataCollection = Backbone.Collection.extend({
        model : RawDataModel,
        url:'/rawdata',
        initialize : function(){
            
        }, 
        save : function(option){
            this.wrapper = new RawDataCollectionWrapper(this.toJSON());
            this.wrapper.save({}, option);
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
    })
    return RawDataCollection;
});