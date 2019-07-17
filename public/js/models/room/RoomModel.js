define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {

  var RoomModel = Backbone.Model.extend({
    urlRoot: '/room',
    idAttribute: "index",
    initialize: function () {
    },
    defaults: {
      index: undefined,   // 고유번호
      name: "",   // 방 이름
      use: "1"    // 사용 유무
    }
  });

  return RoomModel;
});