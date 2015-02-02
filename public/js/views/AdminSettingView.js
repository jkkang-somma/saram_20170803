define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'cmoment',
	'comboBox',
	'dialog',
	'models/MessageModel',
	'models/sm/SessionModel',
	'text!templates/inputForm/textbox.html',
	'text!templates/inputForm/textarea.html',
	'text!templates/inputForm/combobox.html',
	'text!templates/default/rowbutton.html',
	'text!templates/report/searchFormTemplate.html'
], function($, _, Backbone, Util, Moment,
	ComboBox, Dialog,
	MessageModel, SessionModel,
	TextBoxHTML, TextAreaHTML, ComboboxHTML, RowButtonHTML, searchFormTemplate
) {
	var AdminSettingView = Backbone.View.extend({
		initialize : function() {
            this.messageModel = new MessageModel();
            
		},
		afterRender: function(){
			var that = this;
			this.el.find("#btnCreateExcel").click(function(){
				var url =   "/report/commuteYearReport?year=" + that.getSearchForm().year + "&isInLeaveWorker=" + that.getSearchForm().isInLeaveWorker;
	     		$.fileDownload(url, {
	     		    successCallback: function (url) {
	     		    },
	     		    failCallback: function (html, url) {
	     		    	Dialog.error("보고서 생성 실패");
	     		    }
	     		});
			});
			
			this.el.find("#btnCreateMsg").click(function(){
				var messageModel = new MessageModel(that.getMessageForm());
				messageModel.save().then(function(result){
					Dialog.info("공지사항 설정을 변경했습니다.");
				}, function(result){
					Dialog.error("공지사항 변경 실패!!")
				})
			});
    	},
    	
		render : function(el) {
			var dfd= new $.Deferred();
			var that = this;
         	this.el = el;
         	
         	var searchForm = _.template( searchFormTemplate )();
         	el.append(searchForm);
         	
         	var startYear = 2000;
			var endYear= new Date().getFullYear();
			
			for (; startYear <= endYear; endYear--) {
				el.find("#selectYear").append($("<option>"+endYear+"</option>"));
			}
         	ComboBox.createCombo(el.find("#selectYear"));
         	
         	this.messageModel.fetch({
         		success : function(){
         			el.find("#msgTextArea").val(that.messageModel.get("text"));
         			if(that.messageModel.get("visible") == 1){
         				el.find("#chkMsgVisible").prop("checked", true);		
         			};
					dfd.resolve(that);		
         		}
         	});
         	
            return dfd.promise();
		},
     	getSearchForm: function() {	// 검색 조건  
     		return {
 				year: this.el.find("#selectYear").val(),
 				isInLeaveWorker: ( this.el.find("#chkleaveWorker").is(":checked")? true : false )
 			};
     	},
     	
     	getMessageForm: function() {
     		return {
 				text: this.el.find("#msgTextArea").val(),
 				visible: ( this.el.find("#chkMsgVisible").is(":checked")? true : false )
 			};
     	}
	});
	
	return AdminSettingView;
});