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
	var _currentFilter=0;
    var allreportView = BaseView.extend({
        el: $(".main-container"),
        events: {  },
        
        initialize: function() {
            this.userCollection= new UserCollection();
            this.option = {
            	el:"content",
                collection:this.userCollection,
                detail: true,
                view: this
                    //gridOption
            };

//            $(this.el).html('');
//            $(this.el).empty();
            
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
					{render: function(data, type, row) {						
						return "<input type='checkbox' name='leftbox' id='leftbox' class='leftbox'>";
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
//        		    buttons:["search"],
        		    detail: true,
        		    fetch: false,
        		    order : [[2, "asc"]],
        		    rowCallback : function(row, data) {
            			$(row).unbind("change");
            			$(row).change(function(){
            				if ( $('input[name="leftbox"]').is(":checked") ){
                				grid2.addRow(data);                       				
                				_view.mydata.push(data);
//                				console.log(_view.mydata);
                				grid1.removeRow(data);
            				}
//            				else if($('input[name="leftbox"]').is(":not(:checked)") ){
//            					grid2.removeRow(data);
//            				}
            			});
            		}
        	};    		
            
            var gridOption2 = {
        		    el:"right",
        		    id:"right_table",
        		    column:[
        			{render: function() {
        				return "<input type='checkbox' name='rightbox' id='rightbox' class='rightbox'>";
        				}
        			},
        		    {data: "name", "title": "이름"}, 
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
        		    collection:new UserCollection(),
        		    detail: true,
        		    fetch: false,
        		    order : [[2, "asc"]],
        		    rowCallback : function(row, data) {
            			$(row).unbind("change");
            			$(row).change(function(){
            				if ( $('input[name="rightbox"]').is(":checked") ){
                				grid1.addRow(data);  
                				grid2.removeRow(data);
            				}
//            				else if($('input[name="leftbox"]').is(":not(:checked)") ){
//            					grid1.removeRow(data);
//            				}
            			});
            		}
        	};    		
            gridOption2.buttons = this.getTableButtons();            
            var _gridSchema = Schemas.getSchema('grid');
            var grid1 = new Grid(_gridSchema.getDefault(gridOption1));
            var grid2 = new Grid(_gridSchema.getDefault(gridOption2)); 
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
                    grid1.render();
                }
            });
            
            grid2.render();        
            
        },
        setTitleTxt: function() {
            // small title 
            var smallTitleTxt = $(this.el).find('#smallTitleTxt');
            smallTitleTxt.empty();
            smallTitleTxt.text('일괄 근태 결재');
            return this;
        },
        getTableButtons: function() {
        	arrdata =this.mydata;
//        	console.log(arrdata);
        	
            var _this = this;
            var _buttons =["search"];
            _buttons.push({ // 신규상신
                type: "custom",
                name: "add",
                tooltip: "일괄 결재",
                click: function(_grid) {
                    var _addAllReportView = new AddAllReportView({data : arrdata});
                    var _approvalReportView = new ApprovalReportView();
                    // Dialog
                    Dialog.show({
                        title: "일괄 결재",
                        content: _addAllReportView,
                        buttons: [{
                            label: "결재",
                            cssClass: Dialog.CssClass.SUCCESS,
                            action: function(dialogRef) { // 버튼 클릭 이벤트
                                var _appCollection = new ApprovalCollection();
                                if (arrdata.length != 0) {
                                	_approvalReportView.submitAdd().done(function(data) {
                                		Dialog.show("완료되었습니다.");
                                		_this.grid.addRow(data);
                                        dialogRef.close();
                                        }).fail(function() {
                                            Dialog.error("해당 날짜에 이미 결재된 내역이 있습니다.");
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