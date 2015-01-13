/**
 * 변경 이력
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
			this.render(opt.searchData);
		},
		events : {
		},
		render : function(data) {
			var title = "";
			if (data.change_column == "in_time") {
				title = "출근 시간 변경 이력";
			} else {
				title = "퇴근 시간 변경 이력";
			}
			
			var tpl = _.template(changeHistoryPopupTemplate, {variable: 'data'})( {title: title} );
			this.setElement( tpl);

			_changeHistoryTbl = this.$el.find("#commuteManageTbl").dataTable({
            	"bPaginate" : false,
     	        "columns" : [
     	                     { data : "date", "title" : "일자" },
     	                     { data : "id", "title" : "ID" },
     	                     { data : "name", "title" : "이름"},
     	                     { data : "change_column", "title" : "변경 필드"},
     	                     { data : "change_before", "title" : "변경 전"},
     	                     { data : "change_after", "title" : "변경 후"},
     	                     { data : "change_date", "title" : "수정 날짜"},
     	                     { data : "change_id", "title" : "수정 ID"}     	                    
     	        ]
     	    });
    		
			
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
			
			return this;
		},
		destroy: function() {
			 $('#commuteManageTbl').DataTable().destroy();
			 
			_changeHistoryTbl = null;
			this.remove();
		}
	});
	
	return ChangeHistoryPopupView;
});