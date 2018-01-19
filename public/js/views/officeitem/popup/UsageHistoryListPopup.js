/**
 * 비품 이력 팝업창
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
        'code',
        'cmoment',
        'collection/rm/ApprovalCollection',
        'core/BaseView',
        'views/component/ProgressbarView',
        'text!templates/default/content.html',
], function(
	$, _, Backbone, Util, Schemas,
	Grid, Dialog, Datatables, Code, Moment,
	ApprovalCollection,
	BaseView, ProgressbarView,
	ContentHTML
) {

	var UsageHistoryListPopup = Backbone.View.extend({
		initialize : function(data) {
			this.searchData = data;
			this.approvalCollection = new ApprovalCollection();
			this.gridOption = {
    		    el:"UsedHolidayList_content",
    		    id:"UsedHolidayListGrid",
    		    column:[
    		         {"title" : "근태기간",
                         render:function (data, type, row, meta){
                             if(row.start_date == row.end_date){
                                 return row.start_date;
                             }else{
                                 return row.start_date + "<br> ~ " + row.end_date;
                             }
                         }
                    },
    		        { data : "office_code", "title" : "구분",
                        render: function (data, type, rowData, meta) {
                            return Code.getCodeName(Code.OFFICE, data);
                        }
                    },
                    {data : "day_count", "title" : "일수"},
                    
                    {data : "submit_comment", "title" : "비고",
                        render : function(data,type,rowData, meta){
                            var memo = rowData.submit_comment; 
 			        		   if (memo.length > 10) {
 			        			  memo = memo.substring(0, 10) + "...";
 			        		   }
 			        		   return memo;
                         }
                     },
     	        ],
     	        detail: true,
    		    collection:this.approvalCollection,
    		    buttons:["search"],
    		    fetch: false
    		};
		},
		events: {
		    'view:rendered' : "renderGrid"
		},
		render: function(el) {
			var dfd= new $.Deferred();
			
			if (!_.isUndefined(el)) this.el=el;
			
			var _content=$(ContentHTML).attr("id", this.gridOption.el);
			$(this.el).html(_content);

			var _gridSchema=Schemas.getSchema('grid');
		    this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
			dfd.resolve(this);
			
    	    this.progressbar = new ProgressbarView();
			$(this.el).append(this.progressbar.render());
			this.progressbar.disabledProgressbar(false);
		    return dfd.promise();				
		},
		
		afterRender : function(){
			var _this = this;
			this.approvalCollection.fetch({ 
				data: _this.searchData,
				success: function(result) {
				 	_this.grid.render();
				 	_this.progressbar.disabledProgressbar(true);
				},
				error : function(result) {
					alert("데이터 조회가 실패했습니다.");
				}
			});
		}
	});
	
	return UsageHistoryListPopup;
});