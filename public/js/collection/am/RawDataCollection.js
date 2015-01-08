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