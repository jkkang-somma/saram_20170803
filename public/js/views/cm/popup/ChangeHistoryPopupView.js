/**
 * 변경 이력 팝업창 
 */

define([ 
        'jquery',
        'underscore',
        'backbone',
        'util',
        'schemas',
        'grid',
        'dialog',
        'datatables',
        'moment',
        'core/BaseView',
        'text!templates/default/content.html',
        'models/cm/ChangeHistoryModel',
        'collection/cm/ChangeHistoryCollection'
], function(
		$,
		_,
		Backbone,
		Util,
		Schemas,
		Grid,
		Dialog,
		Datatables,
		Moment,
		BaseView,
		ContentHTML,
		ChangeHistoryModel, ChangeHistoryCollection) {

	var _changeHistoryTbl = null;	
	var ChangeHistoryPopupView = Backbone.View.extend({
		initialize : function(data) {
			this.searchData = data;
			this.changeHistoryCollection = new ChangeHistoryCollection();
    		this.gridOption = {
        		    el:"changeHistoryDataTable_content",
        		    id:"changeHistoryDataTable",
        		    column:[
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
             	        ],
        		    collection:this.changeHistoryCollection,
        		    detail: true,
        		    buttons:["search","refresh"],
        		    fetch: false
        	};
		},
		render: function(el) {
			var dfd= new $.Deferred();
			
			if (!_.isUndefined(el)) this.el=el;
			
			var _content=$(ContentHTML).attr("id", this.gridOption.el);
			console.log(_content);
			$(this.el).html(_content);

			var _gridSchema=Schemas.getSchema('grid');
    	    this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
            this.grid.render();

            this.selectChangeHistory();
			

            dfd.resolve();
            return dfd.promise();			
		},
		selectChangeHistory: function() {
			var _this = this;
     		this.changeHistoryCollection.fetch({ 
     			data: _this.searchData,
	 			success: function(result) {
	 				_this.grid.render();
	 			},
	 			error : function(result) {
	 				alert("데이터 조회가 실패했습니다.");
	 			}
     		});
     		
     		
		}
	});
	
	return ChangeHistoryPopupView;
});