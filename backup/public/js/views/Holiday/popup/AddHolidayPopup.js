define([ 
	'jquery',
	'underscore',
	'backbone',
	'cmoment',
	'util',
	'i18n!nls/common',
  	'lib/component/form',
  	'models/common/HolidayModel',
	'text!templates/default/datepicker.html',
], function(
	$, _, Backbone, Moment, Util, i18nCommon, Form,
	HolidayModel,
	DatePickerHTML
) {
	var CreateHolidayPopup = Backbone.View.extend({
		initialize : function() {

		},
		render : function(el) {
			var dfd= new $.Deferred();
            if (!_.isUndefined(el)) this.el=el;
    	    
    	    var _view = this;
    	   
            var _form = new Form({
    	        el:_view.el,
    	        form:undefined,
    	        childs:[{
	                type:"date",
	                name:"ahDatePicker",
	                label:i18nCommon.HOLIDAY_MANAGER.ADD_DIALOG.FORM.DATE,
	                format:"YYYY-MM-DD",
    	        },{
	                type:"text",
	                name:"addHolidayMemo",
	                label:i18nCommon.HOLIDAY_MANAGER.ADD_DIALOG.FORM.MEMO,
    	        }]
    	    });
    	    
    	    _form.render().done(function(){
    	        _view.form=_form;
    	        dfd.resolve();
    	    }).fail(function(){
    	        dfd.reject();
    	    });  
            return dfd.promise();
		},
		
		addHoliday : function(){
			var dfd = new $.Deferred();
			var _data = this.form.getData();
			console.log(_data);
			
            var date = Moment(_data.ahDatePicker)
            var memo = _data.addHolidayMemo;
            
            var holidayModel = new HolidayModel({ date: date.format("MM-DD") , memo : memo, year: date.year()});
            
            holidayModel.save({}, {
				success : function(result){
					dfd.resolve(result);
				}, error : function(err){
					dfd.reject(err);
				}
            });
            return dfd.promise();
		}
	});
	
	return CreateHolidayPopup;
});