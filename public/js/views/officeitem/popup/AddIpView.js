define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'log',
  'dialog',
  'i18n!nls/common',
  'lib/component/form',
  'code',
  'models/sm/UserModel',
  'collection/common/CodeCollection',
  'collection/officeitem/IpAssignedManagerCollection',
  'models/officeitem/IpAssignedManagerModel',
  'collection/sm/UserCollection',
], function($, _, Backbone, BaseView, log, Dialog, i18nCommon, Form, Code, UserModel, CodeCollection, IpAssignedManagerCollection, IpAssignedManagerModel, UserCollection){
	var LOG= log.getLogger("AddIpView");
	var availableTags = [];
	var availableTagsUser = [];
	var deptCodeCollectionData = [];
	var useCodeCollectionData = [];
	var autocompleteId = "autocomplete";
	var selectedTxt = "부서";

	var AddIpView = BaseView.extend({
		initialize:function(){
			$(this.el).html('');
			$(this.el).empty();
			this.model=new UserModel();
			_.bindAll(this, "submitAdd");
		},
		render:function(el){
			var dfd= new $.Deferred();
			var _view=this;
			if (!_.isUndefined(el)){
				this.el=el;
			}

			var deptCodeCollection=Code.getCollection(Code.DEPARTMENT);
			var partCodeCollection=Code.getCollection(Code.PART);
			var approvalUserCodeCollection= new CodeCollection("approvalUser");
			var positionCodeCollection= Code.getCollection(Code.POSITION);
			deptCodeCollectionData = deptCodeCollection;
			var userCollection = new UserCollection();
			userCollection.fetch({
				success : function(result){
					useCodeCollectionData = result;
				}
			})

			for( var index = 0; index < deptCodeCollectionData.models.length; index++) {
				availableTags[index] = deptCodeCollectionData.models[index].attributes.name + "(" + deptCodeCollectionData.models[index].attributes.code + ")";
				console.log(availableTags[index]);
			}

			$.when(approvalUserCodeCollection.fetch()).done(function(){
			var _model=_view.model.attributes;
			var _form = new Form({
				el:_view.el,
				form:undefined,
				group:[{
					name:"requireInfo",
					label:i18nCommon.SUB_TITLE.REQUIRE_INFO,
					initOpen:true
				}],
				childs:[{
					type:"input",
					//type:"ip_input",
					name:"ip",
					id:"ipText",
					label:i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.IP,
					value:_model.IP,
					group:"requireInfo"
				}, {
					type:"combo",
					name:"use_dept",
					id:"deptCombo",
					label:i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.USE_DEPT,
					value:_model.USE_DEPT,
					//collection:deptCodeCollection,
					collection:[
						{key:"부서",value:"부서"},
						{key:"직원",value:"직원"}
					    ],
					group:"requireInfo",
					linkField:"dept_name"// text 값을 셋팅 해줌 type은 hidden
				}, {
					type:"hidden",
					name:"dept_name",
					value:_model.dept_name,
					group:"requireInfo",
					collection:deptCodeCollection
				},{
					type:"auto_input",
					name:"use_user",
					id:autocompleteId,
					label:i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.USE_USER,
					value:_model.use_user,
					group:"requireInfo",
					input_data: availableTags
				},{
					type:"text",
					name:"memo",
					label:i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.MEMO,
					value:_model.MEMO,
					group:"requireInfo"
				}]});
				_form.render().done(function(){
					_view.form=_form;
					dfd.resolve(_view);
				}).fail(function(){
					dfd.reject();
				});
			}).fail(function(e){
				Dialog.error(i18nCommon.ERROR.USER_EDIT_VIEW.FAIL_RENDER);
				LOG.error(e.responseJSON.message);
				dfd.reject();
			});
			return dfd.promise();
		},
		afterRender: function(){
			var userCnt = 0;
			for(var index = 0; index < useCodeCollectionData.models.length; index++) {
				if (_.isEmpty(useCodeCollectionData.models[index].attributes.leave_company) || useCodeCollectionData.models[index].attributes.leave_company == null) {
					availableTagsUser[userCnt] = useCodeCollectionData.models[index].attributes.name + "(" + useCodeCollectionData.models[index].attributes.id + ")";
					console.log(availableTagsUser[userCnt]);
					userCnt++;
				}
				else {
					console.log("Leave_company[" + useCodeCollectionData.models[index].attributes.name + "][" + useCodeCollectionData.models[index].attributes.leave_company + "]");
				}
			}
			$(document).ready(function() {
		 		$("#autocomplete").autocomplete({
		 			source: availableTags
		 		});
		 		$(".ui-autocomplete").css("position", "absolute");
		 		$(".ui-autocomplete").css("top", "100px");
		 		$(".ui-autocomplete").css("left", "100px");
		 		$(".ui-autocomplete").css("z-index", "2147483647");
		 		$(".ui-autocomplete").css("background", "#FFFFFF");

				$(".selectpicker").on('change', function(e){// 콤보박스 선택시 히든값 셋팅
		 			var _text=$(this).find("option:selected").text();
		 			if(_text == "직원") {
						selectedTxt = _text;
		 				console.log(_text);
		 				$('#autocomplete').val("");
		 				$('#autocomplete').autocomplete("option", { source: availableTagsUser });
		 			}
		 			else if (_text == "부서") {
						console.log(_text);
						selectedTxt = _text;
		 				$('#autocomplete').val("");
		 				$('#autocomplete').autocomplete("option", { source: availableTags });
		 			}
		 			else {
		 				console.log("Undefined data : " + _text);
		 			}
		 		});
		 	});
		},
		submitAdd : function(beforEvent, affterEvent){
			var view = this;
			var dfd= new $.Deferred();
			var _view=this,_form=this.form,_data=_form.getData();

			// if (!view.validIPCheck(_data.ip)) {
			// 	Dialog.warning(i18nCommon.IPCONFIRM.IP.INVALID_IP);
			// 	dfd.reject();
			// }
			if(!view.checkFormData(_data.use_user)) {
				Dialog.warning(i18nCommon.IPCONFIRM.IP.INVALID_USER);
				dfd.reject();
			}
			else {
				var _validate = "";
				if(selectedTxt == "직원") {
					var saveDisplaydata = _data.use_user;
					if(!_.isEmpty(_data.use_user)) {
						var firstArr = (_data.use_user).split("(");
						var strTemp = firstArr[1].split(")");
						_data.use_user = strTemp[0];
					}
					else {
						_data.use_user = "";
					}
					_data.use_dept = "";

					var _IpAssignedManagerModel=new IpAssignedManagerModel(_data);
					var _validate=_IpAssignedManagerModel.validation(_data, {// 유효성 검사 필드 
						ip:"",
						//use_dept : "",
						//use_user : "",
						//memo : "", // memo에 데이터 입력안해도 등록되도록 한다.
					});
					if(!_.isUndefined(_validate)){
						Dialog.warning(_validate);
						dfd.reject();
					} else {
						beforEvent();
						_IpAssignedManagerModel.save({},{
							success:function(model, xhr, options){
								affterEvent();
								//if(!_.isEmpty(_data.use_user)) {
									_data.use_user = saveDisplaydata;
								//}
								dfd.resolve(_.defaults(_data, _IpAssignedManagerModel.default));
							},
							error:function(model, xhr, options){
								var respons=xhr.responseJSON;
								affterEvent();
								Dialog.error(i18nCommon.IPCONFIRM.IP.REGISTER_FAIL);
								console.log("AddIpView -> submitAdd Fail : " + respons.message);
								//Dialog.error(respons.message);
								dfd.reject();
							},
							wait:false
						});
					}
				}
				else if (selectedTxt == "부서") {
					var saveDisplaydata = _data.use_user;
					if(!_.isEmpty(_data.use_user)) {
						var firstArr = (_data.use_user).split("(");
						var strTemp = firstArr[1].split(")");
						_data.use_dept = strTemp[0];
					}
					else {
						_data.use_dept = "";
					}
					_data.use_user = "";
					var _IpAssignedManagerModel=new IpAssignedManagerModel(_data);
					var _validate=_IpAssignedManagerModel.validation(_data, {// 유효성 검사 필드 
						ip:"",
						//use_dept : "",
						//use_user : "",
						//memo : "", // memo에 데이터 입력안해도 등록되도록 한다.
					});
					if(!_.isUndefined(_validate)){
						Dialog.warning(_validate);
						dfd.reject();
					} else {
						beforEvent();
						_IpAssignedManagerModel.save({},{
							success:function(model, xhr, options){
								affterEvent();
								//if(!_.isEmpty(_data.use_user)) {
									_data.use_user = saveDisplaydata;
								//}
								dfd.resolve(_.defaults(_data, _IpAssignedManagerModel.default));
							},
							error:function(model, xhr, options){
								var respons=xhr.responseJSON;
								affterEvent();
								Dialog.error(i18nCommon.IPCONFIRM.IP.REGISTER_FAIL);
								console.log("AddIpView -> submitAdd Fail : " + respons.message);
								//Dialog.error(respons.message);
								dfd.reject();
							},
							wait:false
						});
					}
				}
			}
			return dfd.promise();
		},
		getFormData: function(form) {
			var unindexed_array = form.serializeArray();
			var indexed_array= {};
			
			$.map(unindexed_array, function(n, i){
				indexed_array[n['name']] = n['value'];
			});
			return indexed_array;
		},
		checkFormData: function(data) {
			if(_.isEmpty(data)) {
				return true;
			}
			else {
				if(selectedTxt == "직원") {
					if(availableTagsUser.indexOf(data) == -1)
						return false;
				}
				else if (selectedTxt == "부서") {
					if(availableTags.indexOf(data) == -1)
						return false;
				}
				else {
					console.log("Undefined data : " + selectedTxt);
				}
			}
			return true;
		},
		validIPCheck: function(ipdata) {
			var ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
			var ipArray = ipdata.match(ipPattern);
			if (ipdata == "0.0.0.0" || ipdata == "255.255.255.255" ||
				ipdata == "10.1.0.0" || ipdata == "10.1.0.255" || ipArray == null) {
					return false;
			} else {
				for (i = 0; i < 4; i++) {
					thisSegment = ipArray[i];
					if (thisSegment > 254) {
						return false;               
					}
					if ((i == 0) && (thisSegment > 254)) {
						return false;
					}
				}
			}
    		return true;   
		},
	});
	return AddIpView;
});