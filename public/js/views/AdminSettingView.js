define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'cmoment',
	'comboBox',
	'dialog',
	'jqFileDownload',
	'models/MessageModel',
	'models/sm/SessionModel',
	'i18n!nls/common',
	'lib/component/form',
	'text!templates/default/rowbutton.html',
	'text!templates/report/searchFormTemplate.html'
], function($, _, Backbone, Util, Moment,
	ComboBox, Dialog,
	JqFileDownload,
	MessageModel, SessionModel,
	i18nCommon, Form,
	RowButtonHTML, searchFormTemplate
) {
	var AdminSettingView = Backbone.View.extend({
		initialize : function() {
            this.messageModel = new MessageModel();
            
		},
		afterRender: function(){
			var that = this;
			this.el.find("#btnCreateExcel").click(function(){
				 Dialog.loading({
	                action:function(){
	                    var dfd = new $.Deferred();
	                    var _formObj = that.getSearchForm(); 				
						if ( _formObj == null) {
							return;
						}
						
						var url = "";
						if (_formObj.reportType == "commuteYear") {
							url = "/report/commuteYearReport";
						} else if (_formObj.reportType == "commuteResult"){
							url = "/report/commuteResultTblReport";
						} else {
							new Error("Error: Invalid report type.");
						}
						
						url += "?startTime=" + _formObj.startTime + "&endTime="+ _formObj.endTime +"&isInLeaveWorker=" + _formObj.isInLeaveWorker;
						
			     		$.fileDownload(url, {
			     		    successCallback: function (url) {
			     		    	alert("success!!!!!!!!!");
			     				dfd.resolve();    	
			     		    },
			     		    failCallback: function (html, url) {
			     		    	dfd.reject();
			     		    }
			     		});
			     		return dfd.promise();
	        	    },
	        	    
	                actionCallBack:function(res){//response schema
	                    alert("success!!!");
	                },
	                errorCallBack:function(response){
	                    Dialog.error("보고서 생성 실패");
	                },
	            });
            
				
			});
			
			this.el.find("#btnCreateMsg").click(function(){
				var messageModel = new MessageModel(that.getMessageForm());
				messageModel.save().then(function(result){
					Dialog.info("공지사항 설정을 변경했습니다.");
				}, function(result){
					Dialog.error("공지사항 변경 실패!!")
				})
			});
    	},
    	
		render : function(el) {
			var dfd= new $.Deferred();
         	this.el = el;
         	
         	var _view = this;
       
         	this.messageModel.fetch({
         		success : function(){
         			  	var _form = new Form({
				        el:_view.el,
				        form:undefined,
				        group:[{
			                name:"reportGroup",
			                label:"통계 자료 생성",
			                initOpen:true
			            },{
			                name:"memoGroup",
			                label:"공지 사항 설정",
			                initOpen:true
			            }],
				        
				        childs:[{
				        	type:"datetime",
			                name:"startTime",
			                label:"시작일",
			                value:Moment().startOf('year').format("YYYY-MM-DD"),
			                format:"YYYY-MM-DD",
			                group:"reportGroup"
			        	}, {
			                type:"datetime",
			                name:"endTime",
			                label:"종료일",
			                value:Moment().endOf('year').format("YYYY-MM-DD"),
			                format:"YYYY-MM-DD",
			                group:"reportGroup"
			        	}, {
			        		type:"combo",
			                name:"reportType",
			                label:"자료 선택",
			                collection:[
			                            {key:"commuteYear",value:"근태 보고서 - XLS"},
			                            {key:"commuteResult",value:"근태 DB 자료 - CSV"}
			                	],
			                group:"reportGroup"
			        	}, {
			        		type:"checkBox",
			                name:"chkleaveWorker",
			                label:"&nbsp",
			                checkLabel: '퇴사자 포함',
			                value: false,
			                group:"reportGroup"
			        	}, {
			        		type:"text",
			                name:"msgTextArea",
			                label: "공지사항",
			                value: _view.messageModel.get("text"),
			                group:"memoGroup"
				        }, {
			        		type:"checkBox",
			                name:"chkMsgVisible",
			                label:"&nbsp",
			                checkLabel: '공지 표시',
			                value:  (_view.messageModel.get("visible") == 1)?true:false ,
			                group:"memoGroup"
				        }]
				    });

		         	_form.render().done(function(result){
	        	        _view.form=_form;

	        	        var panels = _view.el.find('.panel-body');
	        	        var tmpl = '<button id="btnCreateExcel" class="btn btn-success btn-block " type="button">Excel 생성</button>';
	        	        $(panels[0]).append(tmpl);
	        	        
	        	        tmpl = '<button id="btnCreateMsg" class="btn btn-success btn-block " type="button">공지 설정</button>';
	        	        $(panels[1]).append(tmpl);	        	        
	        	        
	        	        dfd.resolve(_view);
	        	    }).fail(function(){
	        	        dfd.reject();
	        	    });
		         	
         			// el.find("#msgTextArea").val(that.messageModel.get("text"));
     //    			if(that.messageModel.get("visible") == 1){
     //    				el.find("#chkMsgVisible").prop("checked", true);		
     //    			};
					// dfd.resolve(that);		
         		}
         	});
         	
            return dfd.promise();
		},
     	getSearchForm: function() {	// 검색 조건

     		var _view=this,_form=this.form,_data=_form.getData();
     		var selDataObj = {
     			reportType: _data.reportType,
 				startTime: _data.startTime,
 				endTime: _data.endTime,
 				isInLeaveWorker: _data.chkleaveWorker
 			};

     		if (selDataObj.startTime == "" || selDataObj.endTime == "" ) {
     			Dialog.warning("날짜를 입력하시기 바랍니다.");
     			return null;
     		}else if (selDataObj.startTime.substring(0, 4) != selDataObj.endTime.substring(0, 4) ) {
     			Dialog.warning("동일한 해(년) 기간을 선택해주시기 바랍니다.");
     			return null;     			
     		}
     		
     		return selDataObj;
     	},
     	
     	getMessageForm: function() {
     		var _view=this,_form=this.form,_data=_form.getData();
     		return {
 				text: _data.msgTextArea,
 				visible: _data.chkMsgVisible
 			};
     	}
	});
	
	return AdminSettingView;
});