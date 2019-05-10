define([
    'jquery',
    'underscore',
    'backbone',
    'util',
    'animator',
    'core/BaseView',
    'grid',
    'schemas',
    'dialog',
    'cmoment',
    'code',
    'models/sm/SessionModel',
    'text!templates/report/reportListTemplete.html',
    'collection/rm/ApprovalCollection',
    'collection/vacation/VacationCollection',
    'collection/common/HolidayCollection',
    'views/rm/AddAllReportView',
    'views/rm/ApprovalReportView',
    'views/rm/DetailReportView',
    'collection/sm/UserCollection',
    'i18n!nls/common',
    'text!templates/default/button.html',
], function($, _, Backbone, Util, animator, BaseView, Grid, Schemas, Dialog, Moment, Code,
    SessionModel,
    reportListTmp,
    ApprovalCollection, VacationCollection, HolidayCollection,
    AddAllReportView, ApprovalReportView, DetailReportView,UserCollection,i18Common,ButtonHTML
) {
    var allreportView = BaseView.extend({
        el: $(".main-container"),
        grid1 : null,
        grid2 : null,
        initialize: function() {
            this.userCollection= new UserCollection();
            this.option = {
            	el:"content",
                collection:this.userCollection,
                detail: true,
                view: this,
                    //gridOption
            };
        },
        render: function() {
            $(this.el).html(reportListTmp);
            // title setting
            this.setTitleTxt();
            var userCollection= new UserCollection();     
            this.mydata = [];
            var _view = this;
            var gridOption1 = {
        		    el:"left",
        		    id:"left_table",
        		    column:[
					{"title":"<input type='checkbox' name='leftall' class='leftall'>" ,
						render: function() {						
							return "<input type='checkbox' name='leftbox' class='leftbox'>";
						}
					},         
        		    {"title": "이름",render:function(data, type, row){
						return row.name;
						}
					}, 
        		    {"title": "직급",render: function(data, type, row) {
						return row.position_name;
                        }
                    },
                    { "title": "부서","render": function(data, type, row){
                    	return row.dept_name;
                        }
                    },
                    { "title" : i18Common.USER.JOIN_COMPANY, data:"join_company", visible:false, subVisible:false},
                    { "title" : i18Common.USER.LEAVE_COMPANY, data:"leave_company", visible:false, subVisible:false},
             	        ],
        		    collection:this.userCollection,
        		    detail: true,
        		    fetch: false,
        		    initLength : 100,
        		    order : [[2, "asc"]],
        		    rowCallback : function(row, data) {
            			$(row).data("row", data);
            		}
        	};    		
            
            var gridOption2 = {
        		    el:"right",
        		    id:"right_table",
        		    column:[
        			{"title":"<input type='checkbox' name='rightall' class='rightall'>" ,
        				render: function() {
        					return "<input type='checkbox' name='rightbox' class='rightbox'>";
        				}
        			},
        			{"title": "이름",render:function(data, type, row){
						return row.name;
						}
					}, 
        		    {"title": "직급",render: function(data, type, row) {
						return row.position_name;
                        }
                    },
                    { "title": "부서","render": function(data, type, row){
                    	return row.dept_name;
                        }
                    },
                    { "title" : i18Common.USER.JOIN_COMPANY, data:"join_company", visible:false, subVisible:false},
                    { "title" : i18Common.USER.LEAVE_COMPANY, data:"leave_company", visible:false, subVisible:false},
             	        ],
             	    collection:this.userCollection,
        		    detail: true,
        		    fetch: false,
        		    //initLength grid.js에서 설정 undefined면 표시수 50
        		    initLength : 100,
        		    order : [[2, "asc"]],
        		    rowCallback : function(row, data) {
            			$(row).data("row", data);
            		}
        	};    		 
            gridOption2.buttons = this.getTableButtons();  
            var _gridSchema = Schemas.getSchema('grid');

            this.grid1 = new Grid(_gridSchema.getDefault(gridOption1));
            this.grid2 = new Grid(_gridSchema.getDefault(gridOption2)); 
            
            var that = this;            
            that.userCollection.fetch({
                success : function(){
            		that.userCollection.models = _.filter(that.userCollection.models, function(model){
            			var leaveCompany = model.get("leave_company") 
            			if(_.isNull(leaveCompany) || _.isUndefined(leaveCompany) || leaveCompany == ""){
            				return true;
            			}else{
            				return false;
            			}
            		})
                    that.grid1.render();
            		//grid1이 다 그려진 시점에서 테이블에 전체 checkbox
            		$(".leftall").click(function () {
        				if(this.checked ==true){
        					$('#left_table').find('input[name="leftbox"]').prop('checked', true);
        				}else{
        					$('#left_table').find('input[name="leftbox"]').prop('checked', false);
        				}
        			});
                }
            });           
            
            that.grid2.render();  
            //gird2이 다 그려진 시점에서 테이블에 전체 checkbox
            $(".rightall").click(function () {
				if(this.checked ==true){
					$('#right_table').find('input[name="rightbox"]').prop('checked', true);					
				}else{
					$('#right_table').find('input[name="rightbox"]').prop('checked', false);
				}
			});
            
//            $(this.el).find('#left').after("<div id='rightMove'></div>");
//            $(this.el).find('#left').after("<div id='leftMove'></div>");
                    
            $("#rightMove").click(function(){            	
        		if ( $('input[name="leftbox"]').is(":checked") ){
        			that.moveRight();
        			$('#left_table').find('input[name="leftall"]').prop('checked', false);
				}
        	});
            $("#leftMove").click(function(){
        		if ( $('input[name="rightbox"]').is(":checked") ){
        			that.moveLeft();
        			$('#right_table').find('input[name="rightall"]').prop('checked', false);
				}
        	});
        },
        setTitleTxt: function() {
            // small title 
            var smallTitleTxt = $(this.el).find('#smallTitleTxt');
            smallTitleTxt.empty();
            smallTitleTxt.text('일괄 근태 결재');
            return this;
        },
        //left_table에서 right_table로 이동
        moveRight: function() {
        	var _that = this;
        	var _view = this;
      	
        	var list = [];
        	//left>>right
        	$("input[name=leftbox]:checked").each(function() {   
        		var tr = $(this).parents("tr");
        		$(tr).addClass('checked');
        		var rowData = $(tr).data("row");
        		list.push(rowData);
        		_view.mydata.push(rowData);       		
			});
        	_that.grid1.DataTableAPI.row('.checked').remove().draw(false);
        	$("#right_table").dataTable().fnAddData(list);
        },
        //right_table에서 left_table로 이동
        moveLeft: function() {
        	var _that = this;
        	var _view = this;
        	
        	var list = [];
        	//right>>left
        	$("input[name=rightbox]:checked").each(function() {     		
        		var tr = $(this).parents("tr");
        		$(tr).addClass('checked');
        		var rowData = $(tr).data("row");
        		list.push(rowData);
        		//right_table에서 제거 한 rowData를 제거       		
        		var indexRemove = _view.mydata.indexOf(rowData);
        		_view.mydata.splice(indexRemove,1); //mydata array에서 indexRemove부터 1개만 제거(indexRemove만 제거됨)      		
			});
        	_that.grid2.DataTableAPI.row('.checked').remove().draw(false);
        	$("#left_table").dataTable().fnAddData(list);
        },
        getTableButtons: function() {
        	var arrdata =this.mydata;        	
            var _buttons =["search"];
            _buttons.push({ // 신규상신
                type: "custom",
                name: "add",
                tooltip: "일괄 결재",
                click: function(_grid) {
                    var _addAllReportView = new AddAllReportView({data : arrdata});
                    // Dialog
                    Dialog.show({
                        title: "일괄 결재",
                        content: _addAllReportView,
                        buttons: [{
                            label: "결재",
                            cssClass: Dialog.CssClass.SUCCESS,
                            action: function(dialogRef) { // 버튼 클릭 이벤트
                                if (arrdata.length != 0) {
                                	_addAllReportView.submitAdd().done(function(data) {
                                		Dialog.show("완료되었습니다.");
                                        dialogRef.close();
                                        }).fail(function() {
                                            Dialog.error("해당 날짜에 이미 결재된 내역이 있습니다. 재조회 후 다시 확인하십시오.");
                                        });
                                    }
                            	}
                        }, {
                            label: '닫기',
                            action: function(dialogRef) {
                                dialogRef.close();
                            }
                        }]
                    });
                }
            });
            return _buttons;
        },

    });
    return allreportView;
});