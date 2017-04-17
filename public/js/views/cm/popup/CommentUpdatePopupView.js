/**
 * 근태 자료 comment 수정 팝업
 */

define([        
    'jquery',
    'underscore',
    'backbone',
    'util',
    'schemas',
    'grid',
    'dialog',
    'datatables',
    'cmoment',
    'i18n!nls/common',
    'resulttimefactory',
    'core/BaseView',
    'lib/component/form',
    'code',
    'models/sm/SessionModel',
    'models/cm/CommentModel',
    'models/cm/CommuteModel',
    'models/cm/ChangeHistoryModel',
    'collection/cm/CommuteCollection',
    'collection/cm/ChangeHistoryCollection',
	'text!templates/default/datepickerChange.html',
], function(
	$, _, Backbone,	Util, Schemas, Grid, Dialog, Datatables, Moment, i18nCommon, ResultTimeFactory, BaseView, Form, Code,
	SessionModel, CommentModel, CommuteModel, ChangeHistoryModel, CommuteCollection, ChangeHistoryCollection,
	DatePickerChangeHTML
) {
	
	var CommentUpdatePopupView = Backbone.View.extend({
		initialize : function(data) {
			this.selectData = data;
			console.log(this.selectData);
		},
		events :{
			'click input[type="checkbox"]' : function(){return false;},
		},
		render: function(el) {
			var dfd= new $.Deferred();
			
			var STATE = i18nCommon.COMMENT.STATE;
		   	
			if (!_.isUndefined(el)) this.el=el;
			var _view=this;
			var formOption = {
		        el:_view.el,
		        form:undefined,
		        group:[{
	                name:"destGroup",
	                label:"Comment 정보",
	                initOpen:true
	            },{
	                name:"modifyGroup",
	                label:"수정 요청사항",
	                initOpen:true
	            },{
	                name:"managerGroup",
	                label:"처리내용",
	                initOpen:true
	            }],
		        
		        childs:[{
	                type:"input",
	                name:"date",
	                label:"일자",
	                value:this.selectData.date,
	                disabled : true,
	                group:"destGroup",
	        	}, {
	        		type:"input",
	                name:"name",
	                label:"이름",
	                disabled : true,
	                value:this.selectData.name,
	                group:"destGroup",
	        	}, {
	        		type:"input",
	                name:"writer",
	                label:"Comment 작성자",
	                value:this.selectData.writer_name,
	                group:"destGroup",
	                disabled:true
	        	}, {
	        		type:"checkBox",
	                name:"normal",
	                checkLabel: '근태 정상처리 요청',
	                value: this.selectData.want_normal == 1? true : false,
	                group:"modifyGroup",
	                full:true
	        	}, {
	        		type:"input",
	                name:"inTimeBefore",
	                label:i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.IN_TIME_BEFORE,
	                value:this.selectData.before_in_time,
	                group:"modifyGroup",
	                check:true,
	                checkId:"inTimeBeforeCheck",
	                disabled:true
	        	}, {
	                type:"datetime",
	                name:"inTimeAfter",
	                label:i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.IN_TIME_AFTER,
	                format:"YYYY-MM-DD HH:mm",
	                value:this.selectData.want_in_time,
	                group:"modifyGroup",
	                disabled:true
	        	}, {
	        		type:"input",
	                name:"outTimeBefore",
	                label:i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.OUT_TIME_BEFORE,
	                value:_view.selectData.before_out_time,
	                group:"modifyGroup",
	                check:true,
	                checkId:"outTimeBeforeCheck",
	                disabled:true
	        	}, {
	                type:"datetime",
	                name:"outTimeAfter",
	                label:i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.OUT_TIME_AFTER,
	                value:this.selectData.want_out_time,
	                format:"YYYY-MM-DD HH:mm",
	                group:"modifyGroup",
	                disabled:true
	        	}, {
        		  	type:"text",
	                name:"comment",
	                label:"접수내용",
	                value:this.selectData.comment,
	                disabled:true,
	                group:"modifyGroup"
	        	}, {
        		  	type:"text",
	                name:"comment_reply",
	                label:"처리내용",
	                value:this.selectData.comment_reply,
	                group:"managerGroup",
	                disabled: true
	        	},{
	        		type:"input",
	                name:"approval",
	                label:"결재자",
	                value:this.selectData.approval_name,
	                disabled : true,
	                group:"managerGroup",
	        	}, {
	                type:"combo",
	                name:"state",
	                label:"처리상태",
	                value:this.selectData.state,
	                collection:[
	                	{key : STATE.ACCEPTING, value : STATE.ACCEPTING},
	                	{key : STATE.PROCESSING, value : STATE.PROCESSING},
	                	{key : STATE.NPROCESSING, value : STATE.NPROCESSING},
	                	{key : STATE.COMPLETE, value : STATE.COMPLETE},
	                	{key : STATE.NACCEPTING, value : STATE.NACCEPTING}
	                ],
	                disabled: true,
	                group:"managerGroup",
		        }]
		    };
		    
			var _form = new Form(formOption);
			
		    _form.render().done(function(){
		        _view.form=_form;
		        
	            if(_view.selectData.state != "처리"){
		        	if(SessionModel.get("user").id == _view.selectData.approval_id && _view.selectData.state == "상신"){ // 결재자인 경우
						$(_view.form.getElement("comment_reply")).find("textarea").removeAttr('readonly');
		            }else if(SessionModel.get("user").admin == 1 && _view.selectData.state == "결재" && _view.selectData.state != "반려"){ // 관리자인 경우
						$(_view.form.getElement("comment_reply")).find("textarea").removeAttr('readonly');
		            }	
		        }
	            if(_view.selectData.want_in_time != null){
	            	$(_view.form.getElement("inTimeBefore")).find('input[type="checkbox"]').prop('checked','checked');
	            }
	            
	            if(_view.selectData.want_out_time != null){
	            	$(_view.form.getElement("outTimeBefore")).find('input[type="checkbox"]').prop('checked','checked');
	            }
	            
	            
		        // 일반 사용자는 단순 읽기만 
				if (SessionModel.get("user").admin == 0) {
					$(_view.el).find("[type='checkbox']").click(function(){
					 	return false;	
					 });
				}
				
		        dfd.resolve();
		    }).fail(function(){
		        dfd.reject();
		    });  
		    
			
			
            return dfd.promise();
		},
		
		getChecked : function(){
			var data = {
				normalCheck : false,
				inCheck : $(this.form.getElement("inTimeBefore")).find('input[type="checkbox"]').prop('checked'),
				outCheck : $(this.form.getElement("outTimeBefore")).find('input[type="checkbox"]').prop('checked')
			};
			
			if(!_.isUndefined(this.form.getElement("normal"))){
				data.normalCheck = $(this.form.getElement("normal")).find('input[type="checkbox"]').prop('checked');
			}
			
			return data;
		},
		saveComment : function(data){
			var dfd = new $.Deferred();
			var commentModel = new CommentModel();
			commentModel.save(data,{
				success : function(result){
					dfd.resolve(result);
				}
			});
			return dfd.promise();
		},
		saveCommute : function(data){
			// 이틀치 Commute 데이터 가져옴
			var dfd = new $.Deferred();
			var that = this;
			var commuteCollection = new CommuteCollection();
			commuteCollection.fetch({ 
     			data: {
     				id : this.selectData.id,
     				startDate : Moment(this.selectData.date).add(-1, 'days').format("YYYY-MM-DD"),	
     				endDate : Moment(this.selectData.date).add(1, 'days').format("YYYY-MM-DD"),
     			},
     			success : function(resultCollection){
     				var idx;
     				for(idx =0; idx < resultCollection.length; idx++){
     					if(resultCollection.models[idx].get("date") == that.selectData.date){
     						break;
     					}
     				}
     				var resultTimeFactory = ResultTimeFactory.Builder();
					resultTimeFactory.modifyByCollection( // commute_result 수정
						resultCollection,
						data,
						data.changeHistoryCollection,
						idx
					).done(function(resultCommuteCollection){ // commute_result 수정 성공!
						dfd.resolve(resultCommuteCollection);		
     				}).fail(function(){
     					dfd.reject();
     				});
     			}
			});
			return dfd.promise();
		},
		
		approvalComment : function(){
			var dfd = new $.Deferred();
			var data = this.form.getData();
     		
			var commentModel = new CommentModel(newData);
			var userId = SessionModel.get("user").id;
			var newData = _.clone(this.selectData);
			newData.state = "결재";
			newData._id = userId;
			newData.comment_reply = data.comment_reply;
			// commentModel.set("_id", )
			console.log(newData);
			commentModel.save(newData, {
				success : function(result){
					dfd.resolve(result);
				}
			});
			return dfd.promise();
		},
		NapprovalComment : function(){
			var dfd = new $.Deferred();
			var data = this.form.getData();
     		
			var commentModel = new CommentModel(newData);
			var userId = SessionModel.get("user").id;
			var newData = _.clone(this.selectData);
			newData.state = "반려";
			newData._id = userId;
			newData.comment_reply = data.comment_reply;
			console.log(newData);
			commentModel.save(newData, {
				success : function(result){
					dfd.resolve(result);
				}
			});
			return dfd.promise();
		},
		NACCEPTING : function(){
			var dfd = new $.Deferred();
			var data = this.form.getData();
     		
			var commentModel = new CommentModel(newData);
			var userId = SessionModel.get("user").id;
			var newData = _.clone(this.selectData);
			newData.state = "상신취소";
			newData._id = userId;
			newData.comment_reply = data.comment_reply;
			console.log(newData);
			commentModel.save(newData, {
				success : function(result){
					dfd.resolve(result);
				}
			});
			return dfd.promise();
		},
		updateComment: function() {
			var dfd = new $.Deferred();
			var that = this;
			var inData = this.getInsertData();
			
			if (inData == null) {
				dfd.reject();
				return dfd.promise();
			}
			
			var userId = SessionModel.get("user").id;
			inData._id = userId;
			// if(inData.changeHistoryCollection.length == 0){
			// 	Dialog.confirm({
			// 		msg : "출/퇴근 시간이 수정되지 않았습니다. 진행하시겠습니까?",
   //                 action:function(){
   //                    return that.saveComment(inData);
   //                 },
   //                 actionCallBack:function(res){//response schema
   //                     dfd.resolve(res);
   //                 },
	  //          });
			// }else{
				var message = "";
				var changeData = {};
				$.each(inData.changeHistoryCollection.models, function(i, model){
					if(model.get("change_column") == "in_time"){
						message = message + "출근시간 [ " + model.get("change_before") + " > " +model.get("change_after") + "]\n";
						changeData.changeInTime = inData.changeInTime;
					}else if(model.get("change_column") == "out_time"){
						message = message + "퇴근시간 [ " + model.get("change_before") + " > " +model.get("change_after") + "]\n";
						changeData.changeOutTime = inData.changeOutTime;
					}else{
						message = message + "근태 정상 처리\n";
						changeData.changeNormal = inData.changeOutTime;
					}
				});
				changeData.changeHistoryCollection = inData.changeHistoryCollection;
				message = message + "\n수정내용이 정확합니까?";
				Dialog.confirm({
					msg : message,
					action:function(){
						var actionDfd = new $.Deferred();
						that.saveComment(inData).done(
                    		function(result){
                    			var commentResult = result;
                    			that.saveCommute(changeData).done(function(result){
                    				actionDfd.resolve(commentResult);
								});
                    		}
                    	);
        	            return actionDfd.promise();
                    },
                    actionCallBack:function(res){//response schema
                        Dialog.info("데이터 전송이 완료되었습니다.");
						dfd.resolve(res);	
                    },
                    errorCallBack:function(){
                        Dialog.error("데이터 전송 실패!");
                    },
	            });
			// }
			return dfd.promise();
		},
		getInsertData: function() {
			var data = this.form.getData();
     		var newData = {
     			id: this.selectData.id,
     			year: this.selectData.year,
     			date: this.selectData.date,
     			seq: this.selectData.seq,
     			comment: data.comment,
     			comment_reply: data.comment_reply,
     			state: "처리완료",
     			changeInTime: null,
     			changeOutTime : null,
     			changeHistoryCollection : new ChangeHistoryCollection(),
     		};
     		
     		if (newData.comment_reply == "" ) {
     			alert("처리 내용을 입력해주시기 바랍니다. ");
     			return null;
     		}
			var userId = SessionModel.get("user").id;
			
     		var checkResult = this.getChecked();
     		//comment를 changememo로 보냄
     		if(checkResult.normalCheck){
     			newData.changeNormal = 1;
     			var nomalChangeModel = this._getChangeHistoryModel("normal", 1, 0, userId, data.comment);
     			if (nomalChangeModel)
					newData.changeHistoryCollection.add(nomalChangeModel);
     		}
     		
     		if(checkResult.inCheck){
     			newData.changeInTime = data.inTimeAfter;
     			var inChangeModel = this._getChangeHistoryModel("in_time", newData.changeInTime, this.selectData.before_in_time, userId, data.comment);
     			if (inChangeModel)
					newData.changeHistoryCollection.add(inChangeModel);
     		}
     		
     		if(checkResult.outCheck){
     			newData.changeOutTime = data.outTimeAfter;
     			var outChangeModel = this._getChangeHistoryModel("out_time", newData.changeOutTime, this.selectData.before_out_time, userId, data.comment);
     			if (outChangeModel)
					newData.changeHistoryCollection.add(outChangeModel);
     		}
     		
			return newData;
		},
		_getChangeHistoryModel :function(changeColumn, newData, oriData, changeId, comment) {
			if(newData == oriData){
				return null;
			}
			var changeHistoryModel = new ChangeHistoryModel({
				year : this.selectData.year,
				id : this.selectData.id,
				date : this.selectData.date,
				change_column : changeColumn,
				change_before : oriData,
				change_after : newData,
				change_id : changeId,
				change_memo : comment
			});				
			return changeHistoryModel;
		
		}
	});
	
	
	
	return CommentUpdatePopupView;
});