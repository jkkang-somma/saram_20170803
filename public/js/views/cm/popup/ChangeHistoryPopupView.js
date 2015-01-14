/**
 * 변경 이력 팝업창 
 */

define([ 'jquery',
         'underscore',
         'backbone',
         'util',
         'datatables',
         'core/BaseView',
         'models/cm/ChangeHistoryModel',
         'collection/cm/ChangeHistoryCollection',
         'text!templates/cm/popup/changeHistoryPopupTemplate.html'
], function($, _, Backbone, Util, Datatables, BaseView, ChangeHistoryModel, ChangeHistoryCollection, changeHistoryPopupTemplate) {

	var _changeHistoryTbl = null;	
	var ChangeHistoryPopupView = Backbone.View.extend({
		initialize : function(opt) {
			this.collection = new ChangeHistoryCollection();
		},
		events : {
			'hidden.bs.modal' : 'onCloseChangeHistoryPopup'
		},
		render : function(data) {			
			var tpl = _.template(changeHistoryPopupTemplate, {variable: 'data'})( {title: ""} );
			this.setElement( tpl);

			_changeHistoryTbl = this.$el.find("#changeHistoryTbl").dataTable({
            	"bPaginate" : false,
     	        "columns" : [
     	                     { data : "date", "title" : "일자" },
     	                     { data : "id", "title" : "ID", visible: false },
     	                     { data : "name", "title" : "이름",
     	                    	 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
     	                    		 $(nTd).html(oData.name + "</br>(" +oData.id + ")");
     	                    	}
     	                     },
     	                     { data : "change_before", "title" : "변경 전"},
     	                     { data : "change_after", "title" : "변경 후"},
     	                     { data : "change_date", "title" : "수정 날짜"},
     	                     { data : "change_name", "title" : "수정자 이름",
     	                    	 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
     	                    		 $(nTd).html(oData.change_name + "</br>(" +oData.change_id + ")");
     	                    	}

     	                     }     	                    
     	        ]
     	    });

			var title = (data.change_column == "in_time")? "출근 시간 변경 이력":"퇴근 시간 변경 이력";
			this.$el.find('.modal-title').text(title);
			this.selectChangeHistory(data);

			return this;
		},
		selectChangeHistory: function(data) {
     		this.collection.fetch({
	 			reset : true, 
	 			data: data,
	 			success : function(result) {
	 				_changeHistoryTbl.fnClearTable();
	 	     		if (result.length) {
	 	     			_changeHistoryTbl.fnAddData(result.toJSON());
	 	     			_changeHistoryTbl.fnDraw();
	 	     		}
	 			},
	 			error : function(result) {
	 				alert("데이터 조회가 실패했습니다.");
	 			}
     		});
		},
		show: function(data) {
			this.render(data);
			this.$el.modal('show');			
		},
		onCloseChangeHistoryPopup: function() {
			this.remove();
		},
		destroy: function() {
			 $('#changeHistoryTbl').DataTable().destroy();
			_changeHistoryTbl = null;
		}
	});
	
	return ChangeHistoryPopupView;
});