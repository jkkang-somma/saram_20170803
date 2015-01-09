define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'dialog',
  'datatables',
  'csvParser',
  'core/BaseView',
  'text!templates/addrawdataTemplate.html',
  'models/am/RawDataModel',
  'collection/sm/UserCollection',
  'collection/am/RawDataCollection',
], function($, _, Backbone, Bootstrap, Dialog, Datatables, csvParser, BaseView, addrawdataTemplate,
RawDataModel, UserCollection, RawDataCollection){
    var UserListView = BaseView.extend({
        el:$(".main-container"),
        
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
    	    this.userCollection = new UserCollection();
    	    this.userCollection.fetch();
    	    
    	    this.rawDataCollection = new RawDataCollection();
    	},
    	
    	events: {
    	    'change #inputRawDataFile' : 'analyzeFile',
    	    'click #commitRawData' : 'commitRawData'
    	},
    	
    	render:function(){
            $(this.el).append(addrawdataTemplate);
            this.renderTable();
     	},
     	
     	displayErrDiv:function(option){
     	    $(this.el).find("#rawDataErr").css("display",option);                    
     	},
     	
     	disableCommitBtn:function(option){
            if(option == "disabled")
                $(this.el).find("#commitRawData").attr("disabled", "disabled");
            else
                $(this.el).find("#commitRawData").removeAttr("disabled");
     	},
     	
     	analyzeFile : function(){
            var selectedFiles = $('input[id="inputRawDataFile"]')[0].files;
            
            if(selectedFiles.length > 0){
                if(window.File && window.FileList && window.FileReader){
                    var that = this;
                    this.displayErrDiv("none") ;
                    var file = selectedFiles[0];
                    var csvReader = new FileReader();

                    csvReader.addEventListener("load",function(event){
                        var result = csvParser.csvToArr(event.target.result, ",");
                        var errCount = 0;
                        for(var i = 1; i < result.length; i++){ // 제목줄을 빼기 위해서 1부터 시작
                            var item = result[i];
                            
                            if(item.length != 4){
                                continue;
                            }
                            
                            var id = that.userCollection.where({name_commute:item[1]});

                            if(id.length == 1){ // 등록된 이름인 경우
                                that.rawDataCollection.add(new RawDataModel({
                                    id : id[0].attributes.id,
                                    name : item[1],
                                    department : item[0],
                                    time: item[2],
                                    type: item[3]
                                }));
                            }else{ // 등록되지 않은 이름인경우 (사번이 없는경우)
                                if(item[1] != "청소용 출입"){ // 청소 아저씨 제외하고 id에 '-' 넣어서 결과 출력
                                    that.rawDataCollection.add(new RawDataModel({
                                        id : "-",
                                        name : item[1],
                                        department : item[0],
                                        time: item[2],
                                        type: item[3]
                                    })); 
                                    errCount++;    
                                }
                                
                            }
                        }
                        
                        if(errCount > 0){ // 사번이 없는 데이터가 있을경우 갯수를 표시한다.
                            $(that.el).find("#rawDataErr").find("span").text(errCount);
                            that.displayErrDiv("block");
                        }else{
                            that.disableCommitBtn("enabled");
                        }
                        
                        that.renderTable();
                    });
                    
                    csvReader.readAsText(file, 'euc-kr');
                    
                } else{
                    console.log("Your browser does not support File API");
                }
            }else{
                this.rawDataCollection.reset();
                this.renderTable();
                this.displayErrDiv("none") ;
                this.disableCommitBtn("disabled");
            }
     	    return false;    
     	},
     	
     	renderTable : function(){
     	    if($.fn.DataTable.isDataTable($(this.el).find("#rawDataTable")))
     	        $(this.el).find("#rawDataTable").parent().replaceWith("<table id='rawDataTable'></table>");
     	    
     	    
     	    $(this.el).find("#rawDataTable").dataTable({
     	        "data" : this.rawDataCollection.toJSON(),
     	        "columns" : [
     	            { data : "id", "title" : "id" },
                    { data : "name", "title" : "name" },
                    { data : "department", "title" : "department" },
                    { data : "time", "title" : "time"},
                    { data : "type", "title" : "type"}
     	        ]
     	    })
     	    return this;
     	},
     	
     	commitRawData : function(){
     	    this.rawDataCollection.save();
     	    this.disableCommitBtn("disabled");
            return false;
     	}
     	
    });
    return UserListView;
});