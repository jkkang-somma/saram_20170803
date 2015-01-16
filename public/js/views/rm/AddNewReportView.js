define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'dialog',
  'text!templates/addReportTemplate.html',
  'collection/rm/ApprovalCollection',
  'collection/common/OfficeCodeCollection',
  'collection/sm/UserCollection',
  'models/rm/ApprovalModel',
  'models/rm/ApprovalIndexModel',
], function($, _, Backbone, animator, BaseView, Dialog, addReportTmp, ApprovalCollection, OfficeCodeCollection, UserCollection, ApprovalModel, ApprovalIndexModel){
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
      $(this.el).find("#submit_id").val('150105');
      
      var tableTr = $(this.el).find('.addReportNone');
      tableTr.css('display','none');
    },
    
    setDatePickerPop : function(){
      var beforeDate = $(this.el).find("#start_date");
      //beforeDate.attr('readonly', true);
      this.beforeDate=beforeDate.datetimepicker({
          todayBtn: "linked",
          pickTime: false,
          language: "ko",
          todayHighlight: true,
          format: "YYYY-MM-DD",
          autoclose: true
      });
      
      var afterDate = $(this.el).find("#end_date");
      //afterDate.attr('readonly', true);
      this.afterDate= afterDate.datetimepicker({
          todayBtn: "linked",
          pickTime: false,
          language: "ko",
          todayHighlight: true, 
          format: "YYYY-MM-DD",
          autoclose: true
      });
      
      var beforeTime = $(this.el).find("#start_time");
      //beforeDate.attr('readonly', true);
      this.beforeTime=beforeTime.datetimepicker({
          pickDate: false,
          language: "ko",
          format: "hh:mm",
          autoclose: true
      });
      
      var afterTime = $(this.el).find("#end_time");
      //afterDate.attr('readonly', true);
      this.afterTime= afterTime.datetimepicker({
          pickDate: false,
          language: "ko",
          format: "hh:mm",
          autoclose: true
      });
      
      this.setTimePicker(true);
    },
    
    setSelectBoxData : function(){
      // 구분 
      this.setOfficeCode();
      // 결재자 
      this.setManagerList();
    },
    
    setOfficeCode : function(){
      var _this = this;
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
      
      selGubun.change(function() {
        var selVal = selGubun.val();
        if(selVal == 'W01'){
          // 외근
          _this.setTimePicker(false);
        }else{
          _this.setTimePicker(true);
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
    
    setTimePicker: function(isDisable){
      if(isDisable){
        $(this.el).find('#timePickTitle').text('');
        this.beforeTime.hide();
        this.afterTime.hide();
      }else{
        $(this.el).find('#timePickTitle').text('외근시간');
        this.beforeTime.show();
        this.afterTime.show();
      }
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
  	
  	isDateCompare : function(){
  	  var startDate = $(this.el).find("#beforeDate input").val();
      var endDate = $(this.el).find("#afterDate input").val();
      
      var start= new Date(startDate);
      var end=new Date(endDate);
      
      if(start > end){
        return false;
      }
      
      return true;
  	},
  	
  	onClickBtnSend : function(evt){
  	  this.dialogRef = evt;
  	  var _this = this;
  	  this.thisDfd = new $.Deferred();
  	  
      var formData = this.getFormData($(this.el).find('form'));
      console.log(formData);
      
      var essenId = ["start_date", "end_date", "office_code", "submit_comment"];
      var essenMsg = ["기간", "기간", "구분", "메모"];
      
      for(var i = 0; i < essenId.length; i++){
        if(formData[essenId[i]] == ""){
          alert(essenMsg[i]+"을(를) 입력하세요.");
          this.thisDfd.reject();
          return;
        }
      }
      
      if(!this.isDateCompare()){
          alert("기간을 잘못 입력하였습니다.");      
          this.thisDfd.reject();
          return;
      }else{
        var _appCollection = new ApprovalCollection();
        _appCollection.url = "/approval/appIndex";
        
        var nowDate = new Date();
        var yearMonth = "";
        
        // getzFormat
        yearMonth = nowDate.getFullYear() + this.getzFormat(nowDate.getMonth()+1 , 2);
        
        var _thisData = {yearmonth : yearMonth};
        
        _appCollection.fetch({
     			reset : true, 
     			data: _thisData,
     			error : function(result) {
     				alert("데이터 조회가 실패했습니다.");
     			}
     		})
        .done(function(result){
            // insert
            _thisData["seq"] = result[0].maxSeq;
            _this.addApprovalIndex(_thisData, formData);
        });
      }
      
      return this.thisDfd.promise();
    },
    
    addApprovalIndex : function(docData, formData){
      var _this = this;
      var _approvalIndexModel = new ApprovalIndexModel(docData);
      _approvalIndexModel.save({},{
      	        success:function(model, xhr, options){
      	          console.log("##########success");
      	          console.log(model);
      	          var _seq = model.attributes.seq;
      	          _seq = (_seq==null)? 1 : _seq + 1;
      	           var doc_num = docData.yearmonth + "-" + _this.getzFormat(_seq, 3);
      	           formData["doc_num"] = doc_num;
      	           _this.addApproval(formData);
      	        },
      	        error:function(model, xhr, options){
      	            var respons=xhr.responseJSON;
      	            Dialog.error(respons.message);
      	            this.thisDfd.reject();
      	        },
      	        wait:false
      	    }); 
      
    },
    
    addApproval : function(formData) {
      var _this = this;
      var _approvalModel = new ApprovalModel(formData);
      _approvalModel.save({},{
      	        success:function(model, xhr, options){
      	            Dialog.show("Complete Add Approval.");
      	            _this.thisDfd.resolve(model);
      	        },
      	        error:function(model, xhr, options){
      	            var respons=xhr.responseJSON;
      	            Dialog.error(respons.message);
      	            _this.thisDfd.reject();
      	        },
      	        wait:false
      	    }); 
	       return _this.thisDfd.promise();
    }
    
  });
  return addReportView;
});