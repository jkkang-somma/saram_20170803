/**
 * 근태 자료 관리
 */

define([ 'jquery',
         'underscore',
         'backbone',
         'util',
         'datatables',
         'core/BaseView',
         'views/cm/popup/ChangeHistoryPopupView',
         'models/cm/CommuteModel',
         'collection/cm/CommuteCollection',
         'text!templates/cm/commuteListTemplete.html'
], function($, _, Backbone, Util, Datatables, BaseView, ChangeHistoryPopupView, CommuteModel, CommuteCollection, commuteListTemplete) {

	// Date 형 날짜를 yyyy-mm-dd 형식으로 반환
	function _getFormattedDate(date) {
	    return date.getFullYear()
	        + "-"
	        + ("0" + (date.getMonth() + 1)).slice(-2)
	        + "-"
	        + ("0" + date.getDate()).slice(-2);
	}
	
	// 출퇴근 시간 셀 생성
	function _createHistoryCell(cellType, cellData) {
		 var data = JSON.stringify({
			 change_column : cellType,
			 id : cellData.id,
			 year : cellData.year,
			 date : cellData.date
 		 });
		 
 		 var aHrefStr = "<a class='td-in-out-time' data='" + data +"'  href='-' onclick='return false'>" + cellData.in_time + "</a>";
 		 return aHrefStr;
	}
	
	// 변경 이력 팝업 뷰 
	var _changeHistoryPopupView = null;
	
	var _commuteManageTbl = null;

	var commuteListView = BaseView.extend({
		el : $(".main-container"),
		events : {
			'click #btnSearch' : 'onClickSearchBtn',
			'click .td-in-out-time' : 'onClickInOutTimeCell',
			'click #btnCloseChangeHistoryPopup' : 'onCloseChangeHistoryPopup'
		},
		initialize : function() {
			$(this.el).html('');
			$(this.el).empty();
			
			this.collection = new CommuteCollection();

			// event 설정
    	    this.listenTo(this.collection, 'reset', this.onSetCommuteDataTable);    	    
		},
		render : function() {
			var _this = this;
    		var tpl = _.template( commuteListTemplete, {} );
    		this.$el.append(tpl);
    		
    		_commuteManageTbl = this.$el.find("#commuteManageTbl").dataTable({
            	"bPaginate" : false,
     	        "columns" : [
     	                     { data : "date", "title" : "일자" },
     	                     { data : "department", "title" : "부서" },
     	                     { data : "id", "title" : "ID" },
     	                     { data : "name", "title" : "이름"},
     	                     { data : "work_type", "title" : "근무타입"},
     	                     { data : "vacation_name", "title" : "휴가 타입"},
     	                     { data : "out_office_name", "title" : "외근 정보"},
     	                     { data : "overtime_pay", "title" : "초과근무수당"},
     	                     { data : "late_time", "title" : "지각시간"},
     	                     { data : "over_time", "title" : "초과근무시간"},
     	                     { data : "in_time", "title" : "출근시간",
     	                    	 fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
     	                    		 if (oData.in_time_change){
     	                    			$(nTd).html( _createHistoryCell("in_time", oData) );
     	                    		 } else {
     	                    			$(nTd).html(oData.in_time);
     	                    		 }
     	                        }
     	                     },
     	                     { data : "out_time", "title" : "퇴근시간",
     	                    	 fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
     	                    		 if (oData.out_time) {
     	                    			$(nTd).html( _createHistoryCell("out_time", oData) );
     	                    		 } else {
     	                    			$(nTd).html(oData.out_time);
     	                    		 }
     	                        }
     	                     },
     	                     { data : "comment_count", "title" : "Comment",
     	                    	 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {     	                    		 
     	                            $(nTd).html(oData.comment_count + " 건");
     	                        }
     	                     },
     	                     { data : "in_time_change", "title" : "in_time_change", visible: false},
     	                     { data : "out_time_change", "title" : "out_time_change", visible: false}     	                    
     	        ],
     	       "footerCallback": function ( row, data, start, end, display ) {
     	    	   console.log(data);
     	       }
     	    });
    		
    		this.$el.find('#startDate').val( _getFormattedDate(new Date()));
    		this.$el.find('#endDate').val( _getFormattedDate(new Date()));

    		this.selectCommutes();
		},
		onSetCommuteDataTable : function(result) {
			_commuteManageTbl.fnClearTable();
     		if (result.length) {
     			_commuteManageTbl.fnAddData(result.toJSON());
     			_commuteManageTbl.fnDraw();
     		}
		},
		onClickSearchBtn : function(event) {
			this.selectCommutes();
		},
		onClickInOutTimeCell : function(evt) {
			var dataStr = $(evt.currentTarget).attr('data');
			
			var data = JSON.parse(dataStr);
     		//var tpl = _.template( vacationInfoModalTemplate, {variable: 'data'} )( selectData );
     		//this.$el.find('#changeHistoryModal #vacationInfoModalCon').empty().append(tpl);
			
			_changeHistoryPopupView = new ChangeHistoryPopupView( {searchData: data});

			this.$el.find('#changeHistoryModal #changeHistoryModalCon').append( _changeHistoryPopupView.el );
     		this.$el.find('#changeHistoryModal').modal('show');
		},
		onCloseChangeHistoryPopup: function(evt) {
			if (Util.isNotNull(_changeHistoryPopupView) ) {
				_changeHistoryPopupView.destroy();
				_changeHistoryPopupView = null;
			}
		},
     	getSearchForm: function() {	// 검색 조건
     		
     		var data = Util.getFormJSON( this.$el.find('.form-inline'));
     		
     		if ( Util.isNull(data.startDate) ) {
     			alert("검색 시작 날짜를 선택해주세요");
     			return null;
     		} else if ( Util.isNull(data.endDate) ) {
     			alert("검색 끝 날짜를 선택해주세요");
     			return null;
     		}
     		
     		return data;
     	},
     	selectCommutes: function() {	// 데이터 조회
     		var data = this.getSearchForm();     		
     		if (Util.isNull (data) ) {
     			return;
     		}

     		this.collection.fetch({
     			reset : true, 
     			data: data,
     			error : function(result) {
     				alert("데이터 조회가 실패했습니다.");
     			}
     		});     		
     	}
	});
	return commuteListView;
});