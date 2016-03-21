define([
  'jquery',
  'underscore',
  'backbone',
  'util',
  'schemas',
  'grid',
  'dialog',
  'datatables',
  'core/BaseView',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/layout/default.html',
  'text!templates/default/row.html',
  'text!templates/default/rowbuttoncontainer.html',
  'text!templates/default/rowbutton.html',
  'text!templates/default/rowcombo.html',
  'models/sm/SessionModel',
  'models/vacation/VacationModel',
  'collection/vacation/VacationCollection',
  //'views/component/ProgressbarView',
  'views/vacation/popup/UpdateVacationPopup',
  'views/vacation/popup/UsedHolidayListPopup',
  'text!templates/vacation/vacationInfoPopupTemplate.html',
  'text!templates/vacation/searchFormTemplate.html',
  'text!templates/vacation/vacationlist.html'
], function(
	$, _, Backbone, Util, Schemas,
	Grid, Dialog, Datatables,
	BaseView,
	HeadHTML, ContentHTML, LayoutHTML,
	RowHTML, RowButtonContainerHTML, RowButtonHTML, RowComboHTML,

	SessionModel, VacationModel, 
	VacationCollection, 
	
	// ProgressbarView,
	
	UpdateVacationPopup, UsedHolidayListPopup,
	vacationInfoPopupTemplate, searchFormTemplate, vacationListTemplate){
	
	// 휴가 편집 버튼 
	function _getVacationUpdateBtn(that) {
		return {
	        type:"custom",
	        name: (SessionModel.get("user").admin == 1)?"edit" : "read",
	        tooltip: (SessionModel.get("user").admin == 1)?"수정" : "상세보기",
	        click:function(_grid){
	        	var selectItem =_grid.getSelectItem();
	        	if ( Util.isNull(selectItem) ) {
        			Dialog.warning("사원을 선택 하여 주시기 바랍니다.");
        			return;
	        	}
	        	
	            var updateVacationPopup = new UpdateVacationPopup(selectItem);
	            var buttons = [];
	            if(SessionModel.get("user").admin == 1) { // 관리자만 수정 가능
	            	buttons.push({
                        id: 'updateVacationBtn',
                        cssClass: Dialog.CssClass.SUCCESS,
                        label: '수정',
                        action: function(dialog) {
                        	updateVacationPopup.onUpdateVacationInfo({
                        		success: function(model, response) {
                        			model.initHoliday(); // 휴가 잔여 일수 재 설정
                        			Dialog.show("성공", function() {
                        				dialog.close();
                        				that.grid.updateRow(model.attributes);
                        			});
                             	}, error : function(model, res){
                             		alert("업데이트가 실패했습니다.");
                             	}
                            });
                        }
                    });
	            }
	            buttons.push({
                    label : "취소",
                    action : function(dialog){
                        dialog.close();
                    }
                });
	            
	            Dialog.show({
	                title: (SessionModel.get("user").admin == 1)?"연차 수정" : "연차 정보", 
                    content: updateVacationPopup,
                    buttons: buttons
	            });
	        }
	    };
	}
    
	var VacationView = BaseView.extend({
        el:$(".main-container"),
    	initialize:function(){
    		this.vacationCollection = new VacationCollection();
    		this.gridOption = {
        		    el:"vacationDataTable_content",
        		    id:"vacationDataTable",
        		    column:[
             	            { data : "year", 			"title" : "년" },
             	            { data : "dept_name", 		"title" : "부서" },
                            { data : "name", 			"title" : "이름"},
                            { data : "total_day", 		"title" : "연차 휴가" },
                            { data : "used_holiday", 	"title" : "사용 일수",
                            	render: function(data, type, full, meta){
									var obj = {
										id : full.id,
										year : full.year,
										name: full.name,
										used_holiday : full.used_holiday
									};
									var tpl = _.template(vacationListTemplate)(obj);
									return tpl;
                            	}
                            },
                            { data : "holiday", 		"title" : "휴가 잔여 일수"},
                            { data : "memo", 			"title" : "Memo",
      			        	   render: function(data, type, full, meta) {
     			        		   var memo = full.memo; 
     			        		   if (memo.length > 10) {
     			        			  memo = memo.substring(0, 10) + "...";
     			        		   }
     			        		   return memo;
     			        	   }
                            }
             	        ],
             	    dataschema:["year", "dept_name", "name", "total_day", "used_holiday", "holiday", "memo"],
        		    collection:this.vacationCollection,
        		    detail: true,
        		    buttons:["search", {
        		    	type:"myRecord",
				        name: "myRecord",
				        filterColumn:["name"], //필터링 할 컬럼을 배열로 정의 하면 자신의 아이디 또는 이름으로 필터링 됨. dataschema 에 존재하는 키값.
				        tooltip: "",
        		    }],
        		    fetch: false,
        		    order:[[3, "asc"]]
        	};
        
    		this.buttonInit();
    	},
    	events: {
    		'click #btnCreateData' : 'onClickCreateDataBtn',
        	"change #vcCombo" : 'selectVacation',
        	'click #vacationDataTable .td-used-holiday' : 'onClickUsedHolidayPopup',
    	},
    	buttonInit: function(){
    	    var that = this;
    	    // tool btn
    	    this.gridOption.buttons.push(_getVacationUpdateBtn(that));
    	},
    	selectVacation: function() {
    		var _this = this;
    		Dialog.loading({
                action:function(){
                    var dfd = new $.Deferred();
                    _this.vacationCollection.fetch({ 
		     			data: _this.getSearchForm(),
			 			success: function(result) {
			 				dfd.resolve();
			 			},
			 			error : function(result) {
			 				dfd.reject();
			 			}
		     		});
		     		return dfd.promise();
        	    },
        	    
                actionCallBack:function(res){//response schema
                    _this.grid.render();
                },
                errorCallBack:function(response){
                    Dialog.error("데이터 조회가 실패했습니다.");
                },
            });
    	},
    	render:function(){
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"사원 관리", subTitle:"연차 관리"})));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
 
    	    var isShowCreateBtn = false;
    	    if (SessionModel.get("user").admin == 1 ) {
    	    	isShowCreateBtn = true;
    	    }
    	    
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    	
        	var _row=$(RowHTML);
    	    var _btnContainer = $(_.template(RowButtonContainerHTML)({
    	            obj: {id: "vcBtnContainer"}
    	        })
    	    );
	        
	        var _combo = $(_.template(RowComboHTML)({
    	            obj : { id : "vcCombo", label : "연도"}
    	        })
	        );
	        
    	    if(isShowCreateBtn){
	        	var _createBtn = $(_.template(RowButtonHTML)({
	    	            obj: { id: "btnCreateData", label: "자료생성"}
	    	        })
		        );	
		        _btnContainer.append(_createBtn);
	        }
	        
	        _row.append(_combo);
    	    _row.append(_btnContainer);
    	    
    	    _layOut.append(_head);
			_layOut.append(_row);
    	    _layOut.append(_content);
    	    
    	    $(this.el).html(_layOut);

			var today = new Date();
		    var year = today.getFullYear();
			for(var i=-1; i < 5; i++){
     	        $(this.el).find("#vcCombo").append("<option>"+(year + i)+"</option>");
     	    }
     	    $(this.el).find("#vcCombo").val(year);
     	    
    	    var _gridSchema=Schemas.getSchema('grid');
    	    this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
            this.grid.render();

            this.selectVacation();
            return this;
     	},
     	onClickCreateDataBtn: function(evt) {
      		var _this = this;
     		var inData = this.getSearchForm();
     		
     		Dialog.loading({
                action:function(){
                    var dfd = new $.Deferred();
                    var vacationModel = new VacationModel();
		     		vacationModel.save(inData, {
						success: function(model, response) {
							dfd.resolve(response);
						},
						error: function(model, res) {
		        			dfd.reject();
						}
					});
		     		return dfd.promise();
        	    },
                actionCallBack:function(response){//response schema
					var msg = "전체 : " + response.totalCount + " / 성공: " +response.successCount + " /실패 : " + response.failCount; 
        			Dialog.show(msg, function() {
        				_this.selectVacation();
        			});
                },
                errorCallBack:function(response){
                    Dialog.warning("Error: " + response["error"]);
                },
            });
			
     	},
     	getSearchForm: function() {	// 검색 조건  
     		return {year: this.$el.find("#vcCombo").val()};
     	},
     	onClickUsedHolidayPopup: function(evt) {
			var data = JSON.parse( $(evt.currentTarget).attr('data') );
			
            var changeHistoryPopupView = new UsedHolidayListPopup(data);
            Dialog.show({
                title: "사용 휴가 리스트 ("+data.name+")", 
                content: changeHistoryPopupView,
                buttons: [{
                    label : "닫기",
                    action : function(dialog){
                        dialog.close();
                    }
                }]
            });
     	},
    });
    return VacationView;
});