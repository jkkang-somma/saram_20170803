define([
  'underscore',
  'backbone',
], function (_, Backbone) {
  var YesCalendarModel = Backbone.Model.extend({
    urlRoot: '/yescalendar',
    idAttribute: 'calendar_id',
    initialize: function () {
    },

    remove: function () {
    },

    default: {
      'calendar_id': undefined,
      'member_id': "",
      'title': "",
      'all_day': "",
      'start': "",
      'end': "",
      'alarm': "", // '10 / 30 / 60 ( 분단위 지정 )',
      'calendar_type': "", // 'calendar_type_tbl 중에서 선택',
      'memo': "",
      'reg_time': "", // '일정 등록 시각'
    },
  });

  return YesCalendarModel;
});