define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'text!templates/addReportTemplate.html',
  'collection/rm/ApprovalCollection',
  'collection/common/OfficeCodeCollection',
  'collection/sm/UserCollection',
  'bootstrap-datepicker',
], function($, _, Backbone, animator, BaseView, addReportTmp, ApprovalCollection, OfficeCodeCollection, UserCollection, datepicker){
  var addReportView = BaseView.extend({
    
  	events: {
  	},
  	
  	initialize:function(){
  		this.collection = new ApprovalCollection();
  		
  		$(this.el).html('');
	    $(this.el).empty();
	    
	    _.bindAll(this, "onClickBtnSend");
  	},
  	
    render: function(el){
      var dfd= new $.Deferred();
  	        
      if (!_.isUndefined(el)){
        this.el=el;
	    }
      
      $(this.el).append(addReportTmp);
      
      // title setting
      this.setTitleTxt();
      // default display setting
      this.setAddReportDisplay();
      
      dfd.resolve();
  	    
	    return dfd.promise();
    },
		
    setTitleTxt : function(){
      // small title 
      var smallTitleTxt = $(this.el).find('#smallTitleTxt');
      smallTitleTxt.empty();
      smallTitleTxt.text('근태 상신 등록');
      
      return this;
    },
    
    setAddReportDisplay : function(){
      // table Setting
      this.setTableDisplay();
      // datePicker setting
      this.setDatePickerPop();
      // select box data setting
      this.setSelectBoxData();
    },
    
    setTableDisplay : function() {
      var tableTr = $(this.el).find('.addReportNone');
      tableTr.css('display','none');
    },
    
    setDatePickerPop : function(){
      var pickerView = $(this.el).find(".openDatePicker");
      pickerView.attr('readonly', true);
      pickerView.attr('disabled', false);
      pickerView.css('width', '48%');
      pickerView.css('display', 'inline-block');
      pickerView.css('cursor', 'pointer');
      
      pickerView.datepicker({
          todayBtn: "linked",
          format: "yyyy-mm-dd",
          language: "kr",
          todayHighlight: true
      });
    },
    
    setSelectBoxData : function(){
      // 구분 
      this.setOfficeCode();
      // 결재자 
      this.setManagerList();
    },
    
    setOfficeCode : function(){
      var selGubun = $(this.el).find('#office_code');
      // selGubun.css('width', '35%');
      
      var officeCollection = new OfficeCodeCollection();
      officeCollection.fetch().done(function(result){
        var arrGubunData = result;
        
        // option setting
        for(var index=0; index < arrGubunData.length; index++){
          var optionHtml = "<option value='"+arrGubunData[index].code+"'>"+arrGubunData[index].name+"</option>";
          selGubun.append(optionHtml);
        }
      });
    },
    
    setManagerList: function(){
      var approvalMem = $(this.el).find('#manager_id');
      // approvalMem.css('width', '35%');
      var _userCollection = new UserCollection();
      _userCollection.url = "/user/list/manager";
      _userCollection.fetch().done(function(result){
      var arrApprovalMemData = result;
      
      // option setting
      for(var k=0; k < arrApprovalMemData.length; k++){
      var approvalOptionHtml = "<option value='"+arrApprovalMemData[k].id+"'>"+arrApprovalMemData[k].name+"</option>";
      approvalMem.append(approvalOptionHtml);
      }
      });
    },
    
  	getFormData: function(form) {
  	  // input value
      var unindexed_array = form.serializeArray();
      var indexed_array= {};
      
      $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
      });
      
      return indexed_array;
  	},
  	
  	isDateCompare : function(){
  	  var startDate = $(this.el).find("#beforeDate").val();
      var endDate = $(this.el).find("#afterDate").val();
      
      var start= new Date(startDate);
      var end=new Date(endDate);
      
      if(start > end){
        return false;
      }
      
      return true;
  	},
  	
  	onClickBtnSend : function(evt){
      var formData = this.getFormData($(this.el).find('form'));
      
      console.log(formData);
      
      var essenId = ["start_date", "end_date", "office_code", "submit_comment"];
      var essenMsg = ["기간", "기간", "구분", "메모"];
      
      for(var i = 0; i < essenId.length; i++){
        if(formData[essenId[i]] == ""){
          alert(essenMsg[i]+"을(를) 입력하세요.");
          return;
        }
      }
      
      if(!this.isDateCompare()){
          alert("기간을 잘못 입력하였습니다.");      
          return;
      }else{
        console.log("완료!!!!");
        // 완료 후
        // location.href = '#reportmanager';
      }
    }
    
  });
  return addReportView;
});