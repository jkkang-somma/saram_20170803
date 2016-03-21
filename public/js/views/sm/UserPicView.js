define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'i18n!nls/common',
  'dialog',
  'code',
  'jqFileUpload',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/layout/default.html',
  'text!templates/default/button.html',
  'text!templates/sm/userpicbtn.html',
  'models/sm/SessionModel',
  'collection/sm/UserCollection',
  'collection/sm/UserPicCollection',
  'views/sm/popup/AddUserPicPopupView'
], function(
    $, _, Backbone, BaseView, Grid, Schemas, i18Common, Dialog, Code, jqFileUpload,
    HeadHTML, ContentHTML, LayoutHTML, ButtonHTML, DeleteBtnHTML,
    SessionModel,
    UserCollection, UserPicCollection,
    AddUserPicPopupView
){
    var UserPicView = BaseView.extend({
        el:".main-container",
    	initialize:function(){
    	    var _view = this;
    		this.option = {
    		    el: "userList_content",
    		    column:[
                    { "title" : "사진",
                        "render": function(data, type, row){
                            return "<div class='imgbox'><img src='/userpic?file=" + row.id + "&timestamp="+new Date().getTime() +"' height='140' width='100'/></div>";
                        }
                    },
                    { "title" : "부서", "data" : "dept_code",
                        "render": function(data, type, row){
                            if(data == "-"){
                                return data;
                            }
                            return Code.getCodeName(Code.DEPARTMENT,data);
                        }
                    },
                    { "title" : "이름", "data" : "name"},
                    { "title" : "파일명", "data" : "id",
                        "render": function(data, type, row, meta){
                            var tpl = _.template(DeleteBtnHTML)({id: row.id, index : meta.row});
                            return tpl + data + ".jpg";
                        }
                    },
                ],
                rowCallback : function(row,data){
                    var index = row._DT_RowIndex;
                    _view.option.data[data.id] = index;
                },
    		    dataschema:["id", "name", "dept_code"],
    		    collection:null,
    		    fetch:false,
    		    detail:true,
    		    view:this,
    		    order:[[2, "asc"]],
    		    data:{},
    		};
    	},
    	
    	events:{
    	    "click .remove-pic" : "removePic"
    	},
    	removePic : function(event){
    	    var _view = this;
    	    Dialog.confirm({
	        	msg : "해당 사진을 삭제하시겠습니까?",
                action:function(){
                    var dfd = new $.Deferred();
                    var target = $(event.currentTarget);
            	    var id = target.data("id");
            	    var index = target.data("index");
            	    var url = "/userpic";
            	    var ajaxSetting = {
            	        method : "DELETE",
            	        data : {id:id},
            	        success : function(result){
            	            dfd.resolve({msg:index});
            	        },
            	        error : function(){
            	            dfd.resolve();
            	        }
            	    };
            	    
            	    $.ajax( url, ajaxSetting );
		     		return dfd.promise();
                },
                actionCallBack:function(res){//response schema
                    var row = $(_view.grid.getRowNodeAt(res.msg));
                    var data = _view.grid.getDataAt(res.msg);
                    row.find(".imgbox img").attr("src", "/userpic?file="+data.id+"&timestamp="+new Date().getTime());
                },
    	    });
    	},
    	
    	render:function(){
    	    var _view = this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    //Head 
    	    var _head=$(_headTemp(_headSchema.getDefault({title:i18Common.PAGE.TITLE.USER_MANAGER, subTitle:"사진 등록"})));
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    //grid button add;
    	    var _buttons=["search"];
    	    
    	   _buttons.push({
    	        type:"custom",
    	        name:"add",
    	        tooltip:"사진 추가",
    	        click:function(){
    	            var addUserPicPopupView = new AddUserPicPopupView();
    	            Dialog.show({
    	                title:"사진 추가", 
                        content:addUserPicPopupView, 
                        buttons: [{
                            id: 'rawDataCommitBtn',
                            cssClass: Dialog.CssClass.SUCCESS,
                            label: "추가",
                            action: function(dialog) {
                                addUserPicPopupView.submit().done(function(result){
                                    Dialog.info("사진 파일 전송 완료! ("+result.length+"건)");
                                    _view.grid.render();
                                    dialog.close();
                                });
                                dialog.close();
                            }
                        }, {
                            label: "닫기",
                            action: function(dialog) {
                                dialog.close();
                            }
                        }]
    	            });
    	        }
    	    });  
    	
    	    
    	   // //Refresh
    	    _buttons.push("refresh");
    	    
    	    this.option.buttons=_buttons;
    	    
    	   // //grid 
    	   
    	    var _content=$(ContentHTML).attr("id", this.option.el);
    	   
    	    _layOut.append(_head);
    	    _layOut.append(_content);
    	    $(this.el).html(_layOut);
    	    this.initGrid();
    	    
     	}, initGrid : function(){
     	    var _view = this;
     	  //  var dfd = new $.Deferred();
     	    var userPicCollection= new UserPicCollection();
    	    var userCollection = new UserCollection();
    	    
    	    $.when(
    	        userPicCollection.fetch(),
    	        userCollection.fetch()
	        ).done(function(result){
    	       var picArr = result[0];
    	       var gridData = [];
    	       for(var idx in picArr){
    	           picArr[idx] = picArr[idx].substring(0,picArr[idx].indexOf(".jpg"));
    	       }
    	       
    	       _.each(userCollection.models,function(model, index){
    	            picArr = _.reject(picArr, function(id){
    	                return id == model.attributes.id;
    	            });
    	           
                    gridData.push({
                        id: model.attributes.id,
                        name: model.attributes.name,
                        dept_code : model.attributes.dept_code,
                    });
                    
                    if(userCollection.models.length == index + 1){
                        for(var idx in picArr){
                            var item = picArr[idx];
                            gridData.push({
                                id: item,
                                name: "-",
                                dept_code : "-",
                            });     
                        }
                        _view.option.collection = {
            	            data:gridData,
            	            toJSON : function(){
            	                return gridData;
            	            }
            	        };
            	        var _gridSchema=Schemas.getSchema('grid');
            	        _view.grid = new Grid(_gridSchema.getDefault(_view.option));    
                    }
    	       });
    	       
    	    });
    	   // return dfd.promise();
     	}
    });
    
    return UserPicView;
});