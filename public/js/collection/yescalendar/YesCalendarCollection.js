define([
  'underscore',
  'backbone',
  'models/yescalendar/YesCalendarModel'
], function(_, Backbone, YesCalendarModel){
    var YesCalendarCollection = Backbone.Collection.extend({
        model : YesCalendarModel,
        url:'/yescalendar'
    });
    
    return YesCalendarCollection;
});