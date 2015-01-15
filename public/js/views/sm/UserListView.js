define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'i18n!nls/common',
  'dialog',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/default/right.html',
  'text!templates/default/button.html',
  'text!templates/layout/default.html',
  'collection/sm/UserCollection',
  'views/sm/AddUserView',
  'views/sm/EditUserView',
  'models/sm/UserModel',
], function($, _, Backbone, BaseView, Grid, Schemas, i18Common, Dialog, HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML,  UserCollection, AddUserView, EditUserView,  UserModel){
    var userListCount=0;
    var UserListView = BaseView.extend({
        el:".main-container",
    	initialize:function(){
    	    var userCollection= new UserCollection();
    	    var _id="userList_"+(userListCount++);
    		this.option = {
    		    el:_id+"_content",
    		    column:["사번", "이름", "부서", "name_commute", "입사일", "퇴사일", "권한"],
    		    dataschema:["id", "name", "dept_name", "name_commute", "join_company", "leave_company", "privilege"],
    		    collection:userCollection,
    		    detail:true,
    		    view:this
    		    //gridOption
    		}
    	},
    	render:function(){
    	    //this.beforeRender();
    	    var _view=this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    	    
    	    //Head 
    	    var _head=$(_headTemp(_headSchema.getDefault({title:i18Common.PAGE.TITLE.USER_MANAGER, subTitle:i18Common.PAGE.SUB_TITLE.USER_LIST})));
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    //grid button add;
    	    var _buttons=["search"];
    	    _buttons.push({//User Add
    	        type:"custom",
    	        name:"add",
    	        click:function(){
                    var addUserView= new AddUserView();
                    Dialog.show({
                        title:i18Common.DIALOG.TITLE.USER_ADD, 
                        content:addUserView, 
                        buttons:[{
                            label: i18Common.DIALOG.BUTTON.ADD,
                            cssClass: Dialog.CssClass.SUCCESS,
                            action: function(dialogRef){// 버튼 클릭 이벤트
                                addUserView.submitAdd().done(function(model){
                                    grid.addRow(model.attributes);
                                    dialogRef.close();
                                    Dialog.show("Complete Add User.");
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
    	    });
    	    
    	    _buttons.push({//User edit
    	        type:"custom",
    	        name:"edit",
    	        click:function(_grid){
    	            var selectItem=_grid.getSelectItem();
                    if (_.isUndefined(selectItem)){
                        Dialog.warning(i18Common.GRID.MSG.NOT_SELECT_ROW);
                    } else {
                        var editUserView= new EditUserView(selectItem);
                        Dialog.show({
                            title:i18Common.DIALOG.TITLE.USER_UPDATE, 
                            content:editUserView, 
                            buttons:[{
                                label: i18Common.DIALOG.BUTTON.SAVE,
                                cssClass: Dialog.CssClass.SUCCESS,
                                action: function(dialogRef){// 버튼 클릭 이벤트
                                    editUserView.submitSave().done(function(model){
                                        grid.addRow(model.attributes);
                                        dialogRef.close();
                                        Dialog.show("Complete Save User.");
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
    	    
    	    _buttons.push({//User Remove
    	        type:"custom",
    	        name:"remove",
    	        click:function(_grid){
                    var selectItem=_grid.getSelectItem();
                    if (_.isUndefined(selectItem)){
                        Dialog.warning(i18Common.GRID.MSG.NOT_SELECT_ROW);
                    } else {
                        selectItem._id="-1";
                        var dd=Dialog.confirm({
                            msg:"Do you want Delete User?",
                            action:function(){
                               var userModel=new UserModel(selectItem);
                               return userModel.remove();
                            },
                            actionCallBack:function(res){//response schema
                                if (res.status){
                                    _grid.removeRow(selectItem);
                                    Dialog.show("Complete Remove User.");
                                }
                            },
                            errorCallBack:function(){
                                //dd.close();
                            }
                        });
                    }
                }
    	    });
    	    
    	    //Refresh
    	    _buttons.push("refresh");
    	    
    	    this.option.buttons=_buttons;
    	    
    	    //grid 
    	    var _gridSchema=Schemas.getSchema('grid');
    	    var grid= new Grid(_gridSchema.getDefault(this.option));
    	    var _content=$(ContentHTML).attr("id", this.option.el);
    	    
    	    _layOut.append(_head);
    	    _layOut.append(_content);
    	    $(this.el).html(_layOut);
    	    
          //  this.affterRender();
     	}
    });
    
    return UserListView;
});