define([
  'jquery',
  'underscore',
  'backbone',
  'util',
  'datatables',
  'core/BaseView',
  'models/vacation/VacationModel',
  'collection/vacation/VacationCollection',
  'text!templates/vacation/vacationTemplate.html',
  'text!templates/vacation/vacationInfoPopupTemplate.html'
], function($, _,Backbone, Util, Datatables,BaseView, 
			VacationModel, 
			VacationCollection,
			vacationTemplate,
			vacationInfoPopupTemplate){
	
	// 검색 조건 년도 
	function _getFormYears() {
		var startYear = 2000;
		var endYear= new Date().getFullYear() + 1;
		var years = [];
		
		for (; startYear <= endYear; endYear--) {
			years.push(endYear);
		}
		return  years;
	}

    var _vacationCollection = new VacationCollection();
    var _vacationDataTable = null;
    
	var VacationView = BaseView.extend({
        el:$(".main-container"),
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
    	    // event 설정
    	    this.listenTo(_vacationCollection, 'reset', this.onSetVacationDataTable);
    	},
    	events: {
    		'click #btnCreateData' : 'onClickCreateDataBtn',
    		'click #btnSearch' : 'onClickSearchBtn',
    		'click #btnUpdate' : 'onOpenVacationInfoPopup',
    		'click #vacationDataTable tbody tr': 'onSelectRow',
    		'click #vacationInfoPopup .btnUpdate': 'onUpdateVacationInfo'
    	},
    	render:function(){
    		var tpl = _.template( vacationTemplate, {variable: 'data'} )( {formYears: _getFormYears(), nowYear: new Date().getFullYear()} );
    		this.$el.append(tpl);

    		// 테이블 초기화
            _vacationDataTable = this.$el.find("#vacationDataTable").dataTable({
            	"bPaginate" : false,
     	        "columns" : [
     	            { data : "year", 			"title" : "년", visible: false},
     	            { data : "id", 				"title" : "사번" },
     	            { data : "dept_name", 		"title" : "부서" },
                    { data : "name", 			"title" : "이름" },
                    { data : "total_day", 		"title" : "연차 휴가" },
                    { data : "used_holiday", 	"title" : "사용 일수"},
                    { data : "holiday", 		"title" : "휴가 잔여 일수"}
     	        ]
     	    });

            // 데이터 조회
            this.selectVacations();
     	},
     	onClickCreateDataBtn : function() {// 연차 데이터 생성 버튼 
     		
     		var _this = this;
//     		$.post("/vacation", this.getSearchForm(), function(result) {
//     			_this.onClickSearchBtn();
//     		})
     		
     		var inData = this.getSearchForm();
     		
			var vacationModel = new VacationModel();
     		vacationModel.save(inData, {
				success: function(model, response) {
					_this.onClickSearchBtn();
				},
				error: function(model, res) {
					alert("데이터 생성이 실패했습니다.");
				}
			})     		
     		
     	},
     	onClickSearchBtn : function() {	// 연차 조회 
     		_vacationCollection.reset();
     		this.selectVacations();
     	},
     	onOpenVacationInfoPopup : function() {	// 연차 수정 팝업 창 
     		var table = this.$el.find("#vacationDataTable").DataTable();
     		var selectData = table.row('.selected').data();
     		
     		if ( Util.isNotNull(selectData) ) {
         		var tpl = _.template( vacationInfoPopupTemplate, {variable: 'data'} )( selectData );
         		this.$el.find('#vacationInfoPopup #vacationInfoPopupCon').empty().append(tpl);
         		this.$el.find('#vacationInfoPopup').modal('show');
     		} else {
     			alert("사원을 선택해주세요");
     		}
     	},
     	onSetVacationDataTable : function(result) {	// 연차 테이블 셋팅 
     		_vacationDataTable.fnClearTable();
     		if (result.length) {
     			_vacationDataTable.fnAddData(result.toJSON());
     			_vacationDataTable.fnDraw();
     		}
     	},
     	onSelectRow : function(evt) {	// 연차 선택
     		var $currentTarget = $(evt.currentTarget);
            if ( $currentTarget.hasClass('selected') ) {
            	$currentTarget.removeClass('selected');
            }
            else {
            	_vacationDataTable.$('tr.selected').removeClass('selected');
            	$currentTarget.addClass('selected');
            }
     	},
     	onUpdateVacationInfo : function(evt) {	// 연차 수정
     		var data = Util.getFormJSON( this.$el.find('#vacationInfoPopup').find("form") );
     		var reg = new RegExp('^\\d+$');
     		
     		if (!reg.test(data.total_day)) {
     			alert("숫자만 입력 가능합니다.");
     			return;
     		}
     		
     		var vacationModel = new VacationModel();
     		var _this = this;
     		data._id = data.id;
     		vacationModel.save(data, {
     			success: function(model, response) {
     				_this.$el.find('#vacationInfoPopup').modal('hide');
     				_this.onClickSearchBtn();
     			}, error : function(model, res){
     				alert("업데이트가 실패했습니다.");
     			}
     		});
     	},
     	getSearchForm: function() {	// 검색 조건  
     		return {year: this.$el.find("#selectYear").val()};
     	},
     	selectVacations: function() {	// 데이터 조회      		
     		_vacationCollection.fetch({
     			reset : true, 
     			data: this.getSearchForm(),
     			error : function(result) {
     				alert("데이터 조회가 실패했습니다.");
     			}
     		});     		
     	}
    });
    
    return VacationView;
});