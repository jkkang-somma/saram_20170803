define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'dialog',
  'text!templates/report/addReportTemplate.html',
  'models/rm/ApprovalModel',
  'models/vacation/OutOfficeModel',
  'collection/rm/ApprovalCollection',
], function($, _, Backbone, animator, BaseView, Dialog, addReportTmp, ApprovalModel, OutOfficeModel, ApprovalCollection){
  var detailReportView = BaseView.extend({
    options : {},
   
  	events: {
  	},
  	
  	initialize:function(){
  		$(this.el).html();
	    $(this.el).empty();
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
      smallTitleTxt.text('상세보기');
      
      return this;
    },
    
    setAddReportDisplay : function(param){
      // table Setting
      this.setTableDisplay();
      // select box data setting
      this.setDataDefaultValues(param);
      // display setting
      this.setDefaultDisplay();
    },
    
    setTableDisplay : function() {
      var tableTr = $(this.el).find('.apployReportNone');
      tableTr.css('display','none');
    },
    setDefaultDisplay : function() {
      
      var disableValues = ['submit_id', 'start_date', 'end_date', 'office_code', 'submit_comment', 'manager_id', 'state', 'decide_comment'];
      
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
      
      $(this.el).find('#usableHolidayCon').css('display','none');
    
    },
    
    setDataDefaultValues : function(param){
      // console.log(param);
      var _this = $(this.el);
      if(param != undefined){
        _this.find('#submit_id').val(param.submit_name);
        _this.find('#start_date input').val(param.start_date);
        _this.find('#end_date input').val(param.end_date);
        _this.find('#start_time input').val(param.start_time);
        _this.find('#end_time input').val(param.end_time);
        _this.find('#office_code').html("<option>"+param.office_code_name+"</option>");
        _this.find('#submit_comment').val(param.submit_comment);
        _this.find('#decide_comment').val(param.decide_comment);
        
        _this.find('#manager_id').html("<option>"+param.manager_name+"</option>");
        _this.find('#state').html("<option>"+param.state+"</option>");

        var usable = (param.total_day > param.used_holiday)?param.total_day - param.used_holiday : 0;
        _this.find('#usableHoliday').val(usable + " 일");
        
        var holReq = "0";
        if(param.office_code == "B01"){
          // 휴일근무
          holReq = "0";
          $(this.el).find('#end_date').css('display','none');
          $(this.el).find('#outsideOfficeTimeCon').css('display','none');
        }else if(param.office_code == "V02" || param.office_code == "V03"){
          // 반차
          holReq = "0.5";
          $(this.el).find('#end_date').css('display','none');
          $(this.el).find('#outsideOfficeTimeCon').css('display','none');
        }else if(param.office_code == "W01"){
          // 외근
          holReq = "0";
          $(this.el).find('#end_date').css('display','none');
          $(this.el).find('#outsideOfficeTimeCon').css('display','block');
        }else {
          var arrInsertDate = this.getDatePariod();
          holReq = arrInsertDate.length + "";
          $(this.el).find('#end_date').css('display','table');
          $(this.el).find('#outsideOfficeTimeCon').css('display','none');
        }
        _this.find('#reqHoliday').val(holReq + " 일");
        
        if(holReq == "0"){
          // _this.find('#reqHoliday').val(holReq + " 일");
          $(this.el).find('#reqHoliday').parent().parent().css('display', 'none');
        }
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
    
    onClickBtnAppCancel : function(stateVal){
  	  this.thisDfd = new $.Deferred();
  	  var _this = this;
  	  
      var formData = this.options;
      
      console.log(formData);
      formData["_id"] = this.options["doc_num"];
      formData["state"] = stateVal;
      
      var _appCollection = new ApprovalCollection();
      _appCollection.url = "/approval/info";
      var _thisData = {doc_num : this.options["doc_num"]};
      
      _appCollection.fetch({
     			reset : true, 
     			data: _thisData,
     			error : function(result) {
     				Dialog.error("데이터 조회가 실패했습니다.");
     				_this.thisDfd.reject();
     			}
     		})
        .done(function(result){
            var resultVal = result[0].state;
            if(resultVal == '상신'){
                var approvalCollection = new ApprovalCollection(formData);
                approvalCollection.idAttribute = "doc_num";
                approvalCollection.save({}, _this.options["doc_num"]).then(function(){
                  // console.log("SUCCESS UPDATE APPROVAL!!!!!!!");
                  _this.thisDfd.resolve(formData);
                }, function(model,xhr, options){
                  var respons=xhr.responseJSON;
                  Dialog.error(respons.message);
                  _this.thisDfd.reject();
                });
            } else {
                Dialog.error("결재가 완료된 항목입니다.");
                _this.thisDfd.reject({div_fail : true});
            }

        });
     
       return _this.thisDfd.promise();
    
      // // this.collection
    }
    
  });
  return detailReportView;
});