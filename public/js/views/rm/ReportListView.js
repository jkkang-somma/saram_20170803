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
  'text!templates/commuteListTemplete.html',
  'collection/rm/ApprovalCollection',
  'views/rm/AddNewReportView',
  'views/rm/ApprovalReportView',
], function($, _, Backbone, Util, animator, BaseView, Grid, Schemas, Dialog, commuteListTmp, ApprovalCollection, AddNewReportView, ApprovalReportView){
   var _reportListView=0;
   var reportListView = BaseView.extend({
    el:$(".main-container"),
    
    events: {
  	  "click #commuteManageTbl tbody tr": "onSelectRow",
  	  "click #btnCommuteSearch": "onClickSearchBtn",
  	  "click #btnCommuteClear": "onClickClearBtn"
  	},
   
  	initialize:function(){
  	   var _id = "reportListView_"+(_reportListView++)
  		this.collection = new ApprovalCollection();
 		this.option = {
 		    el:_id+"_content",
 		    column:[],
          dataschema:["submit_date", "submit_id", "submit_name", "office_code_name", "end_date", "decide_date", "state"],
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
      this.setReportTable(false);
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
      var bottomBtnCon = $(this.el).find('#bottomBtnCon');
      // bottomBtnCon.css('float','right');
      // bottomBtnCon.empty();
      
      // approval Button
      var approvalBtn = $('#btnApprovalPop');
      
      // add new report button
      var addReportBtn = $('#btnAddReport');
      
      // reportmanager/add
      addReportBtn.click(function(){
        // location.href = '#reportmanager/add';
        var _addNewReportView = new AddNewReportView();
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
      //    var table = $(_this.$el).find("#commuteManageTbl").DataTable();
     	// 	var selectData = table.row('.selected').data();
     		
     		if ( Util.isNotNull(selectData) ) {
     		  //if(selectData.state != '결재완료'){
     		  if(true){
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
     		      Dialog.warning("결재 완료된 항목입니다.");
     		    }
         		 
     		} else {
     		  Dialog.error("항목을 선택해주세요.");
     		}
       
      });
      
      return this;
    },
    
    setDatePickerPop : function(){
      var beforeDate = $(this.el).find("#beforeDate");
      //beforeDate.attr('readonly', true);
      this.beforeDate=beforeDate.datetimepicker({
          pickTime: false,
          language: "ko",
          todayHighlight: true,
          format: "YYYY-MM-DD",
          autoclose: true
      });
      
      var afterDate = $(this.el).find("#afterDate");
      //afterDate.attr('readonly', true);
      this.afterDate= afterDate.datetimepicker({
          pickTime: false,
          language: "ko",
          todayHighlight: true, 
          format: "YYYY-MM-DD"
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