define([
  'jquery',
  'underscore',
  'backbone',
  'cmoment',
  'models/common/RawDataModel'
], function($, _, Backbone, Moment ,RawDataModel){
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
                
                var startDate = Moment(charDate + " " + "06:00:00");
                var endDate = Moment(charDate + " " + "06:00:00");
                endDate.add(1, "days");
                
                var modelDate = Moment(model.get("char_date"));
                
                if(modelDate.isBetween(startDate,endDate)){
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