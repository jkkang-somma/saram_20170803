define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'dialog',
  'comboBox',
  'cmoment',
  'models/sm/SessionModel',
  'text!templates/addReportTemplate.html',
  'collection/rm/ApprovalCollection',
  'collection/common/OfficeCodeCollection',
  'collection/sm/UserCollection',
  'models/rm/ApprovalModel',
  'models/rm/ApprovalIndexModel',
], function($, _, Backbone, animator, BaseView, Dialog, ComboBox, Moment, SessionModel, addReportTmp, ApprovalCollection, OfficeCodeCollection, UserCollection, ApprovalModel, ApprovalIndexModel){
  var addReportView = BaseView.extend({
    options: {},
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
      //session id 셋팅
      var sessionInfo = SessionModel.getUserInfo();
      $(this.el).find("#submit_id").val(sessionInfo.id);
      
      var tableTr = $(this.el).find('.addReportNone');
      tableTr.css('display','none');
      
      // 잔여 연차 일수 
      var usable = "0";
      if(this.options.total_day != undefined){
        usable = (this.options.total_day > this.options.used_holiday)?this.options.total_day - this.options.used_holiday : 0;
      }
      $(this.el).find('#usableHoliday').val(usable + " 일");
    },
    
    setDatePickerPop : function(){
      var _this=this;
      var beforeDate = $(this.el).find("#start_date");
      //beforeDate.attr('readonly', true);
      this.beforeDate=beforeDate.datetimepicker({
          todayBtn: "linked",
          pickTime: false,
          language: "ko",
          todayHighlight: true,
          format: "YYYY-MM-DD",
          autoclose: true,
          defaultDate: Moment(new Date()).format("YYYY-MM-DD")
      });
      
      var afterDate = $(this.el).find("#end_date");
      //afterDate.attr('readonly', true);
      this.afterDate= afterDate.datetimepicker({
          todayBtn: "linked",
          pickTime: false,
          language: "ko",
          todayHighlight: true, 
          format: "YYYY-MM-DD",
          autoclose: true,
          defaultDate: Moment(new Date()).format("YYYY-MM-DD")
      });
      
      this.beforeDate.change(function(val){
         var startDate=$(_this.el).find('#start_date input').val();
         if(startDate.length > 8){
          var selGubun = $(_this.el).find('#office_code');
          var selVal = selGubun.val();
          _this.holReq = 0;
          if(selVal != 'W01' && selVal != 'B01' && selVal != 'V02' && selVal != 'V03'){
            var arrInsertDate = _this.getDatePariod();
            _this.holReq = arrInsertDate.length;
            $(_this.el).find('#reqHoliday').val(_this.holReq + " 일");
          }
         } 
      });
      this.afterDate.change(function(val) {
        var endDate=$(_this.el).find('#end_date input').val();
        if(endDate.length > 8){
          var selGubun = $(_this.el).find('#office_code');
          var selVal = selGubun.val();
          _this.holReq = 0;
          if(selVal != 'W01' && selVal != 'B01' && selVal != 'V02' && selVal != 'V03'){
            var arrInsertDate = _this.getDatePariod();
            _this.holReq = arrInsertDate.length;
            $(_this.el).find('#reqHoliday').val(_this.holReq + " 일");
          }
        } 
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
        // 휴일근무
        $(_this.el).find('#datePickerTitleTxt').text('date');
         _this.afterDate.hide();
         $(_this.el).find('#reqHoliday').val("0 일");
          ComboBox.createCombo(selGubun);
      });
      
      selGubun.change(function() {
        var selVal = selGubun.val();
        _this.holReq = 0;
        if(selVal == 'W01'){
          // 외근
          _this.holReq = 0;
          $(_this.el).find('#datePickerTitleTxt').text('date');
          _this.afterDate.hide();
          _this.setTimePicker(false);
        }else if(selVal == 'B01' || selVal == 'V02' || selVal == 'V03'){
          _this.holReq = (selVal == 'B01')?0: 0.5;
          $(_this.el).find('#datePickerTitleTxt').text('date');
          _this.afterDate.hide();
          _this.setTimePicker(true);
        }else{
          var arrInsertDate = _this.getDatePariod();
          _this.holReq = arrInsertDate.length;
          $(_this.el).find('#datePickerTitleTxt').text('from');
          _this.afterDate.css('display', 'table');
          _this.setTimePicker(true);
        }
        $(_this.el).find('#reqHoliday').val(_this.holReq + " 일");
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
      
      ComboBox.createCombo(approvalMem);
      
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
    
    getDatePariod : function(){
       // 날짜 개수 이용하여 날짜 구하기
      var sStart = $(this.el).find('#start_date input').val();
      var sEnd = $(this.el).find('#end_date input').val();
      
      var start = new Date(sStart.substr(0,4),sStart.substr(5,2)-1,sStart.substr(8,2));
      var end = new Date(sEnd.substr(0,4),sEnd.substr(5,2)-1,sEnd.substr(8,2));
      var day = 1000*60*60*24;
      
      var compareVal = parseInt((end - start)/day);
      var arrInsertDate = [];
      var holidayInfos = this.options.holidayInfos;
      if(compareVal > 0){
        // 차이
        for(var i=0; i<=compareVal; i++){
          var dt = start.valueOf() + (i*day);
          var resDate = new Date(dt);
          if(resDate.getDay() != 0 && resDate.getDay() != 6){
            // 주말이 아닌 날짜
            var isPush = true;
            for(var j=0; j<holidayInfos.length; j++){
              var sDate = this.getDateFormat(resDate);
              if(holidayInfos[j].date == sDate){
                isPush = false;
                break;
              }
            }
            if(isPush){
              arrInsertDate.push(sDate);
            }
          }
        }
       
      }else{
         if(start.getDay() != 0 && start.getDay() != 6){
            // 주말이 아닌 날짜
           for(var k=0; k<holidayInfos.length; k++){
              if(holidayInfos[k].date != sStart){
                arrInsertDate.push(sStart);
                break;
              }
           }
        }
      }
      
      return arrInsertDate;
    },
    
  	getFormData: function(form) {
  	  // input value
      var unindexed_array = form.serializeArray();
      var indexed_array= {};
      
      $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
      });
      
      indexed_array["day_count"] = this.holReq;
      
      return indexed_array;
  	},
    
    getDateFormat : function(dateData){
      var sDateFormat = "";
      if (dateData == null){
        sDateFormat = "";
      }else {
        sDateFormat
        = dateData.getFullYear() + "-" + this.getzFormat(dateData.getMonth() + 1, 2) + "-" + this.getzFormat(dateData.getDate(), 2);
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
  	
  	isDateCompare : function(formData){
  	  var startDate = formData.start_date;
      var endDate = formData.end_date;
      
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
        if(i==1){// end date 일경우
          var selGubun = $(this.el).find('#office_code');
          var selVal = selGubun.val();
          if(selVal == 'B01' || selVal == 'V02' || selVal == 'V03'){
            $(this.el).find('#'+essenId[i]).val(formData["start_date"]);
            formData[essenId[i]] = formData["start_date"];
          }
        } 
        if(formData[essenId[i]] == ""){
          Dialog.error(essenMsg[i]+"을(를) 입력하세요.");
          this.thisDfd.reject();
          return;
        }
      }
      var usable = (this.options.total_day > this.options.used_holiday)?this.options.total_day - this.options.used_holiday : 0;
      if(!this.isDateCompare(formData)){
          Dialog.error("기간을 잘못 입력하였습니다.");      
          this.thisDfd.reject();
          return;
      }else if(this.holReq > usable){
        Dialog.error("잔여 연차 일수를 초과 했습니다.");      
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
     				Dialog.error("데이터 조회가 실패했습니다.");
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