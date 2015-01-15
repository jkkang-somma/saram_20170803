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
         'views/cm/popup/CommuteUpdatePopupView',
         'views/cm/popup/CommentPopupView',
         'models/cm/CommuteModel',
         'collection/cm/CommuteCollection',
         'text!templates/cm/commuteListTemplete.html'
], function($, _, Backbone, Util, Datatables, BaseView, 
		ChangeHistoryPopupView, CommuteUpdatePopupView, CommentPopupView,
		CommuteModel, CommuteCollection, commuteListTemplete) {

	// 분 -> 시간 
	function _getMinToHours(inMin) {
		if ( Util.isNotNull(inMin) ) {
			inMin = parseInt( inMin);				
			if (inMin === NaN) {
				inMin = 0;
			}	
		} else {
			inMin = 0;
		}
		var min = inMin % 60;
		var hours = inMin / 60;
		hours = parseInt(hours);
		
		min = (min == 0)? '': (" " + min + "분");
		hours = (hours == 0)? '': (hours + "시간");
		return hours + min;
	}	
	
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
	
	// comment Cell 페이지 링크 
	function _createCommentCell(cellData) {
		 var data = JSON.stringify({
			 idx : cellData.idx
		 });
		 var aHrefStr = "<a class='td-comment' data='" + data +"'  href='-' onclick='return false'>" + cellData.comment_count + " 건</a>";
		 return aHrefStr;
	}
	
	// comment Cell 추가 팝어 버튼 
	function _createCommentCellAddBtn(cellData, tpl) {
		 var data = JSON.stringify({
			 idx : cellData.idx
		 });
		 var tp = $(tpl);
		 tp.find(".btn").attr("data", data);
		 return tp.html();
	}
	
	// 변경 이력 팝업 뷰 
	var _changeHistoryPopupView = null;
	
	// 근태 자료 수정 팝업
	var _commuteUpdatePopupView = null;
	
	// comment 등록 팝업
	var _commentPopupView = null;
	
	var _commuteManageTbl = null;

	var commuteListView = BaseView.extend({
		el : $(".main-container"),
		events : {
			'click #btnSearch' : 'onClickSearchBtn',
			'click #btnUpdate' : 'onClickOpenCommuteUpdatePopup',
			'click #commuteManageTbl tbody tr': 'onSelectRow',
			'click #commuteManageTbl .td-in-out-time' : 'onClickOpenChangeHistoryPopup',
			'click #commuteManageTbl .btn-comment-add' : 'onClickOpenInsertCommentPopup'
		},
		initialize : function() {
			$(this.el).html('');
			$(this.el).empty();

			// 변경 이력 팝업 
    		_changeHistoryPopupView = new ChangeHistoryPopupView();
    		
			// 근태 자료 수정 팝업
			_commuteUpdatePopupView = new CommuteUpdatePopupView({parentView: this});
			
			// comment 등록 팝업
			_commentPopupView = new CommentPopupView({parentView: this});
			
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

			if (Util.isNotNull(_commuteUpdatePopupView) ) {
				_commuteUpdatePopupView.destroy();
				_commuteUpdatePopupView = null;
			}

			if (Util.isNotNull(_commentPopupView) ) {
				_commentPopupView.destroy();
				_commentPopupView = null;
			}
		},
		render : function() {
			var _this = this;
    		var tpl = _.template( commuteListTemplete, {} );
    		this.$el.append(tpl);
    		
    		// comment 추가 html 템플릿
    		var _btnCommuteAddTpl = this.$el.find('.btn-comment-add').html();    		
    		
    		_commuteManageTbl = this.$el.find("#commuteManageTbl").dataTable({
     	        columns : [
     	                   { data : "year", 			"title" : "년", visible: false},
     	                   { data : "date", "title" : "일자" },
     	                   { data : "department", "title" : "부서" },
     	                   { data : "id", "title" : "ID", visible: false },
     	                   { data : "name", "title" : "이름", 
     	                	   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
    	                            $(nTd).html(oData.name + "</br>(" +oData.id + ")");
    	                       }
     	                   },
     	                   { data : "work_type_name", "title" : "근무타입"},
     	                   { data : "vacation_name", "title" : "휴가 타입"},
     	                   { data : "out_office_name", "title" : "외근 정보"},
     	                   { data : "overtime_pay", "title" : "초과</br>근무수당",
     	                    	 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
       	                            $(nTd).html(oData.overtime_pay + " 원");
       	                        }
     	                   },
     	                   { data : "late_time", "title" : "지각시간"},
     	                   { data : "over_time", "title" : "초과</br>근무시간",
     	                	   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
     	                		   $(nTd).html(  _getMinToHours(oData.over_time));
     	                	   }
     	                   },
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
     	                    		 if (oData.out_time_change) {
     	                    			$(nTd).html( _createHistoryCell("out_time", oData) );
     	                    		 } else {
     	                    			$(nTd).html(oData.out_time);
     	                    		 }
     	                        }
     	                     },
     	                     { data : "comment_count", "title" : "Comment",
     	                    	 fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
     	                            if (oData.comment_count) {
     	                            	$(nTd).html(_createCommentCell(oData) + _createCommentCellAddBtn(oData, _btnCommuteAddTpl));
     	                            } else {
     	                            	$(nTd).html("0 건" + _createCommentCellAddBtn(oData, _btnCommuteAddTpl) );
     	                            }
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
     	                .column( 8 )
     	                .data()
     	                .reduce( function (a, b) {
     	                    return intVal(a) + intVal(b);
     	                }, 0 );

     	           var totalOvertime = api
	                .column( 10 )
	                .data()
	                .reduce( function (a, b) {
	                    return intVal(a) + intVal(b);
	                }, 0 );     	           
     	            
     	        	$(tfoot).find('th').eq(0).html("합계");
     	        	$(tfoot).find('th').eq(6).html(totalOvertimePay + " 원");	// 초과 근무 수당
     	        	$(tfoot).find('th').eq(8).html( _getMinToHours(totalOvertime));	// 초과 근무 시간
     	        }
     	    });
    		
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
		onClickSearchBtn : function(evt) {
			this.selectCommutes();
		},
		onClickOpenCommuteUpdatePopup: function(evt) {
     		var table = this.$el.find("#commuteManageTbl").DataTable();
     		var selectData = table.row('.selected').data();
     		
     		if ( Util.isNotNull(selectData) ) {
     			_commuteUpdatePopupView.show(selectData);
     		} else {
     			alert("사원을 선택해주세요");
     		}			
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
		onClickOpenChangeHistoryPopup : function(evt) {
			var dataStr = $(evt.currentTarget).attr('data');
			var searchData = JSON.parse(dataStr);
			_changeHistoryPopupView.show(searchData);
		},
		onClickOpenInsertCommentPopup: function(evt) {
			var data = JSON.parse( $(evt.currentTarget).attr('data') );
     		var table = this.$el.find("#commuteManageTbl").DataTable();

     		// 0부터 시작
     		var selectData = table.row(data.idx-1).data();
     		
     		_commentPopupView.show(selectData);
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