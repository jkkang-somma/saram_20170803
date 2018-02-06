define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'lodingButton',
  'schemas',
  'i18n!nls/common',
  'dialog',
  'models/sm/SessionModel',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/layout/default.html',
  'text!templates/default/button.html',
  'models/officeitem/OfficeItemCodeModel',
  'collection/officeitem/OfficeItemCodeCollection',
  'views/officeitem/popup/AddOfficeItemCodeView',
  'views/officeitem/popup/EditOfficeItemCodeView',
  'code'
], function(
  $, _, Backbone, BaseView, Grid, LodingButton, Schemas, i18nCommon, Dialog, 
  SessionModel, HeadHTML, ContentHTML, LayoutHTML, ButtonHTML, 
  OfficeItemCodeModel, OfficeItemCodeCollection, 
  AddOfficeItemCodeView, EditOfficeItemCodeView,
  Code
){
    var OfficeItemCodeView = BaseView.extend({
      el:".main-container",
      initialize:function(){
        var officeItemCodeCollection= new OfficeItemCodeCollection();
    		this.option = {
            el:"officeitemcode_content",
            column:[
                { data : "category_type",            "title" : i18nCommon.OFFICEITEM.CATEGORY.COLUME.TYPE },
                { data : "category_code",            "title" : i18nCommon.OFFICEITEM.CATEGORY.COLUME.CODE },
                { data : "category_name",            "title" : i18nCommon.OFFICEITEM.CATEGORY.COLUME.NAME }
              ],
            dataschema:["category_code", "category_type", "category_name"],
    		    collection:officeItemCodeCollection,
    		    detail:true,
    		    view:this,
            order:[[1, "asc"], [2, "asc"]]
            //order:[[5, "desc"], [1, "asc"]]
    		};
    	},
    	events : {
    	    //"mouseover .userpic" : "over",
    	    //"mouseleave .userpic" : "leave",
      },/*
    	over:function(event){
    	    var id = $(event.currentTarget).data("id");
    	    var picdiv = $("<div id='picdiv' style='position: absolute; z-index: 1000;border:solid 1px #2ABB9B;padding: 2px; background-color:white'></div>");
    	    var img = $("<img src='/userpic?file="+id+"' height='140' width='100'>");
    	    
    	    var windowHeight = $(window).height();
    	    var top = event.pageY + 25;
    	    var left = event.pageX + 5;
    	    top = windowHeight < top + 180 ? top-190 : top;
    	    
    	    picdiv.css("top", top);
    	    picdiv.css("left", left);
    	    picdiv.append(img);
    	    
    	    $(this.el).append(picdiv);
    	},
    	leave:function(){
    	    $(this.el).find("#picdiv").remove();
      },*/
    	render:function(){
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    //Head 
    	    var _head=$(_headTemp(_headSchema.getDefault(
            {
              title:i18nCommon.OFFICEITEM.TITLE.OFFICEITEM_MANAGER, 
              subTitle:i18nCommon.OFFICEITEM.SUB_TITLE.OFFICEITEM_CODE
            }
          )));
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    //grid button add;
    	    var _buttons=["search"];
    	    
    	    //if (this.actionAuth.add){
    	        _buttons.push({//OfficeItem Add
        	        type:"custom",
        	        name:"add",
        	        tooltip:i18nCommon.OFFICEITEM.ADD_DIALOG.TOOLTIP,//"비품코드 등록",
        	        click:function(){
                        var addOfficeItemCodeView = new AddOfficeItemCodeView();
                        Dialog.show({
                            title:i18nCommon.OFFICEITEM.ADD_DIALOG.TITLE, 
                            content:addOfficeItemCodeView, 
                            buttons:[{
                                label: i18nCommon.DIALOG.BUTTON.ADD,
                                cssClass: Dialog.CssClass.SUCCESS,
                                action: function(dialogRef){// 버튼 클릭 이벤트
                                    var _btn=this;
                                    var beforEvent,affterEvent;
                                    
                                    beforEvent=function(){
                                        $(_btn).data('loading-text',"<div class='spinIcon'>"+i18nCommon.DIALOG.BUTTON.ADD +"</div>");
                                        //$(_btn).button('loading');
                                    };
                                    affterEvent=function(){
                                        //$(_btn).button('reset');
                                    };
                                    LodingButton.createSpin($(_btn).find(".spinIcon")[0]);
                                    addOfficeItemCodeView.submitAdd(beforEvent, affterEvent).done(function(data){
                                        grid.addRow(data);
                                        dialogRef.close();
                                        Dialog.show(i18nCommon.SUCCESS.OFFICEITEM.ADD);
                                    });//실패 따로 처리안함 add화면에서 처리.
                                }
                            }, {
                                label: i18nCommon.DIALOG.BUTTON.CLOSE,
                                action: function(dialogRef){
                                    dialogRef.close();
                                }
                            }]
                            
                        });
                    }
        	    });
          //}
    	    
    	    //if (this.actionAuth.edit){
        	    _buttons.push({//OfficeItem edit
        	        type:"custom",
        	        name:"edit",
        	        tooltip:i18nCommon.OFFICEITEM.EDIT_DIALOG.TOOLTIP, //"비품코드 수정",
        	        click:function(_grid){
        	            var selectItem=_grid.getSelectItem();
                        if (_.isUndefined(selectItem)){
                            Dialog.warning(i18nCommon.GRID.MSG.NOT_SELECT_ROW);
                        } else {
                            var editOfficeItemCodeView = new EditOfficeItemCodeView(selectItem);
                            Dialog.show({
                                title:i18nCommon.OFFICEITEM.EDIT_DIALOG.UPDATE, 
                                content:editOfficeItemCodeView, 
                                buttons:[{
                                    label: i18nCommon.DIALOG.BUTTON.SAVE,
                                    cssClass: Dialog.CssClass.SUCCESS,
                                    action: function(dialogRef){// 버튼 클릭 이벤트
                                        editOfficeItemCodeView.submitSave().done(function(data){
                                            grid.updateRow(data);
                                            dialogRef.close();
                                            Dialog.show(i18nCommon.SUCCESS.OFFICEITEM.SAVE);
                                        });//실패 따로 처리안함 add화면에서 처리.
                                    }
                                }, {
                                    label: i18nCommon.DIALOG.BUTTON.CLOSE,
                                    action: function(dialogRef){
                                        dialogRef.close();
                                    }
                                }]
                                
                            });
                        }
                    }
        	    });
    	    //}
    	    
    	    //if (this.actionAuth.remove){
        	    _buttons.push({//OfficeItem Remove
        	        type:"custom",
        	        name:"remove",
        	        tooltip:i18nCommon.OFFICEITEM.REMOVE_DIALOG.TOOLTIP, //"비품코드 삭제",
        	        click:function(_grid){
                        var selectItem=_grid.getSelectItem();
                        if (_.isUndefined(selectItem)){
                            Dialog.warning(i18nCommon.GRID.MSG.NOT_SELECT_ROW);
                        } else {
                            selectItem._category_code="-1";

                            Dialog.confirm({
                                msg:i18nCommon.CONFIRM.OFFICEITEM.REMOVE, //"Do you want Delete User?",
                                action:function(){
                                   var officeItemCodeModel = new OfficeItemCodeModel(selectItem);
                                   return officeItemCodeModel.remove();
                                },
                                actionCallBack:function(res){//response schema
                                    if (res.success){
                                      Code.init().then(function(){
                                    		_grid.removeRow(selectItem);
                                    		Dialog.show(i18nCommon.SUCCESS.OFFICEITEM.REMOVE);
                                    	});
                                    } else {
                                        Dialog.show(i18nCommon.SUCCESS.OFFICEITEM.REMOVE_FAIL);
                                    }
                                },
                                errorCallBack:function(){
                                    //dd.close();
                                }
                            });
                        }
                    }
        	    });
    	    //}
    	    
            //Refresh
            _buttons.push("refresh");
            this.option.buttons=_buttons;
            this.option.fetchParam = {
                success : function(){
                    grid._draw();
                }
            };

    	    //grid 
    	    var _gridSchema=Schemas.getSchema('grid');
    	    var grid= new Grid(_gridSchema.getDefault(this.option));
    	    var _content=$(ContentHTML).attr("id", this.option.el);
    	    
    	    _layOut.append(_head);
    	    _layOut.append(_content);
    	    $(this.el).html(_layOut);
     	}
    });
    
    return OfficeItemCodeView;
});