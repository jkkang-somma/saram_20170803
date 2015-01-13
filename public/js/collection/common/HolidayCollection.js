define([
  'jquery',
  'underscore',
  'backbone',
  'models/common/HolidayModel'
], function($, _, Backbone, HolidayModel){
    var HolidayCollection = Backbone.Collection.extend({
        model : HolidayModel,
        url:'/holiday',
        initialize : function(){
            this.wrapper = new HolidayCollectionWrapper(this);
        }, 
        save : function(option){
            this.wrapper.saveAll(option);
            this.wrapper.clear();
        }

    });
    
    var HolidayCollectionWrapper = Backbone.Model.extend({
        url:'/holiday/bulk',
        initialize : function(collection){
            this.collection = collection;
        },
        
        saveAll : function(option){
            var data = this.collection.toJSON();
            console.log(data);
            this.set({data: data});
            this.save(data, option);
        }
    });

    return HolidayCollection;
});