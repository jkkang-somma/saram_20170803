define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var RoomRegModel = Backbone.Model.extend({
        urlRoot: '/roomreg',
        idAttribute:"index",
        initialize: function () {
        },
        getCustomUrl: function (method) {
            switch (method) {
                case 'read':
                    return this.urlRoot + "/" + this.attributes.index;
                    break;
                case 'create':
                    return this.urlRoot;
                    break;
                case 'update':
                    return this.urlRoot + "/" + this.attributes.index;
                    break;
                case 'delete':
                    return this.urlRoot + "/" + this.attributes.index;
                    break;
            }
        },
        sync: function (method, model, options) {
            options || (options = {});
            options.url = this.getCustomUrl(method.toLowerCase());
            return Backbone.sync.apply(this, arguments);
        },
        defaults:{
        	index: -1,      // 고유번호
        	room_index: -2, // 방 번호
        	member_id: "",	// 예약자
        	title: "",      // 제목
        	date: 0,        // 날짜
        	start_time: 0,  // 시작 시간
        	end_time: 0,    // 종료 시작
        	desc: ''        // 내용
        }
    });
    
    return RoomRegModel;
});