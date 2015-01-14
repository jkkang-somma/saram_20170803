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
            this.wrapper = new HolidayCollectionWrapper(this.toJSON());
            this.wrapper.save({}, option);
        }

    });
    
    var HolidayCollectionWrapper = Backbone.Model.extend({
        url:'/holiday/bulk',
    });

    return HolidayCollection;
});