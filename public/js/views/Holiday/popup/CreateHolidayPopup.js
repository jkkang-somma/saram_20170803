define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'comboBox',
	'cmoment',
	'i18n!nls/common',
  	'lib/component/form',
  	'collection/common/HolidayCollection',
], function($, _, Backbone, Util, Combobox, Moment, i18nCommon, Form,
HolidayCollection){
	
	var holidays = [
    	{ date: "01-01", memo : "신정",         lunar : false,  _3days : false}, 
    	{ date: "03-01", memo : "삼일절",       lunar : false,  _3days : false},
    	{ date: "05-05", memo : "어린이날",     lunar : false,  _3days : false},
    	{ date: "06-06", memo : "현충일",       lunar : false,  _3days : false},
    	{ date: "08-15", memo : "광복절",		lunar : false,  _3days : false},
    	{ date: "10-03", memo : "개천절",		lunar : false,  _3days : false},
    	{ date: "10-09", memo : "한글날",		lunar : false,  _3days : false},
    	{ date: "12-25", memo : "성탄절",		lunar : false,  _3days : false},
    	{ date: "01-01", memo : "설날",		    lunar : true,   _3days : true },
    	{ date: "04-08", memo : "석가탄신일",	lunar : true,   _3days : false},
    	{ date: "08-15", memo : "추석",		    lunar : true,   _3days : true },
    ];
    
   function _getYearData(){
   	var today = Moment();
 	   var yeardata = [];
 	    
 	   for(var i = 0; i< 5; i++){
 	   	yeardata.push({key:today.year() + i,value : today.year() + i,});
 	   }
 	   return yeardata;
   }
   
	var CreateHolidayPopup = Backbone.View.extend({
		initialize : function() {

		},
		events : {

		},
		render : function(el) {
			var dfd= new $.Deferred();
			var _view = this;
         if (!_.isUndefined(el)) this.el=el;
    	   
    	   var today = Moment();
    	   
			var _form = new Form({
				el:_view.el,
				form:undefined,
				childs:[{
					type:"combo",
					name:"year",
					label:i18nCommon.HOLIDAY_MANAGER.CREATE.YEAR,
					value:today.year(),
					collection: _getYearData()
				}]
			});
    	    
    	    _form.render().done(function(){
    	        _view.form=_form;
    	        dfd.resolve();
    	    }).fail(function(){
    	        dfd.reject();
    	    });  
    	    
    	    
         dfd.resolve();
         return dfd.promise();
		},
		createHoliday : function(){
			var dfd= new $.Deferred();
			var _data = this.form.getData();
			
			var year = _data.year;
			
			var newHolidayCollection = new HolidayCollection();
			
			for(var key in holidays){
			   holidays[key].year = year;
			   newHolidayCollection.add(holidays[key]);
			}
			
			newHolidayCollection.save({
			   success : function(result){
			       dfd.resolve(result);
			   },
			   error : function(err){
			       dfd.reject(err);
			   }
			});
			return dfd.promise();
		}
	});
	
	return CreateHolidayPopup;
});