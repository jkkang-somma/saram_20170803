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
		 
 		 var aHrefStr = "<a class='td-in-out-time' data='" + data +"'  href='-' onclick='return false'>" + cellData[cellType] + "</a>";
 		 return aHrefStr;
	}
	
	// 변경 이력 팝업 뷰 
	var _changeHistoryPopupView = null;
	var _commuteManageTbl = null;

	var commuteListView = BaseView.extend({
		el : $(".main-container"),
		events : {
			'click #btnSearch' : 'onClickSearchBtn',
			'click #commuteManageTbl tbody tr': 'onSelectRow',
			'click #commuteManageTbl .td-in-out-time' : 'onClickInOutTimeCell'
		},
		initialize : function() {
			$(this.el).html('');
			$(this.el).empty();
			
			this.collection = new CommuteCollection();

			// event 설정
    	    this.listenTo(this.collection, 'reset', this.onSetCommuteDataTable);    	    
		},
		destroy : function() {
			if (Util.isNotNull(_commuteManageTbl) ) {
				this.$el.find("#commuteManageTbl").DataTable().destroy();
				_commuteManageTbl = null;
			}
			
			if (Util.isNotNull(_changeHistoryPopupView) ) {
				_changeHistoryPopupView.destroy();
				_changeHistoryPopupView = null;
			}
		},
		render : function() {
			var _this = this;
    		var tpl = _.template( commuteListTemplete, {} );
    		this.$el.append(tpl);
    		
    		_commuteManageTbl = this.$el.find("#commuteManageTbl").dataTable({
     	        columns : [
     	                     { data : "date", "title" : "일자" },
     	                     { data : "department", "title" : "부서" },
     	                     { data : "id", "title" : "ID" },
     	                     { data : "name", "title" : "이름"},
     	                     { data : "work_type", "title" : "근무타입"},
     	                     { data : "vacation_name", "title" : "휴가 타입"},
     	                     { data : "out_office_name", "title" : "외근 정보"},
     	                     { data : "overtime_pay", "title" : "초과근무수당"},
     	                     { data : "late_time", "title" : "지각시간"},
     	                     { data : "over_time", "title" : "초과근무시간 (분)"},
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
     	        footerCallback: function( tfoot, data, start, end, display ) {
     	            var api = this.api(), data;
     	           
     	            // Remove the formatting to get integer data for summation
     	            var intVal = function ( i ) {
     	                return typeof i === 'string' ?
     	                    i.replace(/[\$,]/g, '')*1 :
     	                    typeof i === 'number' ?
     	                        i : 0;
     	            };

     	            // Total over this page
     	           var totalOvertimePay = api
     	                .column( 7, { page: 'current'} )
     	                .data()
     	                .reduce( function (a, b) {
     	                    return intVal(a) + intVal(b);
     	                }, 0 );

     	           var totalOvertime = api
	                .column( 9, { page: 'current'} )
	                .data()
	                .reduce( function (a, b) {
	                    return intVal(a) + intVal(b);
	                }, 0 );     	           
     	            
     	            
     	        	$(tfoot).find('th').eq(0).html("합계");
     	        	$(tfoot).find('th').eq(7).html(totalOvertimePay);	// 초과 근무 수당
     	        	$(tfoot).find('th').eq(9).html(totalOvertime);	// 초과 근무 시간
     	        }
     	    });
    		
    		 // 변경 이력 팝업 
    		_changeHistoryPopupView = new ChangeHistoryPopupView();    		
			this.$el.find('#changeHistoryPopupCon').append( _changeHistoryPopupView.el );
			
    		// 기본 검색 날짜 설정
    		this.$el.find('#startDate').val( _getFormattedDate(new Date()));
    		this.$el.find('#endDate').val( _getFormattedDate(new Date()));
    		
    		// 검색
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
		onSelectRow: function(evt) {	// row 선택
     		var $currentTarget = $(evt.currentTarget);
            if ( $currentTarget.hasClass('selected') ) {
            	$currentTarget.removeClass('selected');
            }
            else {
            	_commuteManageTbl.$('tr.selected').removeClass('selected');
            	$currentTarget.addClass('selected');
            }
		},
		onClickInOutTimeCell : function(evt) {
			var dataStr = $(evt.currentTarget).attr('data');
			var searchData = JSON.parse(dataStr);
			_changeHistoryPopupView.show(searchData);
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