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
  'moment',
  'models/sm/SessionModel',
  'text!templates/commuteListTemplete.html',
  'collection/rm/ApprovalCollection',
  'collection/vacation/VacationCollection',
  'views/rm/AddNewReportView',
  'views/rm/ApprovalReportView',
  'views/rm/DetailReportView',
], function($, _, Backbone, Util, animator, BaseView, Grid, Schemas, Dialog, Moment, SessionModel, commuteListTmp, ApprovalCollection, VacationCollection, AddNewReportView, ApprovalReportView, DetailReportView){
   var _reportListView=0;
   var reportListView = BaseView.extend({
    el:$(".main-container"),
    
    events: {
  	  "click #commuteManageTbl tbody tr": "onSelectRow",
  	  "click #btnCommuteSearch": "onClickSearchBtn"
  	},
   
  	initialize:function(){
  	   var _id = "reportListView_"+(_reportListView++)
  		this.collection = new ApprovalCollection();
 		this.option = {
 		    el:_id+"_content",
 		    column:[],
          dataschema:["submit_date", "submit_id", "submit_name", "office_code_name", "end_date", "manager_name", "decide_date", "state"],
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
      this.setReportTable(true);
      // 휴가
      this.setVacationById();
    },
    
    setTitleTxt : function(){
      // small title 
      var smallTitleTxt = $(this.el).find('#smallTitleTxt');
      smallTitleTxt.empty();
      smallTitleTxt.text('근태보고 관리');
      
      return this;
    },
    
    setBottomButtonCon : function(){
      var _this = this;
      // var bottomBtnCon = $(this.el).find('#bottomBtnCon');
      // bottomBtnCon.css('float','right');
      // bottomBtnCon.empty();
      
      // approval Button
      var approvalBtn = $('#btnApprovalPop');
      
      // add new report button
      var addReportBtn = $('#btnAddReport');
      
      // detail Button
      var detailReportBtn = $('#btnDetailReport');
      
      // reportmanager/add
      addReportBtn.click(function(){
        // location.href = '#reportmanager/add';
        var _addNewReportView = new AddNewReportView();
        var selectData={};
        selectData.total_day = _this.total_day;
        selectData.used_holiday = _this.used_holiday;
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
            label: 'Close',
            action: function(dialogRef){
            dialogRef.close();
          }
          }]
        });
      });
       // reportmanager/approval
      approvalBtn.click(function(){
        var selectData=_this.grid.getSelectItem();
     		
     		if ( Util.isNotNull(selectData) ) {
     		   var sessionInfo = SessionModel.getUserInfo();
     		   
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
                                _this.onClickClearBtn();
                                dialogRef.close();
                            });
                        }
                    }, {
                        label: 'Close',
                        action: function(dialogRef){
                            dialogRef.close();
                        }
                    }]
                });
     		    
     		    }else{
     		      Dialog.warning("해당 상신 항목의 결재자가 아닙니다.");
     		    }
         		 
     		} else {
     		  Dialog.error("결재 대상을 선택해주세요.");
     		}
       
      });
      
      detailReportBtn.click(function(){
         var selectData=_this.grid.getSelectItem();
     		
     		if ( Util.isNotNull(selectData) ) {
     		  var _detailReportView = new DetailReportView();
         		 // data param 전달
         		 _detailReportView.options = selectData;
         		 // Dialog
         		 Dialog.show({
                  title:"상세보기", 
                  content:_detailReportView, 
                  buttons:[{
                      label: "확인",
                      cssClass: Dialog.CssClass.SUCCESS,
                      action: function(dialogRef){// 버튼 클릭 이벤트
                            dialogRef.close();
                      }
                  }]
              });
     		} else {
     		  Dialog.error("항목을 선택해주세요.");
     		}
       
      });
      
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
          defaultDate: Moment(new Date(lastDay - 1)).format("YYYY-MM-DD")
      });
    },
    
    setReportTable : function(val){
      var formData = this.getSearchData(val);
      var view = this;
      this.option.column=[
         { "title" : "신청일자", "render": function(data, type, row){
            var dataVal = view.getDateFormat(row.submit_date);
            return dataVal;
         }},
         { data : "submit_id", "title" : "ID" },
         { data : "submit_name", "title" : "이름"},
         { data : "office_code_name", "title" : "구분"},
         { "title" : "근태기간", "render": function(data, type, row){
            var dataVal = row.start_date +"</br>~ " + row.end_date;
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
         { data : "state", "title" : "처리상태"}
      ]
      
      this.option.fetchParam={
  			reset : true, 
  			data: formData,
  			error : function(result) {
  				Dialog.error("데이터 조회가 실패했습니다.");
  			}
  		};
      var _gridSchema=Schemas.getSchema('grid');
 	    this.grid= new Grid(_gridSchema.getDefault(this.option));
 	   
      return this;
    },
    
    setVacationById : function(){
      var _this = this;
      var sessionInfo = SessionModel.getUserInfo();
      var _vacationColl = new VacationCollection();  
      _vacationColl.url = '/vacation/list'
      _vacationColl.fetch({
        data: {id : sessionInfo.id},
	 			error : function(result) {
	 				alert("데이터 조회가 실패했습니다.");
	 			}
      }).done(function(result){
        if(result.length > 0){
          _this.total_day = result[0].total_day;
          _this.used_holiday = result[0].used_holiday;
        }
      });
    },
    
    getDateFormat : function(dateData){
      var d = new Date(dateData);
      var sDateFormat = "";
      if (dateData == null){
        sDateFormat = "-";
      }else {
        sDateFormat
        = d.getFullYear() + "-" + this.getzFormat(d.getMonth() + 1, 2) + "-" + this.getzFormat(d.getDate(), 2)
         + " " + this.getzFormat(d.getHours(), 2) + ":" + this.getzFormat(d.getMinutes(), 2) + ":" + this.getzFormat(d.getSeconds(), 2);
      }
      return sDateFormat;
    },
    
    getzFormat: function(s, len){
      var sZero = "";
      s = s + "";
      if(s.length < len){
        for(var i = 0; i < (len-s.length); i++){
          sZero += "0";
        }
      }
      return sZero + s;
    },
    
    getSearchData : function(val){
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
      var data = this.getSearchData(true);
      
      if(data["msg"] != undefined && data["msg"] != "") {
        alert(data["msg"]);
      } else {
        this.setReportTable(true);
      }
    },
    onClickClearBtn : function(evt){
      $(this.el).find("#beforeDate").val('');
      $(this.el).find("#afterDate").val('');
      this.setReportTable(false);
      this.render();
    }
    
  });
  return reportListView;
});