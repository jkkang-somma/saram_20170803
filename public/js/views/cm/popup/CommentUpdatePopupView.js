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
    'models/sm/SessionModel',
    'models/cm/CommentModel',
    'models/cm/CommuteModel',
    'models/cm/ChangeHistoryModel',
    'collection/cm/CommuteCollection',
    'collection/cm/ChangeHistoryCollection',
    'text!templates/inputForm/textbox.html',
	'text!templates/inputForm/textarea.html',
	'text!templates/default/datepickerChange.html',
	'text!templates/inputForm/combobox.html',
], function(
	$, _, Backbone,	Util, Schemas, Grid, Dialog, Datatables, Moment, i18nCommon, ResultTimeFactory, BaseView, Form,
	SessionModel, CommentModel, CommuteModel, ChangeHistoryModel, CommuteCollection, ChangeHistoryCollection,
	TextBoxHTML, TextAreaHTML, DatePickerChangeHTML, ComboboxHTML
) {
	var resultTimeFactory = ResultTimeFactory.Builder;
	var CommentPopupView = Backbone.View.extend({
		initialize : function(data) {
			this.selectData = data;
			console.log(this.selectData);
		},
		events :{
			"click label input[type='checkbox']" : "setDatapickerDisable"
		},
		render: function(el) {
			var dfd= new $.Deferred();
			
			var STATE = i18nCommon.COMMENT.STATE;
		   	// _stateCombo.append($("<option>" + STATE.ACCEPTING + "</option>"));
		   	// _stateCombo.append($("<option>" + STATE.PROCESSING + "</option>"));
		   	// _stateCombo.append($("<option>" + STATE.COMPLETE + "</option>"));
		   	
			if (!_.isUndefined(el)) this.el=el;
			var _view=this;
			var _form = new Form({
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
        		  	type:"text",
	                name:"comment",
	                label:"접수내용",
	                value:this.selectData.comment,
	                disabled:true,
	                group:"modifyGroup"
	        	}, {
        		  	type:"text",
	                name:"comment_reply",
	                label:"답변",
	                value:this.selectData.comment_reply,
	                disabled: this.selectData.state == "처리완료" || SessionModel.get("user").admin == 0,
	                group:"managerGroup"
	        	}, {
	                type:"combo",
	                name:"state",
	                label:"처리상태",
	                value:this.selectData.state,
	                collection:[
	                	{key : STATE.ACCEPTING, value : STATE.ACCEPTING},
	                	{key : STATE.PROCESSING, value : STATE.PROCESSING},
	                	{key : STATE.COMPLETE, value : STATE.COMPLETE}
	                ],
	                disabled: this.selectData.state == "처리완료" || SessionModel.get("user").admin == 0,
	                group:"managerGroup",
		        }]
		    });
		    
		    _form.render().done(function(){
		        _view.form=_form;
		        console.log(_form);
		        var modyfyGroup = _form.groupElements[1].find(".panel-body");
		        modyfyGroup.prepend(_.template(DatePickerChangeHTML)(
					{
						id: "commentUpdatePopupOutTime", 
						label : "퇴근시간",
						label2 : "수정 요청 시간",
						beforeTime:  _view.selectData.before_out_time,
						checkId : "commentUpdatePopupOutTimeCheck",
					}
				));
				
		        modyfyGroup.prepend(_.template(DatePickerChangeHTML)(
					{
						id: "commentUpdatePopupInTime", 
						label : "출근시간",
						label2 : "수정 요청 시간",
						beforeTime:  _view.selectData.before_in_time,
						checkId : "commentUpdatePopupInTimeCheck",
					}
				));
				
				modyfyGroup.find("#commentUpdatePopupInTime").datetimepicker({
	            	pickTime: true,
			        language: "ko",
			        todayHighlight: true,
			        format: "YYYY-MM-DD HH:mm:ss",
			        defaultDate: Moment(_view.selectData.want_in_time).format("YYYY-MM-DD HH:mm:ss")
	            });
	            
				modyfyGroup.find("#commentUpdatePopupOutTime").datetimepicker({
	            	pickTime: true,
			        language: "ko",
			        todayHighlight: true,
			        format: "YYYY-MM-DD HH:mm:ss",
			        defaultDate: Moment(_view.selectData.want_out_time).format("YYYY-MM-DD HH:mm:ss")
	            });
	            
		        // 일반 사용자는 단순 읽기만 
		        
				if (SessionModel.get("user").admin == 0) {
					$(_view.el).find("[type='checkbox']").css("display","none");
				}else{
					 $(_view.el).find("[type='checkbox']").click(function(){
					 	_view.setDatapickerDisable();
					 });
				}
				_view.setDatapickerDisable();
				
		        dfd.resolve();
		    }).fail(function(){
		        dfd.reject();
		    });  
		    
			
			
            return dfd.promise();
		},
		
		setDatapickerDisable : function(){
			var inCheck = $(this.el).find("#commentUpdatePopupInTimeCheck").prop('checked');
			var outCheck = $(this.el).find("#commentUpdatePopupOutTimeCheck").prop('checked');
					
			if(!_.isUndefined(inCheck))
				$(this.el).find("#commentUpdatePopupInTime input").attr("disabled", !inCheck);	
			if(!_.isUndefined(outCheck))
				$(this.el).find("#commentUpdatePopupOutTime input").attr("disabled", !outCheck);	
		},
		getDatapickerDisable : function(){
			var data = {
				inCheck : $(this.el).find("#commentUpdatePopupInTimeCheck").prop('checked'),
				outCheck : $(this.el).find("#commentUpdatePopupOutTimeCheck").prop('checked')
			};
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
		updateComment: function() {
			var dfd = new $.Deferred();
			var that = this;
			var inData = this.getInsertData();
			
			if (inData == null) {
				return;
			}
			
			var userId = SessionModel.get("user").id;
			inData._id = userId;
			
			if(inData.changeHistoryCollection.length == 0){
				Dialog.confirm({
					msg : "출/퇴근 시간이 수정되지 않았습니다. 진행하시겠습니까?",
                    action:function(){
                       return that.saveComment(inData);
                    },
                    actionCallBack:function(res){//response schema
                        dfd.resolve(res);
                    },
	            });
			}else{
				var message = "";
				var changeData = {};
				_.each(inData.changeHistoryCollection.models, function(model){
					if(model.get("change_column") == "in_time"){
						message = message + "출근시간 [ " + model.get("change_before") + " > " +model.get("change_after") + "]\n";
						changeData.changeInTime = inData.changeInTime;
					}else{
						message = message + "퇴근시간 [ " + model.get("change_before") + " > " +model.get("change_after") + "]\n";
						changeData.changeOutTime = inData.changeOutTime;
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
			}
			return dfd.promise();
		},
		getInsertData: function() {
			var data = this.form.getData();
     		var newData = {
     			id: this.selectData.id,
     			year: this.selectData.year,
     			date: this.selectData.date,
     			seq: this.selectData.seq,
     			comment_reply: data.comment_reply,
     			state: data.state,
     			changeInTime: null,
     			changeOutTime : null,
     			changeHistoryCollection : new ChangeHistoryCollection(),
     		};
     		
     		if (newData.comment_reply == "" ) {
     			alert("처리 내용을 입력해주시기 바랍니다. ");
     			return null;
     		}
     		
			var userId = SessionModel.get("user").id;
			
     		var checkResult = this.getDatapickerDisable();
     		
     		if(checkResult.inCheck){
     			newData.changeInTime = $(this.el).find("#commentUpdatePopupInTime").data("DateTimePicker").getDate().format("YYYY-MM-DD HH:mm:ss");
     			var inChangeModel = this._getChangeHistoryModel("in_time", newData.changeInTime, this.selectData.before_in_time, userId);
     			if (inChangeModel)
					newData.changeHistoryCollection.add(inChangeModel);
			
     		}
     		
     		if(checkResult.outCheck){
     			newData.changeOutTime = $(this.el).find("#commentUpdatePopupOutTime").data("DateTimePicker").getDate().format("YYYY-MM-DD HH:mm:ss");
     			var outChangeModel = this._getChangeHistoryModel("out_time", newData.changeOutTime, this.selectData.before_out_time, userId);
     			if (outChangeModel)
					newData.changeHistoryCollection.add(outChangeModel);
     		}
     		
			return newData;
		},
		_getChangeHistoryModel :function(changeColumn, newData, oriData, changeId ) {
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
			change_id : changeId 
		});				
		return changeHistoryModel;
	
	}
	});
	
	
	
	return CommentPopupView;
});