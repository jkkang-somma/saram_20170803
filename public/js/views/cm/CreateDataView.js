define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'dialog',
  'cmoment',
  'resulttimefactory',
  'data/code',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/layout/default.html',
  'text!templates/component/progressbar.html',
  'text!templates/inputForm/forminline.html',
  'text!templates/inputForm/label.html',
  'models/cm/CommuteModel',
  'collection/common/HolidayCollection',
  'collection/common/RawDataCollection',
  'collection/sm/UserCollection',
  'collection/cm/CommuteCollection',
  'collection/vacation/OutOfficeCollection',
  'collection/vacation/InOfficeCollection',
  'views/cm/popup/CreateDataPopupView',
  'views/cm/popup/CreateDataRemovePopupView',
  'views/component/ProgressbarView'
], function($, _, Backbone, BaseView, Grid, Schemas, Dialog, Moment, ResultTimeFactory, Code,
HeadHTML, ContentHTML, LayoutHTML, ProgressbarHTML, ForminlineHTML, LabelHTML,
CommuteModel, 
HolidayCollection, RawDataCollection, UserCollection, CommuteCollection, OutOfficeCollection, InOfficeCollection,
CreateDataPopupView, CreateDataRemovePopupView, ProgressbarView){
    var resultTimeFactory = ResultTimeFactory.Builder;
    
    function dateToText(data){
        return _.isNull(data) ? null : Moment(data).format("MM-DD<br>HH:mm:ss");
    }
    
    var CreateDataView = BaseView.extend({
        
        el:$(".main-container"),
       
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    this.commuteCollection = new CommuteCollection();
    	    
    		this.gridOption = {
    		    el:"createCommuteListContent",
    		    id:"createCommuteListTable",
    		    column:[
                    {"title": "날짜", "data": "date"},
                    {"title": "부서", "data": "department"},
                    {"title": "이름", "data": "name"},
                    {"title": "근무<br>형태", "data": "work_type",
                        "render": function (data, type, rowData, meta) {
                            return Code.getCodeName(Code.WORKTYPE, data);
                       }
                    },
                    {"title": "출근<br>기준", "data": "standard_in_time",
                        "render": function (data, type, rowData, meta) {
                            return dateToText(data);
                       }
                    },
                    {"title": "출근<br>시간", "data": "in_time",
                        "render": function (data, type, rowData, meta) {
                            return dateToText(data);
                       }
                    },
                    {"title": "지각<br>(분)", "data": "late_time"},
                    {"title": "퇴근<br>기준", "data": "standard_out_time",
                        "render": function (data, type, rowData, meta) {
                            return dateToText(data);
                       }
                    },
                    {"title": "퇴근<br>시간", "data": "out_time",
                        "render": function (data, type, rowData, meta) {
                            return dateToText(data);
                            
                       }
                    },
                    {"title": "초과근무<br>(분)", "data": "over_time"},
                    {"title": "초과근무", "data": "overtime_code",
                        "render": function (data, type, rowData, meta) {
                            return Code.getCodeName(Code.OVERTIME, data);
                        }
                    },
                    {"title": "근태", "data": "vacation_code",
                        "render": function (data, type, rowData, meta) {
                            return Code.getCodeName(Code.OFFICE, data);

                        }
                    },
                    {"title": "외근<br>출장", "data": "out_office_code",
                        "render": function (data, type, rowData, meta) {
                            return Code.getCodeName(Code.OFFICE, data);
                        }
                    },
    		    ],
    		    dataschema:["date", "name", "in_time", "out_time", "work_type", "standard_in_time" ,"standard_out_time", "late_time", "over_time", "overtime_code", "vacation_code", "out_office_code"],
    		    collection:this.commuteCollection,
    		    detail: true,
    		    fetch: false,
    		    buttons:["search"],
    		    order:[[1,"asc"]]
    		};
    		
    		this._dialogInit();
    		
    	},
    	
    	_dialogInit: function(){
    	    this._addAddBtn();
    	    this._addCommitBtn();
        },
    	_addAddBtn : function(){
    	    var that = this;
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"add",
    	        tooltip:"근태 생성",
    	        click:function(){
                    var createDataPopupView= new CreateDataPopupView({date : that.lastestDate});
                    
                    Dialog.show({
                        title:"근태 데이터 생성", 
                        content:createDataPopupView, 
                        buttons: [{
                            id: 'createDataCreateBtn',
                            cssClass: Dialog.CssClass.SUCCESS,
                            label: '데이터 생성',
                            action: function(dialog) {
                                Dialog.confirm({
                        			msg : "근태 데이터를 생성하시겠습니까?",
                        			action:function(){
                        	            return createDataPopupView.createData();
                                    },
                                    actionCallBack:function(result){
                                        console.log(result);
                                        that.commuteCollection.reset();
                                        that.commuteCollection.add(result);
                                        that.grid.render();
                                        dialog.close();
                                        Dialog.show("데이터 생성 완료!");    
                                    },
                                    errorCallBack:function(response){
                                        Dialog.error("데이터 생성실패!");
                                    },
                                });  
                            }
                        }, {
                            label : "취소",
                            action: function(dialog){
                                dialog.close();
                            }
                        }],
                    });
                }
    	    });
    	},
    	_addCommitBtn : function(){
    	    var that = this;
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"ok",
    	        tooltip:"저장",
    	        click:function(){
    	            Dialog.confirm({
    					msg : "근태 데이터를 서버에 저장하시겠습니까?",
    					action:function(){
                            var dfd = new $.Deferred();
                            that.commuteCollection.save({
            	                success:function(){
            	                    dfd.resolve();
            	                },
            	                error: function(model, response){
            	                    dfd.reject();
            	                }
            	            });
            	            return dfd;
                        },
                        actionCallBack:function(res){//response schema
    	                    that._setLabel();
    	                    Dialog.info("데이터 전송이 완료되었습니다.");
                        },
                        errorCallBack:function(response){
    	                    Dialog.error("데이터 전송 실패! \n ("+ response.responseJSON.message +")");
                        },
    	            });
    	        }
    	    });  
    	},
    	
    	render:function(){
            var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layout=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"근태 관리 ", subTitle:"근태 자료 생성"})));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    
    	    var _row=$(ForminlineHTML);
    	    var _label = $(_.template(LabelHTML)({label : ""}));
    	    this.label = _label;
    	    _row.append(_label);
    	    _layout.append(_head);
    	    _layout.append(_row);
            _layout.append(_content);
            
    	    $(this.el).append(_layout);
    	    this.lastestDate = null;
            this._setLabel();
            
    	    var _gridSchema=Schemas.getSchema('grid');
    	    this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
    	    
            return this;
     	},
     	_setLabel : function(){
     	    var that = this;
     	    $.get(
    	        "/commute/lastiestdate",
    	        function(data){
    	            if(data.length === 0){
    	                that.label.parent().css("display","none");
    	            }else{
    	                that.label.parent().css("display","block");
    	                that.label.text("Lastest data : " + data["0"].date);
    	                that.lastestDate = data["0"].date;
    	            }
    	        }
    	    );
     	},
    });
    
    return CreateDataView;
});