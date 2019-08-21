define([
  'underscore',
  'backbone',
], function (_, Backbone) {
  var YesCalendarTypeModel = Backbone.Model.extend({
    urlRoot: '/yescalendar-type',
    idAttribute: 'calendar_type_id',
    initialize: function () {
    },

    remove: function () {
    },

    default: {
      'calendar_type_id': undefined,
      'calendar_type_str': "",
      'color': "",
      'fcolor': "",
      'visible': "",
      'share_dept': "",
      'share_member_list' : {}
    },
  });

  return YesCalendarTypeModel;
});