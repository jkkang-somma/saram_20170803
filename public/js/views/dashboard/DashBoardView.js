define([
  'jquery',
  'underscore',
  'core/BaseView',
  'log',
  'dialog',
  'i18n!nls/common',
  'monthpicker',
  'cmoment',
  'models/dashboard/WorkingSummaryModel',
  'models/sm/SessionModel',
  'text!templates/layout/default.html',
  'text!templates/dashboardTemplate.html',
  'text!templates/default/head.html',
  ], function($, _, BaseView, log, Dialog, i18Common, Monthpicker, Moment, WorkingSummaryModel, SessionModel, LayoutHTML, DashboardHTML, HeadHTML){
    var LOG=log.getLogger('DashBoardView');
    function getMinTimeString (data){
        var hour = Math.floor(data / 60);
        var min = Math.floor(data % 60);
        var result ="";
        if(hour > 0){
            result += hour + "시간 ";
        }
        result += min + "분";
        
        return result;
    }
	        
    var _defaultData={
        id:"",
        name:"",
        total_working_day:0,
        perception:0,
        sick_leave:0,
        absenteeism:0,
        vacation:0,
    };
    var _firstInitialize=true;
    
    var DashBoardView = BaseView.extend({
    	initialize:function(){
            var view = this;
            this.model= new WorkingSummaryModel({_id:"-1"});
            
            //초기 검색 조건 설정 이번달. 1일 부터 말일까지.
            
            
            _defaultData.id=SessionModel.getUserInfo().id;
            _defaultData.name=SessionModel.getUserInfo().name;
            
            var _startDate=Moment().startOf('month').format("YYYY-MM-DD");
            var _endDate=Moment().endOf('month').format("YYYY-MM-DD");
            var _searchParams={
                start:_startDate,
                end:_endDate
            };
            
            this.searchParams=_searchParams;
            
            _.bindAll(this, 'render');
            _.bindAll(this, 'close');
    	},
    	getWorkingSummary:function(params){
    	    var _view=this;
    	    var dfd= new $.Deferred();
    	    this.model.fetch({
    	       data : params,
    	       success:function(model, result){
    	           dfd.resolve(result);
    	       },
    	       error:function(){
    	           dfd.reject();
    	       }
    	    });
    	    return dfd.promise();
    	},
    	render:function(){
    	    var _view=this;
    	    this.getWorkingSummary(_view.searchParams).done(function(workingSummary){
    	        if (workingSummary.length==0){// 조회내역이 없을때
    	            if (_firstInitialize){
    	                var _startDate=Moment().add(-1, 'month').startOf('month').format("YYYY-MM-DD");
                        var _endDate=Moment().add(-1, 'month').endOf('month').format("YYYY-MM-DD");
                        var _searchParams={
                            start:_startDate,
                            end:_endDate
                        };
                        _view.searchParams=_searchParams;
                        
                        _firstInitialize=false;
                        _view.render();
    	            } else {
    	                _view.workingSummary=_defaultData;
    	                _view.draw();
    	            }
    	        } else {
    	            _view.workingSummary=workingSummary[0];
    	            _view.draw();
    	        }
    	    }).fail(function(){
    	        
    	    });
     	},
     	draw:function(){
    	    var _view=this;
     	    if (_firstInitialize){//첫 수행
     	        _firstInitialize=false;
     	    }
    	    var _data= _view.workingSummary;
    	    var _params=_view.searchParams;
    	    
    	    var layout=$(LayoutHTML);
    	    var _dashboardTemp=_.template(DashboardHTML);
    	    var _configEndDateArr=_params.end.split("-");
    	    if(String(_data.total_working_day).length <= 1){
    	        _data.total_working_day = "0" + _data.total_working_day;
    	    }
            var defaultData={
                top_date:_data.total_working_day==0?"자료없음":"("+_params.start + " ~ "+_configEndDateArr[0] + "-"+_configEndDateArr[1] + "-"+ _data.total_working_day +")"
            };
            
            //header
            var _configDateArr=_params.start.split("-");
            var title=_configDateArr[0]+i18Common.UNIT.YEAR+" "+_configDateArr[1]+i18Common.UNIT.MONTH;
            var _headTmp=_.template(HeadHTML);
            var head=$(_headTmp({title:title, subTitle:""}));
            layout.append(head);
            
            //button
            layout.append('<div class="pull-right"><div class="btn-group" style="top:-15px;"></div></div>');
            
            // 아래 list
    	    var dashboard=$(_dashboardTemp(defaultData));
    	    var _defaultRowHTML='<li class="list-group-item animated  <%= action%>"><span class="badge"><%= value%></span><%= lavel%></li>';
    	    
    	    layout.append(dashboard);
    	    
    	    $(this.el).html(layout); 
    	    //fadeInLeftBig
    	    var _delay=100;
    	    var _action=true;
    	    var getUnit=function(key){
    	        var result;
    	        switch (key){
    	           case "TOTAL_OVERTIEM_PAY":
    	                result=i18Common.UNIT.WON;
    	                break;    
    	           case "TOTAL_OVER_TIME":
    	           case "TOTAL_HOLIDAY_OVER_TIME":
    	           case "OVER_OVER_TIME":
    	           case "OVER_HOLIDAY_OVER_TIME":
    	           case "TOTAL_EARLY_TIME":
    	                result ="";
    	                break;
    	           default:
    	                if (key =="ID" || key == "NAME"){
    	                    result="";
    	                } else {
    	                    result=i18Common.UNIT.DAY;
    	                }
    	        }
    	        return result;
    	    };
    	    
    	    var _validField=["NIGHT_WORKING_A","NIGHT_WORKING_B","NIGHT_WORKING_C","HOLIDAY_WORKING_A","HOLIDAY_WORKING_B","HOLIDAY_WORKING_C"];
    	    var _disableField=["total_working_day", "total_over_time", "total_holiday_over_time", "over_over_time", "over_holiday_over_time","total_early_time"];
    	    var timeout=function(data, name){
    	        
    	        _delay=_delay+200;
    	        
    	        setTimeout(function(){
    	            _action=!_action;
    	            var rowTmp=_.template(_defaultRowHTML);
        	        var row=rowTmp(
        	            {
        	                value:data+getUnit(name.toUpperCase()),
        	                lavel:i18Common.DASHBOARD.WORKING_SUMMARY[name.toUpperCase()],
        	                action:_action?"fadeInLeftBig":"fadeInUp"
        	            }
        	        );
        	        
        	        dashboard.append(row);
    	        }, _delay);
    	    };
    	    
    	    for (var name in _data){
    	        if ( (_.indexOf(_validField, name.toUpperCase()) > -1 && _data[name]==0) || _.indexOf(_disableField,name) > -1){
    	            continue;
    	        }
    	        
    	        timeout(_data[name], name);
    	        
    	    }
    	    
	       // timeout(getMinTimeString(_data.total_over_time)+"("+_data.over_over_time+")", "total_over_time");
	        
	       // timeout(getMinTimeString(_data.total_holiday_over_time)+"("+_data.over_holiday_over_time+")", "total_holiday_over_time");
	        
	       // timeout(getMinTimeString(_data.total_early_time), "total_early_time");
    	    
    	    //button monthpicker 
            new Monthpicker({
                el:".btn-group", 
                callBack:function(value){
                    var _startDate=Moment(value, "YYYY-MM").startOf('month').format("YYYY-MM-DD");
                    var _endDate=Moment(value, "YYYY-MM").endOf('month').format("YYYY-MM-DD");
                    var _searchParams={
                        start:_startDate,
                        end:_endDate
                    };
                    _view.searchParams=_searchParams;
                    _view.render();
                }
            });
     	}
    });
    return DashBoardView;
});