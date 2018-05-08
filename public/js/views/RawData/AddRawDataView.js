define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'dialog',
  'csvParser',
  'cmoment',
  'i18n!nls/common',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/layout/default.html',
  'models/common/RawDataModel',
  'collection/common/RawDataCollection',
  'models/sm/UserModel',
  'collection/sm/UserCollection',
  'views/RawData/popup/AddRawDataAddPopupView',
  'views/component/ProgressbarView'
  
], function($, _, Backbone, BaseView, Grid, Schemas, Dialog, csvParser, Moment, i18nCommon,
    HeadHTML, ContentHTML, LayoutHTML, 
    RawDataModel, RawDataCollection, UserModel, UserCollection,
    AddRawDataAddPopupView, ProgressbarView
){
    var AddRawDataView = BaseView.extend({
        el:$(".main-container"),
        
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
    	    this.userCollection = new UserCollection();
    	    this.userCollection.fetch();
    	    
    	    this.rawDataCollection = new RawDataCollection();
    	    
            this.gridOption = {
    		    el:"addRawDataContent",
    		    id:"addRawDataTable",
    		    column:[
    		        i18nCommon.ADD_RAW_DATA.GRID_COL_NAME.DEPARTMENT,
    		        i18nCommon.ADD_RAW_DATA.GRID_COL_NAME.NAME,
    		        i18nCommon.ADD_RAW_DATA.GRID_COL_NAME.DATE,
    		        i18nCommon.ADD_RAW_DATA.GRID_COL_NAME.TIME,
    		        i18nCommon.ADD_RAW_DATA.GRID_COL_NAME.TYPE
    		    ],
    		    dataschema:[ "department", "name", "date", "time", "type"],
    		    collection:this.rawDataCollection,
    		    detail: true,
    		    fetch: false,
    		    buttons:["search"],
    		    order:[[3,"desc"], [4,"desc"]]
    		};
    		
    		this._buttonInit();
    	},
    	render:function(){
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layout=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:i18nCommon.ADD_RAW_DATA.TITLE, subTitle:i18nCommon.ADD_RAW_DATA.SUB_TITLE})));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    this.progressbar = new ProgressbarView();
    	    _layout.append(_head);
            _layout.append(_content);
            _layout.append(this.progressbar.render());
            
            
    	    $(this.el).append(_layout);
    	    
    	    var _gridSchema=Schemas.getSchema('grid');
    	    this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
            
            this._disabledOkBtn(true);
            
            return this;
     	},
    	_buttonInit:function(){
    	    this._addAddBtn();
    	    this._addCommitBtn();
    	},
    	_addAddBtn : function(){
    	      var that = this;
    	    
    	    // ADD 버튼
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"add",
    	        tooltip:i18nCommon.ADD_RAW_DATA.ADD_DIALOG.TOOLTIP,
    	        click:function(){
    	            var addRawDataAddPopupView = new AddRawDataAddPopupView();
    	            Dialog.show({
    	                title:i18nCommon.ADD_RAW_DATA.ADD_DIALOG.TITLE, 
                        content:addRawDataAddPopupView, 
                        buttons: [{
                            id: 'rawDataCommitBtn',
                            cssClass: Dialog.CssClass.SUCCESS,
                            label: i18nCommon.ADD_RAW_DATA.ADD_DIALOG.BUTTON.ADD,
                            action: function(dialog) {
                                var fileForm = dialog.getModalBody().find("input");

                                var selectedFiles = fileForm[0].files;
                                if(selectedFiles.length > 0){
                                    if(window.File && window.FileList && window.FileReader){
                                        
                                        addRawDataAddPopupView.setProgressDisabled(false);
                                        $(this).prop("disabled", true); // 버튼 disabled
                                        
                                        var file = selectedFiles[0];
                                        var csvReader = new FileReader();
                    
                                        csvReader.addEventListener("load",function(event){
                                            var result = csvParser.csvToArr(event.target.result, ",");
                                            that.rawDataCollection.reset();
                                            var errCount = 0;
                                            var errList = [];
                                            for(var i = 1; i < result.length; i++){ // 제목줄을 빼기 위해서 1부터 시작
                                                addRawDataAddPopupView.setProgresPercent(i / result.length * 100);
                                                var item = result[i];
                                                
                                                if(item.length != 4){    // 4개 줄로 된 데이터가 아니면 분석하지 않는다.
                                                    continue;
                                                }
                                                
                                                var destUserInfo = that.userCollection.where({name_commute:item[1]});
                                                
                                                var resultDate = Moment(item[2], "YYYY-MM-DD HH:mm:ss");
                                                
                                                if(destUserInfo.length == 1){ // 등록된 이름인 경우
                                                    that.rawDataCollection.add(new RawDataModel({
                                                        id : destUserInfo[0].attributes.id,
                                                        name : item[1],
                                                        department : item[0],
                                                        time: resultDate.format("HH:mm:ss"),
                                                        date: resultDate.format("YYYY-MM-DD"),
                                                        char_date : resultDate.format("YYYY-MM-DD HH:mm:ss"),
                                                        year: resultDate.year(),
                                                        type: item[3]
                                                    }));
                                                }else{ // 등록되지 않은 이름인경우 (사번이 없는경우)
                                                    if(item[1].indexOf("청소용") != -1){ // 청소 아저씨 제외하고 id에 '-' 넣어서 결과 출력
                                                        that.rawDataCollection.add(new RawDataModel({
                                                            id : "?",
                                                            name : item[1],
                                                            department : item[0],
                                                            time: resultDate.format("HH:mm:ss"),
                                                            date: resultDate.format("YYYY-MM-DD"),
                                                            char_date : resultDate.format("YYYY-MM-DD HH:mm:ss"),
                                                            year: resultDate.year(),
                                                            type: item[3]
                                                        })); 
                                                        errCount++;
                                                        errList.push(item);
                                                    }
                                                }
                                            }
                                            
                                            dialog.close();
                                            that.grid.render();
                                            
                                            if(errCount > 0){ // 사번이 없는 데이터가 있을경우
                                                Dialog.error(i18nCommon.ADD_RAW_DATA.ADD_DIALOG.MSG.ANALYZE_FAIL + "\n" +errList);
                                                that._disabledOkBtn(true);
                                            }else{
                                                Dialog.info(i18nCommon.ADD_RAW_DATA.ADD_DIALOG.MSG.ANALYZE_COMPLETE);
                                                that._disabledOkBtn(false);
                                            }

                                        });
                                        csvReader.readAsText(file, 'euc-kr');
                                        
                                    } else{
                                        Dialog.error(i18nCommon.ADD_RAW_DATA.ADD_DIALOG.MSG.FILE_API_ERR);
                                    }
                                }else{
                                    Dialog.error(i18nCommon.ADD_RAW_DATA.ADD_DIALOG.MSG.NOT_SELECT_FILE);
                                }
                            }
                        }, {
                            label: i18nCommon.ADD_RAW_DATA.ADD_DIALOG.BUTTON.CANCEL,
                            action: function(dialog) {
                                dialog.close();
                            }
                        }]
    	            });
    	        }
    	    });  
    	},
    	_addCommitBtn: function(){
    	    var that = this;
    	    // Commit
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"ok",
    	        tooltip:i18nCommon.ADD_RAW_DATA.COMMIT_DIALOG.TOOLTIP,
    	        click:function(){
    	            Dialog.confirm({
    	                msg : i18nCommon.ADD_RAW_DATA.COMMIT_DIALOG.MESSAGE,
                        action:function(){
                            var dfd = new $.Deferred();
                            that.rawDataCollection.save({
                                success : function(result){
                                    dfd.resolve();
                                },
                                error : function(){
                                    dfd.reject();
                                }
                            });
            	            return dfd;
                        },
                        actionCallBack:function(res){//response schema
                            Dialog.info(i18nCommon.ADD_RAW_DATA.COMMIT_DIALOG.MSG.COMMIT_COMPLET);
                        },
                        errorCallBack:function(){
                            Dialog.error(i18nCommon.ADD_RAW_DATA.COMMIT_DIALOG.MSG.COMMIT_FAIL);
                        },
    					
    	            });
    	        }
    	    });  
    	},
    	
     	_disabledOkBtn : function(flag){
     	    var okbtn = this.grid.getButton("ok");
            $(this.el).find("#"+okbtn).prop("disabled", flag);
     	}
     	
    });
    return AddRawDataView;
});