define([
  'underscore',
  'backbone',
  'models/yescalendar/YesCalendarTypeModel'
], function(_, Backbone, YesCalendarTypeModel){
    var YesCalendarTyppeCollection = Backbone.Collection.extend({
        model : YesCalendarTypeModel,
        url:'/yescalendar-type'
    });
    
    return YesCalendarTyppeCollection;
});