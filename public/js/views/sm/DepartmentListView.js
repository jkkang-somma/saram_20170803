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
  'collection/sm/DepartmentCollection',
  'views/sm/popup/AddDepartmentView',
  'views/sm/popup/EditDepartmentView',
  'models/sm/DepartmentModel',
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
    DepartmentCollection,
    AddDepartmentView, 
    EditDepartmentView,
    DepartmentModel, 
    ButtonHTML,
    Code){
	
    var DepartmentListView = BaseView.extend({
        el:".main-container",
    	initialize:function(){
    	    var departmentCollection= new DepartmentCollection();
//    	    var userCollection= new UserCollection();
    		this.option = {
    		    el:"department_content",
    		    column:[
 	                  	{ data : "code",            "title" : i18Common.DEPARTMENT_LIST.GRID_COL_NAME.CODE },
 	                   	{ data : "name",	 		"title" : i18Common.DEPARTMENT_LIST.GRID_COL_NAME.NAME },
                        { data : "area",            "title" : i18Common.DEPARTMENT_LIST.GRID_COL_NAME.AREA },
                        { "title" : i18Common.DEPARTMENT_LIST.GRID_COL_NAME.LEADER, render: function(data, type, row){
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
                        }},
                        { "title" : i18Common.DEPARTMENT_LIST.GRID_COL_NAME.USE, render: function(data, type, row){
                            var useVal = (row.use == 0)? '미사용' : '사용';
                        	return useVal;                        	
                        }}
                        
                ],
    		    dataschema:["code", "name", "area", "leader", "use"],
    		    collection:departmentCollection,
    		    detail:true,
    		    view:this,
    		    order:[[5, "desc"], [1, "asc"]],
    		};
    	},

    	render:function(){
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    //Head 
    	    var _head=$(_headTemp(_headSchema.getDefault({title:i18Common.DEPARTMENT_LIST.TITLE})));
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    //grid button add;
    	    var _buttons=["search"];
    	    
    	    
    	    if (this.actionAuth.add){
    	        _buttons.push({//Department Add
        	        type:"custom",
        	        name:"add",
        	        tooltip:i18Common.DEPARTMENT_LIST.CREATE_DIALOG.TOOLTIP,//"부서 등록",
        	        click:function(_grid){
                        var addDepartmentView= new AddDepartmentView();
                        Dialog.show({
                            title:i18Common.DIALOG.TITLE.DEPARTMENT_ADD, 
                            content:addDepartmentView, 
                            buttons:[{
                                label: i18Common.DIALOG.BUTTON.ADD,
                                cssClass: Dialog.CssClass.SUCCESS,
                                action: function(dialogRef){// 버튼 클릭 이벤트
                                    var _btn=this;
                                    LodingButton.createSpin($(_btn).find(".spinIcon")[0]);
                                    addDepartmentView.submitAdd().done(function(data){
                                        _grid.addRow(data);
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
        	    _buttons.push({//Department edit
        	        type:"custom",
        	        name:"edit",
        	        tooltip:i18Common.DEPARTMENT_LIST.UPDATE_DIALOG.TOOLTIP, //"부서 수정",
        	        click:function(_grid){
        	            var selectItem=_grid.getSelectItem();
                        if (_.isUndefined(selectItem)){
                            Dialog.warning(i18Common.GRID.MSG.NOT_SELECT_ROW);
                        } else {
                            var editDepartmentView= new EditDepartmentView(selectItem);
                            Dialog.show({
                                title:i18Common.DIALOG.TITLE.DEPARTMENT_UPDATE, 
                                content:editDepartmentView, 
                                buttons:[{
                                    label: i18Common.DIALOG.BUTTON.SAVE,
                                    cssClass: Dialog.CssClass.SUCCESS,
                                    action: function(dialogRef){// 버튼 클릭 이벤트
                                        editDepartmentView.submitSave().done(function(data){
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
        	    _buttons.push({//Department Remove
        	        type:"custom",	
        	        name:"remove",
        	        tooltip:i18Common.DEPARTMENT_LIST.REMOVE_DIALOG.TOOLTIP, //"부서 삭제",
        	        click:function(_grid){
                        var selectItem=_grid.getSelectItem();
                        if (_.isUndefined(selectItem)){
                            Dialog.warning(i18Common.GRID.MSG.NOT_SELECT_ROW);
                        }else {
                        	selectItem._code="-1";
                            Dialog.confirm({
                                msg:i18Common.DEPARTMENT_LIST.REMOVE_DIALOG.MSG.REMOVE,
                                action:function(){
                                   var departmentModel=new DepartmentModel(selectItem);
                                   return departmentModel.remove();
                                },
                                actionCallBack:function(res){//response schema
                                    if (res.success){
                                    	Code.init().then(function(){
                                    		_grid.removeRow(selectItem);
                                    		Dialog.show(i18Common.DEPARTMENT_LIST.REMOVE_DIALOG.MSG.REMOVE_COMPLETE);
                                    	});
//                                       _grid.removeRow(selectItem);
//                                       Dialog.show(i18Common.DEPARTMENT_LIST.REMOVE_DIALOG.MSG.REMOVE_COMPLETE);
                                    }
                                    else {
                                    	Dialog.show(i18Common.DEPARTMENT_LIST.REMOVE_DIALOG.MSG.REMOVE_FAIL);
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
    
    return DepartmentListView;
});