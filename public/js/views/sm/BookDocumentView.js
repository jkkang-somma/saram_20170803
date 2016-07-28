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
  'views/sm/popup/AddBookDocumentPopupView',
  'collection/sm/BookDocumentCollection',
], function(
    $, _, Backbone, BaseView, Grid, Schemas, i18Common, Dialog, Code, jqFileUpload,
    HeadHTML, ContentHTML, LayoutHTML, ButtonHTML, DeleteBtnHTML,
    SessionModel,
    AddBookDocumentPopupView, BookDocumentCollection
){
    var BookDocumentView = BaseView.extend({
        el:".main-container",
        elements:{
    		grid: null
    	},
    	initialize:function(){
    	    var _view = this;
    	    var bookdocumentCollection = new BookDocumentCollection;
    		this.option = {
    		    el: "bookdocument_content",
    		    column:[
                    { "title" : "파일명", "data" : "filename",
                        "render": function(data, type, row, meta){
                            var tpl = _.template(DeleteBtnHTML)({id: row.filename, index : meta.row});
                            return "<div class='filebox'><src='/bookdocument?file=" + row.filename  +"'/>"+ tpl + data +"</div>";
                        }
                    },
                ],
                rowCallback : function(row,data){
                    var index = row._DT_RowIndex;
                    _view.option.data[data.id] = index;
                },
                dataschema:[],
    		    collection:bookdocumentCollection,
    		    fetch:true,
    		    detail:true,
    		    view:this,
    		    order:[[1, "asc"]],
    		    data:{},
    		};
    	},
    	
    	events:{
    	    "click .remove-pic" : "removePic"
    	},
    	removePic : function(event){
    	    var _view = this;
    	    Dialog.confirm({
	        	msg : "해당 파일을 삭제하시겠습니까?",
                action:function(){
                    var dfd = new $.Deferred();
                    var target = $(event.currentTarget);
            	    var id = target.data("id");
            	    var index = target.data("index");
            	    var url = "/bookdocument";
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
                	_view.elements.grid.render();
                },
    	    });
    	},
    	
    	render:function(){
    	    var _view = this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    //Head 
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"도서 관리", subTitle:"도서 등록"})));
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    //grid button add;
    	    var _buttons=["search"];
    	    
    	   _buttons.push({
    	        type:"custom",
    	        name:"add",
    	        tooltip:"파일 추가",
    	        click:function(){
    	            var addBookDocumentPopupView = new AddBookDocumentPopupView();
    	            Dialog.show({
    	                title:"파일 추가", 
                        content:addBookDocumentPopupView, 
                        buttons: [{
                            id: 'rawDataCommitBtn',
                            cssClass: Dialog.CssClass.SUCCESS,
                            label: "추가",
                            action: function(dialog) {
                        			addBookDocumentPopupView.submit().done(function(result){
//                        				Dialog.info("파일 전송 완료! ("+result.length+"건)");
                        				if(result.length != 0){
//                        					_view.elements.grid.render();
                        					setTimeout(function(){_view.elements.grid.render()},500);
                        					Dialog.info("파일 전송 완료! ("+result.length+"건)");
                                        }
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
     	    this.option.fetchParam = {
   		        success : function(){
   		   			_view.elements.grid._draw();
   		        }
   		    };

    	   // //grid  
    	    var _gridSchema = Schemas.getSchema('grid');
    	    this.elements.grid = new Grid(_gridSchema.getDefault(this.option));
    	    var _content = $(ContentHTML).attr("id", this.option.el);
    	   
    	    _layOut.append(_head);
    	    _layOut.append(_content);
    	    $(this.el).html(_layOut);    	    

	     	}, 
	    });
    
    return BookDocumentView;
});