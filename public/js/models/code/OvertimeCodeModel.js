define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
	
    var OvertimeCodeModel = Backbone.Model.extend({
        urlRoot: '/codev2/overtime',
        initialize: function () {
        },
        default:{
            code: null,
            name: null,
            holiday: null,
            overtime :null, // 초과근무 시간 (시간)
            overtime_pay : null, // 초과근무 금액(원),
            visible : null // 조회시 선택 가능 여부 ( 1:true, 0:false )',
        },
        
    });
    
    return OvertimeCodeModel;
});