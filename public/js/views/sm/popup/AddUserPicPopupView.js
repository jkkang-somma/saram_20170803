define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'i18n!nls/common',
	'text!templates/default/file.html',
], function(
	$, _, Backbone, Util, i18nCommon,
	FileFormHTML
) {
	var AddUserPicPopupView = Backbone.View.extend({
		initialize : function() {

		},
		events : {
			
		},
		fileList : []
		,
		render : function(el) {
			var dfd= new $.Deferred();
            
            if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
    	    
    	    var _view = this;
            $(this.el).append("<input type='file' id='AddUserPicFile' multiple style='display:none' accept='.jpg'></input>");
            $(this.el).append("<div style='margin:10px 0'>100px X 140px 크기의 사진을 선택해주세요 (파일형식 : 사번.jpg) </div>");
            $(this.el).append("<div id='filebtn' style='float:left' class='btn btn-default btn-primary'>파일 선택</div>");
            $(this.el).append("<div id='filelabel' style='float: left;margin-left: 10px;'></div>");
            $(this.el).find('#AddUserPicFile').fileupload({
                url : '/userpic',
                dataType: 'image',
                add: function(e, data){
                    _view.fileList.push(data);
                    $(_view.el).find("#filelabel").text(_view.fileList.length + " Files Selected");
                },
                change: function(e,data){
                    $(_view.el).find("#tbl").html("");
                    _view.fileList = [];
                }
            });
            $(this.el).find('#filebtn').click(function(){
                $(_view.el).find("input").trigger("click");
            });
            dfd.resolve();
            return dfd.promise();
		},
		submit : function(){
		    var dfd = new $.Deferred();
		    var _view = this;
		    var promiseArr = [];
		    $.each(_view.fileList, function(idx){
		        promiseArr.push(_view.fileList[idx].submit().promise());
		    });
		    $.when(promiseArr).done(function(){
		    	var result = [];
		    	for(var idx in _view.fileList){
		    		var file = _view.fileList[idx].files[0].name;
		    		result.push(file);
		    	}
		        dfd.resolve(result);
		    });
		    return dfd.promise();
		}
	});
	
	return AddUserPicPopupView;
});