define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'dialog',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/default/right.html',
  'text!templates/default/button.html',
  'text!templates/layout/default.html',
  'text!templates/inputForm/forminline.html',
  'text!templates/inputForm/combobox.html',
  'text!templates/inputForm/label.html',
  'collection/common/HolidayCollection',
  'models/common/HolidayModel',
  'views/Holiday/popup/CreateHolidayPopup',
  'views/Holiday/popup/AddHolidayPopup',
], function($, _, Backbone, BaseView, Grid, Schemas, Dialog,
HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML, InlineFormHTML, ComboBoxHTML, LabelHTML,
HolidayCollection, HolidayModel,
CreateHolidayPopup, AddHolidayPopup){

    
    
    var holidayManagerView = BaseView.extend({
        el:".main-container",
        
    	initialize:function(){
    	    this.holidayCollection = new HolidayCollection();
    	    
    		this.gridOption = {
    		    el:"holidayList_content",
    		    id:"holidayListTable",
    		    column:["날짜", "내용"],
    		    dataschema:["date", "memo"],
    		    collection:this.holidayCollection,
    		    detail: true,
    		    fetch:false,
    		    buttons:["search"],
    		    order: [[1,"asc"]]
    		};
    		
            this._buttonInit();
    	},
    	events : {
            "change #holidayYearCombo" : "_renderTable"
        },
    	_addAddBtn: function(){
    	    var that = this;
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"add",
    	        tooltip:"추가",
    	        click:function(){
    	            var addHolidayPopup = new AddHolidayPopup();
    	            Dialog.show({
    	                title:"휴일 추가", 
                        content:addHolidayPopup, 
                        buttons: [{
                            id: 'addHolidayBtn',
                            cssClass: Dialog.CssClass.SUCCESS,
                            label: '추가',
                            action: function(dialog) {
                                addHolidayPopup.addHoliday().then(
                                    function(){
                                        dialog.close();
                                        Dialog.info("휴일이 추가되었습니다.");
                                        that._renderTable();
                                    }, function(){
                                        dialog.close();
                                        Dialog.error("휴일 추가 실패! ㅠㅠ");
                                        that._renderTable();
                                    }
                                );
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
    	_addRemoveBtn : function(){
    	    var that = this;
    	    this.gridOption.buttons.push({
    	       type:"custom",
    	        name:"remove",
    	        tooltip:"삭제",
    	        click:function(_grid){ 
    	            var selectedItem = _grid.getSelectItem();
    	            if(_.isUndefined(selectedItem)){
    	                Dialog.error("선택된 데이터가 없습니다!");
    	                return;
    	            }
    	            selectedItem["_date"] = selectedItem.date;
    	            var selectHolidayModel = new HolidayModel(selectedItem);
    	            selectHolidayModel.destroy({
    	                success : function(){
    	                    that._renderTable();
    	                    Dialog.info("삭제되었습니다.");    
    	                },
    	                error : function(){
    	                    Dialog.error("삭제 실패");    
    	                }
    	            });
    	        }
    	    });
    	},
    	_addToolBtn: function(){
    	    var that = this;
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"wrench",
    	        tooltip:"일괄 생성",
    	        click:function(_grid){
    	            var createHolidayPopup = new CreateHolidayPopup();
    	            Dialog.show({
    	                title:"공휴일 생성", 
                        content:createHolidayPopup, 
                        buttons: [{
                            id: 'createHolidayBtn',
                            cssClass: Dialog.CssClass.SUCCESS,
                            label: '생성',
                            action: function(dialog) {
                                createHolidayPopup.createHoliday().then(
                                    function(){
                                        Dialog.info("공휴일 생성이 완료되었습니다.");
                                        that._renderTable();
                                        dialog.close();
                                    },
                                    function(){
                                        Dialog.error("공휴일 생성 실패!");
                                        dialog.close();
                                    }
                                )
                            }
                        }, {
                            label : "취소",
                            action : function(dialog){
                                dialog.close();
                            }
                        }]
    	            });
    	        }
    	    });
 
    	},
    	_buttonInit: function(){
    	    this._addAddBtn();
    	    this._addRemoveBtn();
    	    this._addToolBtn();
    	},
        
    	render:function(){
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"휴일 관리 ", subTitle:"휴일 관리"})));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");

            var _inlineForm=$(InlineFormHTML).attr("id", "holidayForm");
    	    var _yearComboLabel = $(_.template(LabelHTML)({label:"연도"}));
    	    var _yearCombo = $(_.template(ComboBoxHTML)({id:"holidayYearCombo", label:""}));
    	    
            
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    var _gridSchema=Schemas.getSchema('grid');
    	    this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
    	    
    	    _inlineForm.append(_yearComboLabel);
    	    _inlineForm.append(_yearCombo);
    	    
    	    _layOut.append(_head);
    	    _layOut.append(_inlineForm);
    	    _layOut.append(_content);
    	    
    	    $(this.el).html(_layOut);
    	    
            this._setYearCombo();
    	    this._renderTable();
            return this;
     	},
     	
     	_setYearCombo : function(){
     	    var today = new Date();
    	    var year = today.getFullYear();
    	    for(var i = -1; i< 5; i++){
                $(this.el).find("#holidayYearCombo").append($("<option>"+(year + i)+"</option>"));
            }
    	    $(this.el).find("#holidayYearCombo").val(year);
     	},
     	_renderTable: function(){
            var that=this;
            var _yearCombo = $(this.el).find("#holidayYearCombo");
            var year = _yearCombo.val();
            this.holidayCollection.fetch({
                data : {  
                    year : year
                },
                success : function(){
                    that.grid.render();
                }
            });
        },
    });
    
    
    return holidayManagerView;
});