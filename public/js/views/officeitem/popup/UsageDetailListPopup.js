/**
 * 비품 상세조회 팝업창
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
        'collection/officeitem/OfficeItemDetailCollection',
        'core/BaseView',
        'models/sm/SessionModel',
        'views/component/ProgressbarView',
    	'views/officeitem/popup/UsageOfficeItemHistoryPopupView',
    	'text!templates/officeitem/usageHistoryTemplate2.html',
        'text!templates/default/content.html'
], function(
	$, _, Backbone, Util, Schemas,
	Grid, Dialog, Datatables, Code, Moment,
    OfficeItemDetailCollection,
	BaseView, SessionModel, ProgressbarView, UsageHistoryListPopup, usageHistoryTemplate2,
	ContentHTML
) {
    // 비품 컬럼 줄바꿈 처리 및 비품 이력 팝업 처리
    function _getTemplate(items) {
        if(items != undefined) {
            var wordArr = items.split(",");
            var itemList;
            var wordObj = {id:"", name:""};
            if (wordArr.length > 1) {
                for (var i=0; i < wordArr.length; i++) {
                    wordObj.id = wordArr[i];
                    wordObj.item = wordArr[i];
                    if(i==0) {
                        itemList = (SessionModel.get("user").admin == 9) ? _.template(usageHistoryTemplate2)(wordObj) : wordObj.item;
                    } else {
                        itemList = itemList + "</br>" + (SessionModel.get("user").admin == 9) ? _.template(usageHistoryTemplate2)(wordObj) : wordObj.item;
                    }
                }
                wordObj = {id:"", name:""};
                return itemList;
            }else{
                wordObj.id = items;
                wordObj.item = items;
                itemList = (SessionModel.get("user").admin == 9) ? _.template(usageHistoryTemplate2)(wordObj) : wordObj.item;
                wordObj = {id:"", name:""};
                return itemList;
            }
        }
        return "-";
    }

	var UsageDetailListPopup = Backbone.View.extend({
 		initialize : function(data) {
            //부서에게 제품이 할당된 경우
			this.paramId = (data.id == "") ? "" : data.id;
			this.paramDept = (data.id == "") ? data.dept : "";
			this.officeItemDetailCollection = new OfficeItemDetailCollection();
			this.gridOption = {
    		    el:"UsedDetailList_content",
    		    id:"UsedDetailListGrid",
    		    column:[
    		    	{data : "category_name", "title" : "장비구분"},
    		        {data : "serial_yes", "title" : "관리번호",
                    	render: function(data) {
                            return _getTemplate(data);
                        }
            		},
                    {data : "model_no", "title" : "모델명"},
                    {data : "buy_date", "title" : "구입일"},
     	        ],
     	        detail: true,
    		    collection:this.officeItemDetailCollection,
    		    buttons:["search"],
    		    fetch: false,

    		};
		},
		events: {
 		    'view:rendered' : 'renderGrid'

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
            //$(_this.el[0].parentElement.parentElement.parentElement.parentElement.parentElement).css('width', 1000);
			this.officeItemDetailCollection.fetch({
                data: {user : _this.paramId, dept : _this.paramDept},
				success: function(result) {
				 	_this.grid.render();
				 	_this.progressbar.disabledProgressbar(true);
				 	$("#UsedDetailListGrid .history-detail-popup").click(function(evt) {
                         _this.onClickHistoryOnPopupWindow(evt);
                    });
				},
				error : function(result) {
					alert("데이터 조회가 실패했습니다.");
				}
			});
		},

        onClickHistoryOnPopupWindow: function(evt) {
            evt.stopPropagation();
            var data = JSON.parse( $(evt.currentTarget).attr('data') );
            var usageHistoryPopupView = new UsageHistoryListPopup(data.id);

            Dialog.show({
                title: "("+data.id+") 이력",
                content: usageHistoryPopupView,
                size: 'size-wide',
                buttons: [{
                    label : "닫기",
                    action : function(dialog){
                        dialog.close();
                    }
                }]
            });
        }
	});
	
	return UsageDetailListPopup;
});