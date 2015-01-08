define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'models/vacation/VacationModel',
  'collection/vacation/VacationCollection',
  'text!templates/vacation/vacationTemplate.html',
  'text!templates/vacation/vacationListTableTrTemplate.html'
], function($, _,Backbone, BaseView, 
			VacationModel, 
			VacationCollection,
			vacationTemplate,
			vacationListTableTrTemplate){
    
	function _getSample() {
		var vacationCollection = new VacationCollection();
		
		for (var i = 0, len = 10; i <= len; i++) {
			vacationCollection.add([
			                {
			                	year: "2015", 
			                	id: i,
			                	department: "부서" + i,
			                	name : "name" + i,
			                	total_day: i,
			                	year_holiday: i,
			                	total_holiday_work_day: i++,
			                	used_holiday: 0,
			                	holiday: 0
			                }
			                ]);
			
		}
		
		return vacationCollection;
	}
	
	
	// 검색 조건 년도 
	function _getFormYears() {
		var startYear = 2000;
		var now = new Date().getFullYear();		
		var years = [];
		
		for (; startYear <= now; now--) {
			years.push(now);
		}
		return  years;
	}

    var _vacationCollection = new VacationCollection();
    
	var VacationView = BaseView.extend({
        el:$(".main-container"),
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
    	    // event 설정
    	    this.listenTo(_vacationCollection, 'reset', this.onSettingVacation);
    	},
    	events: {
    		'click #btnCreateData' : 'onClickCreateDataBtn',
    		'click #btnSearch' : 'onClickSearchBtn',
    		'click #btnUpdate' : 'onClickUpdateBtn',
    	},
    	render:function(){
    		var tpl = _.template( vacationTemplate, {variable: 'data'} )( {formYears: _getFormYears()} );    		    		
            $(this.el).append(tpl);
            
            _vacationCollection.fetch({reset : true, data: this.getSearchForm()});
     	},
     	onClickCreateDataBtn : function() {
     		$.post("/vacation", this.getSearchForm(), function(result) {
     			console.log(result);
//     			if (result.length == 0) {
//     				console.log("자료를 생성해주세요");
//     			} else {
//     				
//     			}     			
     		})
     	},
     	onClickSearchBtn : function() { 
     		_vacationCollection.reset();
     		_vacationCollection.fetch({reset : true, data: this.getSearchForm()});
     	},
     	onClickUpdateBtn : function() {
     		var vacationModel = new VacationModel({
            	year: "2015", 
            	id: "100501",
            	total_day: 16     			
     		});
     		
     		vacationModel.save();
     		
     		console.log('onClickUpdateBtn');
     	},
     	onSettingVacation : function(result) {     		
     		var tpl = _.template( vacationListTableTrTemplate, {variable: 'data'} )( {searchResult: result.toJSON()} );
     		this.$el.find('#vacationListTable > tbody').html(tpl);
     	},
     	getSearchForm: function() {
     		return {year: this.$el.find("#selectYear").val()};
     	}
    });
    
    return VacationView;
});