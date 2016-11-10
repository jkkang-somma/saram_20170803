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
  'collection/sm/PartCollection',
  'views/sm/popup/AddPartView',
  'views/sm/popup/EditPartView',
  'models/sm/PartModel',
  'text!templates/default/button.html',
  'code',
], function(
    $, 
    _, 
    Backbone, 
    BaseView, 
    Grid, 
    LodingButton, 
    Schemas, 
    i18Common, 
    Dialog, 
    SessionModel, 
    HeadHTML, 
    ContentHTML, 
    LayoutHTML,  
    PartCollection,
    AddPartView, 
    EditPartView,
    PartModel, 
    ButtonHTML,
    Code){
	
    var PartListView = BaseView.extend({
        el:".main-container",
    	initialize:function(){
    	    var partCollection= new PartCollection();
//    	    var userCollection= new UserCollection();
    		this.option = {
    		    el:"part_content",
    		    column:[
 	                  	{ data : "code",            "title" : i18Common.PART_LIST.GRID_COL_NAME.CODE },
 	                   	{ data : "name",	 		"title" : i18Common.PART_LIST.GRID_COL_NAME.NAME },                        
                        { "title" : i18Common.PART_LIST.GRID_COL_NAME.LEADER, render: function(data, type, row){
                        	var leaderName = row.user_name;
                        	var leaderCode = row.leader;
                        	if(leaderCode == "0000"){
                        		return null;
                        	}
                        	if(leaderName != null){
                        		var outName = "(" + leaderName + ")";
                        		var outLeader = leaderCode + outName;
                        		return outLeader
                        	}
                        	return null;                        	
                        }}
//                        { data : "leader",          "title" : i18Common.PART_LIST.GRID_COL_NAME.LEADER},
                ],
    		    dataschema:["code", "name", "leader"],
    		    collection:partCollection,
    		    detail:true,
    		    view:this,
    		    order:[[1, "asc"]],
    		};
    	},

    	render:function(){
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    //Head 
    	    var _head=$(_headTemp(_headSchema.getDefault({title:i18Common.PART_LIST.TITLE})));
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    //grid button add;
    	    var _buttons=["search"];
    	    
    	    
    	    if (this.actionAuth.add){
    	        _buttons.push({//Part Add
        	        type:"custom",
        	        name:"add",
        	        tooltip:i18Common.PART_LIST.CREATE_DIALOG.TOOLTIP,//"파트 등록",
        	        click:function(){
                        var addPartView= new AddPartView();
                        Dialog.show({
                            title:i18Common.DIALOG.TITLE.PART_ADD, 
                            content:addPartView, 
                            buttons:[{
                                label: i18Common.DIALOG.BUTTON.ADD,
                                cssClass: Dialog.CssClass.SUCCESS,
                                action: function(dialogRef){// 버튼 클릭 이벤트
                                    var _btn=this;
                                    LodingButton.createSpin($(_btn).find(".spinIcon")[0]);
                                    addPartView.submitAdd().done(function(data){
                                        grid.addRow(data);
                                        dialogRef.close();
                                    });
                                }
                            }, {
                                label: i18Common.DIALOG.BUTTON.CLOSE,
                                action: function(dialogRef){
                                    dialogRef.close();
                                }
                            }]
                            
                        });
                    }
        	    });
    	    }
    	    
    	   if (this.actionAuth.edit){
        	    _buttons.push({//Part edit
        	        type:"custom",
        	        name:"edit",
        	        tooltip:i18Common.PART_LIST.UPDATE_DIALOG.TOOLTIP, //"파트 수정",
        	        click:function(_grid){
        	            var selectItem=_grid.getSelectItem();
                        if (_.isUndefined(selectItem)){
                            Dialog.warning(i18Common.GRID.MSG.NOT_SELECT_ROW);
                        } else {
                            var editPartView= new EditPartView(selectItem);
                            Dialog.show({
                                title:i18Common.DIALOG.TITLE.PART_UPDATE, 
                                content:editPartView, 
                                buttons:[{
                                    label: i18Common.DIALOG.BUTTON.SAVE,
                                    cssClass: Dialog.CssClass.SUCCESS,
                                    action: function(dialogRef){// 버튼 클릭 이벤트
                                        editPartView.submitSave().done(function(data){
                                            grid.updateRow(data);
                                            dialogRef.close();
                                        });//실패 따로 처리안함 add화면에서 처리.
                                    }
                                }, {
                                    label: i18Common.DIALOG.BUTTON.CLOSE,
                                    action: function(dialogRef){
                                        dialogRef.close();
                                    }
                                }]
                                
                            });
                        }
                    }
        	    });
    	    }    
    	    
    	   if (this.actionAuth.remove){
        	    _buttons.push({//Part Remove
        	        type:"custom",	
        	        name:"remove",
        	        tooltip:i18Common.PART_LIST.REMOVE_DIALOG.TOOLTIP, //"파트 삭제",
        	        click:function(_grid){
                        var selectItem=_grid.getSelectItem();
                        if (_.isUndefined(selectItem)){
                            Dialog.warning(i18Common.GRID.MSG.NOT_SELECT_ROW);
                        }else {
                        	selectItem._code="-1";
                            Dialog.confirm({
                                msg:i18Common.PART_LIST.REMOVE_DIALOG.MSG.REMOVE,
                                action:function(){
                                   var partModel=new PartModel(selectItem);
                                   return partModel.remove();
                                },
                                actionCallBack:function(res){//response schema
                                    if (res.success){
                                    	Code.init().then(function(){
                                    		_grid.removeRow(selectItem);
                                    		Dialog.show(i18Common.PART_LIST.REMOVE_DIALOG.MSG.REMOVE_COMPLETE);
                                    	});
//                                       _grid.removeRow(selectItem);
//                                       Dialog.show(i18Common.PART_LIST.REMOVE_DIALOG.MSG.REMOVE_COMPLETE);
                                    }
                                    else {
                                    	Dialog.show(i18Common.PART_LIST.REMOVE_DIALOG.MSG.REMOVE_FAIL);
                                    			}
                                },
                                errorCallBack:function(){
                                    //dd.close();
                                }
                            });
                        }
                    }
        	    });
    	   }
    	    
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
    
    return PartListView;
});