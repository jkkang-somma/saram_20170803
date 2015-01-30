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
  'data/code',
  'models/sm/SessionModel',
  'text!templates/commuteListTemplete.html',
  'collection/rm/ApprovalCollection',
  'collection/vacation/VacationCollection',
  'collection/common/HolidayCollection',
  'views/rm/AddNewReportView',
  'views/rm/ApprovalReportView',
  'views/rm/DetailReportView',
], function($, _, Backbone, Util, animator, BaseView, Grid, Schemas, Dialog, Moment, Code,
  SessionModel,
  commuteListTmp,
  ApprovalCollection, VacationCollection, HolidayCollection,
  AddNewReportView, ApprovalReportView, DetailReportView
){
   var _reportListView=0;
   var reportListView = BaseView.extend({
    el:$(".main-container"),
    holidayInfos : [],
    
    events: {
  	  "click #commuteManageTbl tbody tr": "onSelectRow",
  	  "click #btnCommuteSearch": "onClickSearchBtn",
  	  "click #btnManagerSearch": "onClickManagerSearchBtn",
  	  "click .list-approval-btn": "onClickListApprovalBtn",
      "click .list-detail-btn": "onClickListDetailBtn"
    },
   
  	initialize:function(){
  	 var _id = "reportListView_"+(_reportListView++)
  		this.collection = new ApprovalCollection();
  		
  		// 휴가
      this.setVacationById();
      // 휴일
      this.setHolidayInfos();
  		
   		this.option = {
   		    el:_id+"_content",
   		    column:[],
            dataschema:["submit_date", "submit_id", "submit_name", "office_code_name", "day_count", "end_date", "manager_name", "decide_date", "state"],
   		    collection:this.collection,
   		    detail:true,
   		    view:this
   		    //gridOption
   		}
  		
  		$(this.el).html('');
	    $(this.el).empty();
  	},
  	
    render: function(){
      $(this.el).html(commuteListTmp);
      $(this.el).find(".content").attr({"id":this.option.el});
      
      // title setting
      this.setTitleTxt();
      // datePickerPop setting
      this.setDatePickerPop();
      // button Setting
      this.setBottomButtonCon();
      // table setting
      this.setReportTable(true, false);
    },
    
    setTitleTxt : function(){
      // small title 
      var smallTitleTxt = $(this.el).find('#smallTitleTxt');
      smallTitleTxt.empty();
      smallTitleTxt.text('근태 결재 관리');
      
      return this;
    },
    
    setBottomButtonCon : function(){
      var _this = this;
       var sessionInfo = SessionModel.getUserInfo();
       if(sessionInfo.privilege <= 2){
         // 결재 가능 id
         $(this.el).find('#btnManagerSearch').css('display', 'inline-block');
       }else{
         $(this.el).find('#btnManagerSearch').css('display', 'none');
       }
      
      return this;
    },
    
    setDatePickerPop : function(){
      var today = new Date();
	    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
	    var lastDay = new Date(today.getFullYear(), today.getMonth()+1, 1);
      
      var beforeDate = $(this.el).find("#beforeDate");
      this.beforeDate=beforeDate.datetimepicker({
          pickTime: false,
          language: "ko",
          todayHighlight: true,
          format: "YYYY-MM-DD",
          autoclose: true,
          defaultDate: Moment(firstDay).format("YYYY-MM-DD")
      });
      
      var afterDate = $(this.el).find("#afterDate");
      this.afterDate= afterDate.datetimepicker({
          pickTime: false,
          language: "ko",
          todayHighlight: true, 
          format: "YYYY-MM-DD",
          defaultDate: Moment(new Date(lastDay - 1)).add(1, 'M').format("YYYY-MM-DD")
      });
    },
    
    setReportTable : function(val, managerMode){
      var formData = this.getSearchData(val, managerMode);
      var view = this;
      this.option.column=[
         { "title" : "신청일자",
          "render": function(data, type, row){
            var dataVal = view.getDateFormat(row.submit_date);
            return dataVal;
          }
         },
         { data : "submit_dept_code", "title" : "부서",
           render : function(data,type,row){
             return Code.getCodeName(Code.DEPARTMENT, data);
           }
         },
         { data : "submit_name", "title" : "이름"},
         { data : "office_code_name", "title" : "구분"},
         { "title" : "근태일수", "render": function(data, type, row){
            var dataVal = (row.day_count != null && row.day_count != 0)?"<span style='float: right;'>" + row.day_count +"일</span>" : "<span style='float: right;'>-</span>";
            return dataVal;
         }},
         { "title" : "근태기간", "render": function(data, type, row){
           var dataVal = "";
           if(row.day_count != null && row.day_count > 1){
            dataVal = row.start_date +"</br>~ " + row.end_date; 
           } else {
             dataVal = row.start_date;
           }
            
            return dataVal;
         }},
         { "title" : "외근시간", "render": function(data, type, row){
            var dataVal = row.start_time +"</br>~ " + row.end_time;
            if(row.start_time == null || row.office_code != 'W01'){
              dataVal = "-";
            }
            return dataVal;
         }},
         { data : "manager_name", "title" : "결재자"},
         { "title" : "처리일자", "render": function(data, type, row){
            var dataVal = view.getDateFormat(row.decide_date);
            return dataVal;
         }},
         { "title" : "처리상태", "render": function(data, type, row){
          // data : "black_mark",
          // ( 1:정상, 2:당일결재, 3:익일결재
           var sessionInfo = SessionModel.getUserInfo();
           var dataVal = "<div style='text-align: center;'>" + row.state + "</div>";
           dataVal += "<div style='text-align: center;'>";
           if(sessionInfo.id == row.manager_id){
            dataVal +=  "<button class='btn list-approval-btn btn-default btn-sm' id='btnApproval"+row.doc_num+"'><span class='glyphicon glyphicon-ok' aria-hidden='true'></span></button>";
           }
            dataVal +=  "<button class='btn list-detail-btn btn-default btn-sm' id='btnDetail"+row.doc_num+"'><span class='glyphicon glyphicon-list-alt' aria-hidden='true'></span></button>"
            + "</div>";
          return dataVal;
         }},
         {  "title" : "비고" , "render": function(data, type, row){
          // data : "black_mark",
          // ( 1:정상, 2:당일결재, 3:익일결재
           var dataVal = "";
          switch (row.black_mark) {
            case '1':
              dataVal = "정상";
              break;
            case '2':
              dataVal = "당일결재";
              break;
            case '3':
              dataVal = "익일결재";
              break;
            default:
              dataVal = "-";
          }
          return dataVal;
         }}
      ]
      
      this.option.fetchParam={
  			reset : true, 
  			data: formData,
  			error : function(result) {
  				Dialog.error("데이터 조회가 실패했습니다.");
  			}
  		};
  		this.option.buttons = this.setTableButtons();
      var _gridSchema=Schemas.getSchema('grid');
 	    this.grid= new Grid(_gridSchema.getDefault(this.option));
 	   
      return this;
    },
    
    setTableButtons : function(){
      var _this = this;
      var _buttons = ["search",{
        		    	type:"myRecord",
				        name: "myRecord",
				        filterColumn:["submit_name", "manager_name"], //필터링 할 컬럼을 배열로 정의 하면 자신의 아이디 또는 이름으로 필터링 됨. dataschema 에 존재하는 키값.
				        tooltip: "",
      }];
      
      _buttons.push({// 신규상신
    	        type:"custom",
    	        name:"add",
    	        tooltip : "신규 상신",
    	        click:function(_grid){
                // location.href = '#reportmanager/add';
                var _addNewReportView = new AddNewReportView();
                var selectData={};
                selectData.total_day = _this.total_day;
                selectData.used_holiday = _this.used_holiday;
                selectData.holidayInfos = _this.holidayInfos;
                _addNewReportView.options = selectData;
                Dialog.show({
                  title:"결재 상신", 
                  content:_addNewReportView, 
                  buttons:[{
                      label: "상신",
                      cssClass: Dialog.CssClass.SUCCESS,
                      action: function(dialogRef){// 버튼 클릭 이벤트
                      _addNewReportView.onClickBtnSend(dialogRef).done(function(model){
                          _this.onClickClearBtn();
                          dialogRef.close();
                      });
                    }
                  }, {
                    label: '닫기',
                    action: function(dialogRef){
                    dialogRef.close();
                  }
                  }]
                });
    	        }
    	    }
        );
        
        _buttons.push({// 결재
    	        type:"custom",
    	        name:"ok",
    	        tooltip : "결재",
    	        click:function(_grid){
    	          var selectData=_this.grid.getSelectItem();
    	          _this.onClickApproval(selectData);
              }
    	    }
        )
        _buttons.push({// detail
    	        type:"custom",
    	        name:"read",
    	        tooltip : "상세 보기",
    	        click:function(_grid){
    	          var selectData=_this.grid.getSelectItem();
    	          _this.onClickDetail(selectData);
    	        }
    	    }
        );
        return _buttons;
    },
    
    setVacationById : function(){
      var _this = this;
      var sessionInfo = SessionModel.getUserInfo();
      var _vacationColl = new VacationCollection();  
      _vacationColl.url = '/vacation/list'
      _vacationColl.fetch({
        data: {id : sessionInfo.id},
	 			error : function(result) {
	 				Dialog.error("데이터 조회가 실패했습니다.");
	 			}
      }).done(function(result){
        if(result.length > 0){
          _this.total_day = result[0].total_day;
          _this.used_holiday = result[0].used_holiday;
        }
      });
    },
    
    setHolidayInfos : function(){
      var _this = this;
      var today = new Date();
      var sYear = today.getFullYear() + "";
      
      var _holiColl = new HolidayCollection();  
      _holiColl.fetch({
        data: {year : sYear},
	 			error : function(result) {
	 				Dialog.error("데이터 조회가 실패했습니다.");
	 			}
      }).done(function(result){
        if(result.length > 0){
          _this.holidayInfos = result;
        }else{
           _this.holidayInfos = [];
        }
      });
      
    },
    
    getDateFormat : function(dateData){
      
      if (!_.isNull(dateData) ) {
        var time = Moment(dateData).format("YYYY-MM-DD HH:mm:SS");
        var tArr = time.split(" ");
        if (tArr.length == 2) {
         return tArr[0] + "</br>" + tArr[1]; 
        }
      }
      return "-";
      // var d = new Date(dateData);
      // var sDateFormat = "";
      // if (dateData == null){
      //   sDateFormat = "-";
      // }else {
      //   sDateFormat
      //   = d.getFullYear() + "-" + this.getzFormat(d.getMonth() + 1, 2) + "-" + this.getzFormat(d.getDate(), 2)
      //   + " " + this.getzFormat(d.getHours(), 2) + ":" + this.getzFormat(d.getMinutes(), 2) + ":" + this.getzFormat(d.getSeconds(), 2);
      // }
      // return sDateFormat;
    },
    
    // getzFormat: function(s, len){
    //   var sZero = "";
    //   s = s + "";
    //   if(s.length < len){
    //     for(var i = 0; i < (len-s.length); i++){
    //       sZero += "0";
    //     }
    //   }
    //   return sZero + s;
    // },
    
    getSearchData : function(val, managerMode){
      var data = {};
      
      var startDate=this.beforeDate.find("input").val();
      var endDate=this.afterDate.find("input").val();
      //var endDate=//this.afterDate.data("DateTimePicker").getDate().format("YYYY-MM-DD");
    // Dialog.error(this.afterDate.data("DateTimePicker").getText());
      
      if(val && (startDate == "" || endDate == "")){
       data["msg"] = "기간을 모두 입력 해주세요.";
       return data;
      }else{
       var start= new Date(startDate);
       var end=new Date(endDate);
        
       if(val && (start > end)){
          data["msg"] = "기간을 잘못 입력 하였습니다.";
          return data;
       }else{
          data["startDate"] = startDate;
          data["endDate"] = endDate;
       }
       
        // privilege &lt;= 2
        var sessionInfo = SessionModel.getUserInfo();
        if(managerMode && sessionInfo.privilege <= 2){
            // 결재 가능 id
          data["managerId"] = sessionInfo.id;
        }
      }
      
      return data;
    },
    
    onSelectRow : function(evt){
      
      var $currentTarget = $(evt.currentTarget);
      if ( $currentTarget.hasClass('selected') ) {
      	$currentTarget.removeClass('selected');
      }
      else {
      	$(this.el).find('#commuteManageTbl tr.selected').removeClass('selected');
      	$currentTarget.addClass('selected');
      }
    },
    
    onClickSearchBtn : function(evt){
      var data = this.getSearchData(true, false);
      
      if(data["msg"] != undefined && data["msg"] != "") {
        Dialog.error(data["msg"]);
      } else {
        this.setReportTable(true, false);
      }
    },
    // onClickManagerSearchBtn
    onClickManagerSearchBtn : function(evt){
      var data = this.getSearchData(true, true);
      
      if(data["msg"] != undefined && data["msg"] != "") {
        Dialog.error(data["msg"]);
      } else {
        this.setReportTable(true, true);
      }
    },
    onClickClearBtn : function(evt){
      this.render();
    },
    onClickListApprovalBtn : function(evt){
      evt.stopPropagation();
      var $currentTarget = $(evt.currentTarget.parentElement.parentElement.parentElement);
      $('.selected').removeClass('selected');
      $currentTarget.addClass('selected');
      var selectData=this.grid.getSelectItem();
      this.onClickApproval(selectData);
    },
    onClickApproval : function(selectData){
      var _this = this;
      // var selectData=_this.grid.getSelectItem();
   		if ( Util.isNotNull(selectData) ) {
   		  selectData.holidayInfos = _this.holidayInfos;
   		  var sessionInfo = SessionModel.getUserInfo();
   		   
   		  if(selectData.state == "상신" || selectData.state == "취소요청"){
   		 //if(true){
         		 if(selectData.manager_id == sessionInfo.id){
         		 //if(true){
           		  var _approvalReportView = new ApprovalReportView();
               		 // data param 전달
               		 _approvalReportView.options = selectData;
               		 // Dialog
               		 Dialog.show({
                        title:"결재", 
                        content:_approvalReportView, 
                        buttons:[{
                            label: "확인",
                            cssClass: Dialog.CssClass.SUCCESS,
                            action: function(dialogRef){// 버튼 클릭 이벤트
                               _approvalReportView.onClickBtnSend(dialogRef).done(function(model){
                                  Dialog.show("Success Approval Confirm.");
                                    _this.grid.updateRow(model);
                                    dialogRef.close();
                                });
                            }
                        }, {
                            label: '닫기',
                            action: function(dialogRef){
                                dialogRef.close();
                            }
                        }]
                    });
         		 }else{
   		          Dialog.warning("해당 상신 항목의 결재자가 아닙니다.");
         		 }
   		    
   		    }else{
   		      Dialog.warning("결재 완료된 항목입니다.");
   		    }
       		 
   		} else {
   		  Dialog.error("결재 대상을 선택해주세요.");
   		}
              
    },
    onClickListDetailBtn : function(evt){
        evt.stopPropagation();
        var $currentTarget = $(evt.currentTarget.parentElement.parentElement.parentElement);
        $('.selected').removeClass('selected');
	      $currentTarget.addClass('selected');
	      var selectData=this.grid.getSelectItem();
        this.onClickDetail(selectData);
    },
    onClickDetail : function(selectData){
        var _this = this;
        // var selectData=_this.grid.getSelectItem();
     		if ( Util.isNotNull(selectData) ) {
     		  selectData.holidayInfos = _this.holidayInfos;
     		  var _detailReportView = new DetailReportView();
         		 // data param 전달
         		 _detailReportView.options = selectData;
         		 
         		 var dialogButtons = [];
         		 var sessionInfo = SessionModel.getUserInfo();
         		 if(selectData.submit_id == sessionInfo.id && selectData.state == '결재완료'){
         		   dialogButtons.push({
                  label: "취소 요청",
                  cssClass: Dialog.CssClass.SUCCESS,
                  action: function(dialogRef){// 버튼 클릭 이벤트
                  
                      var dd = Dialog.confirm({
                          msg:"Do you want to cancel approval?", 
                          action:function(){
                            var _dfd= new $.Deferred();
                              _detailReportView.onClickBtnAppCancel().done(function(model){
                                  Dialog.show("Completed Approval Cancel.");
                                  _this.grid.updateRow(model);
                                  // _this.onClickClearBtn();
                                  dialogRef.close();
                               });
                              // this.action.caller.arguments[0].close();
                              _dfd.resolve();
                              return _dfd.promise();
                          }
                      });
                  
                      
                  }
              });
         		 }
         		 dialogButtons.push({
                  label: "확인",
                  cssClass: Dialog.CssClass.SUCCESS,
                  action: function(dialogRef){// 버튼 클릭 이벤트
                        dialogRef.close();
                  }
              });
         		 
         		 // Dialog
         		 Dialog.show({
                  title:"상세보기", 
                  content:_detailReportView, 
                  buttons:dialogButtons
              });
     		} else {
     		  Dialog.error("항목을 선택해주세요.");
     		}
              
    }
    
  });
  return reportListView;
});