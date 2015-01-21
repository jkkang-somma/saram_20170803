define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'dialog',
  'text!templates/addReportTemplate.html',
  'collection/rm/ApprovalCollection',
  'models/rm/ApprovalModel',
  'models/vacation/OutOfficeModel',
  'models/vacation/InOfficeModel',
], function($, _, Backbone, animator, BaseView, Dialog, addReportTmp, ApprovalCollection, ApprovalModel, OutOfficeModel, InOfficeModel){
  var approvalReportView = BaseView.extend({
    options : {},
   
  	events: {
  	},
  	
  	initialize:function(){
  		this.collection = new ApprovalCollection();
  		  
  		$(this.el).html();
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
        this.setAddReportDisplay(this.options);
        dfd.resolve();
  	    
  	    return dfd.promise();
    },
    
    setTitleTxt : function(){
      // small title 
      var smallTitleTxt = $(this.el).find('#smallTitleTxt');
      smallTitleTxt.empty();
      smallTitleTxt.text('결재');
      
      return this;
    },
    
    setAddReportDisplay : function(param){
      // table Setting
      this.setTableDisplay();
      // display setting
      this.setDefaultDisplay();
      // select box data setting
      this.setDataDefaultValues(param);
    },
    
    setTableDisplay : function() {
      var tableTr = $(this.el).find('.apployReportNone');
      tableTr.css('display','none');
    },
    setDefaultDisplay : function() {
      
      var disableValues = ['submit_id', 'start_date', 'end_date', 'office_code', 'submit_comment', 'manager_id'];
      
      for(var dvI=0; dvI<disableValues.length; dvI++){
        $(this.el).find('#' + disableValues[dvI]).attr('readonly',true);
        $(this.el).find('#' + disableValues[dvI]).attr('disabled',true);
      }
      
      $(this.el).find('#start_date input').attr('readonly',true);
      $(this.el).find('#end_date input').attr('readonly',true);
      
      $(this.el).find('#start_date input').attr('disabled',true);
      $(this.el).find('#end_date input').attr('disabled',true);
      
      $(this.el).find('#start_time input').attr('readonly',true);
      $(this.el).find('#end_time input').attr('readonly',true);
      
      $(this.el).find('#start_time input').attr('disabled',true);
      $(this.el).find('#end_time input').attr('disabled',true);
      
      // 결재구분 :  
      var selGubun = $(this.el).find('#state');
      
      var arrGubunData = [];
      arrGubunData.push({'code' : '결재완료', 'name' : '결재'});
      arrGubunData.push({'code' : '반려', 'name' : '반려'});
      arrGubunData.push({'code' : '보류', 'name' : '보류'});
      
      // option setting
      for(var index=0; index < arrGubunData.length; index++){
        var optionHtml = "<option value='"+arrGubunData[index].code+"'>"+arrGubunData[index].name+"</option>";
        selGubun.append(optionHtml);
      }
    
    },
    
    setDataDefaultValues : function(param){
      var _this = $(this.el);
      if(param != undefined){
        _this.find('#submit_id').val(param.submit_name);
        _this.find('#start_date input').val(param.start_date);
        _this.find('#end_date input').val(param.end_date);
        _this.find('#start_time input').val(param.start_time);
        _this.find('#end_time input').val(param.end_time);
        _this.find('#office_code').html("<option>"+param.office_code_name+"</option>");
        _this.find('#submit_comment').val(param.submit_comment);
        // _this.find('#decide_comment').val(param.decide_comment);
        
        _this.find('#manager_id').html("<option>"+param.manager_name+"</option>");
        _this.find('#state').val(param.state);
        
        var usable = (param.total_day > param.used_holiday)?param.total_day - param.used_holiday : 0;
        _this.find('#usableHoliday').val(usable + " 일");
        
        var holReq = "0";
        if(param.office_code == "B01" || param.office_code == "W01"){
          // 휴일근무
          holReq = "0";
        }else if(param.office_code == "V02" || param.office_code == "V03"){
          // 반차
          holReq = "0.5";
        }else {
          var arrInsertDate = this.getDatePariod();
          holReq = arrInsertDate.length + "";
        }
        _this.find('#reqHoliday').val(holReq + " 일");
      }
    },
    
    setBottomButtonCon : function(){
      var bottomBtnCon = $(this.el).find('#bottomBtnCon');
      bottomBtnCon.css('float','right');
      bottomBtnCon.empty();
      
      // 확인 Button
      var addReportBtn = $('<button class="btn btn-default">확인</button>');
      addReportBtn.attr('id','btnConfirmReport');
      bottomBtnCon.append(addReportBtn);
      
      return this;
    },
    
  	getFormData: function(form) {
  	  // input value
      var unindexed_array = form.serializeArray();
      var indexed_array= {};
      
      $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
      });
      
      indexed_array["doc_num"] = this.options["doc_num"];
      
      if(indexed_array.state == '결재완료'){
        // black_mark 값 설정 1: 정상 , 2: 당일 결재 , 3: 익일결재
        var _today = new Date();
        var sToday = _today.getFullYear() + "-" + this.getzFormat(_today.getMonth()+1, 2) + "-" + _today.getDate();
        _today = new Date(sToday.substr(0,4),sToday.substr(5,2)-1,sToday.substr(8,2));
        var sStart = $(this.el).find('#start_date input').val();
        var start = new Date(sStart.substr(0,4),sStart.substr(5,2)-1,sStart.substr(8,2));
        
        if(start > _today){
          // 정상
          indexed_array["black_mark"] = '1';
        }else if(sStart == sToday){
          // 당일결재
          indexed_array["black_mark"] = '2';
        }else if(start < _today){
          // 익일결재
          indexed_array["black_mark"] = '3';
        }
        
      }
      
      return indexed_array;
  	},
  	
  	onClickBtnSend : function(evt){
  	  this.thisDfd = new $.Deferred();
  	  var _this = this;
      var formData = this.getFormData($(this.el).find('form'));
      
      console.log(formData);
      formData["_id"] = this.options["doc_num"];
      
      var _approvalModel = new ApprovalModel(formData);
      _approvalModel.idAttribute = "doc_num";
      _approvalModel.save({},{
      	        success:function(model, xhr, options){
      	            // insert
      	            console.log("SUCCESS UPDATE APPROVAL!!!!!!!");
      	            if(formData.state == '결재완료'){
      	              if(_this.options.office_code != 'B01'){
          	            _this.addOutOfficeData();
      	              }else{
      	                // 휴일 근무
      	                _this.addInOfficeData();
      	              }
      	            }else{
      	              _this.thisDfd.resolve();
      	            }
      	        },
      	        error:function(model, xhr, options){
      	            var respons=xhr.responseJSON;
      	            Dialog.error(respons.message);
      	            _this.thisDfd.reject();
      	        },
      	        wait:false
      	    }); 
       return _this.thisDfd.promise();
    
      // // this.collection
    },
    
    addOutOfficeData : function(){
      var _this = this;
      var arrInsertDate = this.getDatePariod();
      
      // data 저장
      var sendData = this.getFormData($(this.el).find('form'));
      sendData["arrInsertDate"] = arrInsertDate; // insert 에 필요한 데이터 저장
      sendData["id"] = this.options["submit_id"];
      sendData["doc_num"] = this.options["doc_num"];
      sendData["memo"] = this.options["submit_comment"];
      sendData["office_code"] = this.options["office_code"];
      sendData["start_time"] = this.options["start_time"];
      sendData["end_time"] = this.options["end_time"];
      
      var _outOfficeModel = new OutOfficeModel(sendData);
      _outOfficeModel.save({},{
      	        success:function(model, xhr, options){
      	          _this.thisDfd.resolve();
      	        },
      	        error:function(model, xhr, options){
      	            var respons=xhr.responseJSON;
      	            Dialog.error(respons.message);
      	            _this.thisDfd.reject();
      	        },
      	        wait:false
      	    }); 
    },
    
    addInOfficeData : function(){
      var _this = this;
      // 날짜 개수 이용하여 날짜 구하기
      var sStart = $(this.el).find('#start_date input').val();
      var arrInsertDate = [];
      arrInsertDate.push(sStart);
      
      // data 저장
      var sendData = this.getFormData($(this.el).find('form'));
      sendData["arrInsertDate"] = arrInsertDate; // insert 에 필요한 데이터 저장
      sendData["id"] = this.options["submit_id"];
      sendData["doc_num"] = this.options["doc_num"];
      
      var _inOfficeModel = new InOfficeModel(sendData);
      _inOfficeModel.save({},{
      	        success:function(model, xhr, options){
      	          _this.thisDfd.resolve();
      	        },
      	        error:function(model, xhr, options){
      	            var respons=xhr.responseJSON;
      	            Dialog.error(respons.message);
      	            _this.thisDfd.reject();
      	        },
      	        wait:false
      	    }); 
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
      if(compareVal > 0){
        // 차이
        for(var i=0; i<=compareVal; i++){
          var dt = start.valueOf() + (i*day);
          var resDate = new Date(dt);
          if(resDate.getDay() != 0 && resDate.getDay() != 6){
            // 주말이 아닌 날짜
            arrInsertDate.push(this.getDateFormat(resDate));
          }
        }
      }else{
         if(start.getDay() != 0 && start.getDay() != 6){
            // 주말이 아닌 날짜
            arrInsertDate.push(sStart);
          }
      }
      
      return arrInsertDate;
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
    }
    
  });
  return approvalReportView;
});