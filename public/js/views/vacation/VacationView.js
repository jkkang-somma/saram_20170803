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
  'text!templates/default/right.html',
  'text!templates/default/button.html',
  'text!templates/layout/default.html',
  'models/vacation/VacationModel',
  'collection/vacation/VacationCollection',
  'views/vacation/popup/UpdateVacationPopup',
  'text!templates/vacation/vacationInfoPopupTemplate.html',
  'text!templates/vacation/searchFormTemplate.html'
], function($,
		_,
		Backbone, 
		Util, 
		Schemas,
		Grid,
		Dialog,
		Datatables,
		BaseView,
		HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML,
		VacationModel, 
		VacationCollection,
		UpdateVacationPopup,
		vacationInfoPopupTemplate,
		searchFormTemplate){
	
//	// 검색 조건 년도 
	function _getFormYears() {
		var startYear = 2000;
		var endYear= new Date().getFullYear() + 1;
		var years = [];
		
		for (; startYear <= endYear; endYear--) {
			years.push(endYear);
		}
		return  years;
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
             	            { data : "id", 				"title" : "사번" },
             	            { data : "dept_name", 		"title" : "부서" },
                            { data : "name", 			"title" : "이름" },
                            { data : "total_day", 		"title" : "연차 휴가" },
                            { data : "used_holiday", 	"title" : "사용 일수" },
                            { data : "holiday", 		"title" : "휴가 잔여 일수111"},
                            { data : "memo", 			"title" : "Memo",
                            	render: function(data, type, full, meta) {
                            		var tpl = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>';
                            		if (full.memo == '' ) {
                            			tpl = '<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>';
                            		}
                            		return tpl;
    			        		}
                            }
             	        ],
        		    collection:this.vacationCollection,
        		    detail: true,
        		    buttons:["search"],
        		    fetch: true
        	};    		
    		this.buttonInit();
    	},
    	events: {
    		'click #btnCreateData' : 'onClickCreateDataBtn',
        	'click #btnSearch' : 'onClickSearchBtn'
    	},
    	buttonInit: function(){
    	    var that = this;
    	    // tool btn
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"edit",
    	        click:function(_grid){
    	        	var selectItem =_grid.getSelectItem();
    	            var updateVacationPopup = new UpdateVacationPopup(selectItem);
    	            Dialog.show({
    	                title:"연차 수정", 
                        content: updateVacationPopup,
                        buttons: [{
                            id: 'updateVacationBtn',
                            cssClass: Dialog.CssClass.SUCCESS,
                            label: '수정',
                            action: function(dialog) {
                            	updateVacationPopup.onUpdateVacationInfo({
                            		success: function(model, response) {
                            			Dialog.show("성공", function() {
                            				dialog.close();
                            				that.selectVacation();
                            			})
                                 	}, error : function(model, res){
                                 		alert("업데이트가 실패했습니다.");
                                 	}
                                });
                            }
                        }, {
                            label : "취소",
                            action : function(dialog){
                                dialog.close();
                            }
                        }]
    	            })
    	        }
    	    });
    	},
    	selectVacation: function() {
            var _this = this;
     		this.vacationCollection.fetch({ 
     			data: _this.getSearchForm(),
	 			success: function(result) {
	 				_this.grid.render();
	 			},
	 			error : function(result) {
	 				alert("데이터 조회가 실패했습니다.");
	 			}
     		});            
    	},
    	render:function(){
    	    //var _view=this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"연차 관리 ", subTitle:"연차 관리"})));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
      	    
    	    var searchForm = _.template( searchFormTemplate, {variable: 'data'} )( {formYears: _getFormYears(), nowYear: new Date().getFullYear()} );

    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    _layOut.append(_head);
    	    _layOut.append(searchForm);
    	    _layOut.append(_content);
    	      	    
    	    $(this.el).html(_layOut);

    	    var _gridSchema=Schemas.getSchema('grid');
    	    this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
            this.grid.render();

            this.selectVacation();
            return this;
     	},
     	onClickCreateDataBtn: function(evt) {
      		var _this = this;
     		var inData = this.getSearchForm();
     		
			var vacationModel = new VacationModel();
     		vacationModel.save(inData, {
				success: function(model, response) {
					var msg = "전체 : " + response.totalCount + " / 성공: " +response.successCount + " /실패 : " + response.failCount; 
        			Dialog.show(msg, function() {
        				_this.selectVacation();
        			});
        			
        			console.log(response.error);
				},
				error: function(model, res) {
        			Dialog.show("데이터 생성 실패", function() {
        				dialog.close();
        				_this.selectVacation();
        			});
				}
			});
     	},
     	onClickSearchBtn: function(evt) {
     		this.selectVacation();
     	},
     	getSearchForm: function() {	// 검색 조건  
     		return {year: this.$el.find("#selectYear").val()};
     	}
    });
    
    return VacationView;
});