define([
  'jquery',
  'underscore',
  'underscore.string',
  'backbone',
  'core/BaseView',
  'log',
  'dialog',
  'i18n!nls/common',
  'lib/component/form',
  'models/sm/UserModel',
  'code',
  'collection/common/CodeCollection',
  'text!templates/default/input.html',
  'models/officeitem/IpAssignedManagerModel',
  'collection/sm/UserCollection',
], function($, _, _S, Backbone, BaseView, log, Dialog, i18nCommon, Form, UserModel, Code, CodeCollection, container, IpAssignedManagerModel, UserCollection){
	var LOG= log.getLogger("EditIpView");
	var availableTags = [];
	var availableTagsUser = [];
	var deptCodeCollectionData = [];
	var useCodeCollectionData = [];
	var init_data;
	var selectedTxt = "부서";

	var EditIpView = BaseView.extend({
		initialize:function(data){
			init_data = data;
			$(this.el).html('');
			$(this.el).empty();

			this.model=new IpAssignedManagerModel(data);
			_.bindAll(this, "submitSave");
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
				//console.log(availableTags[index]);
			}
			if(availableTags.indexOf(init_data.use_user) == -1) {
				selectedTxt = "직원";
			}
			else {
				selectedTxt = "부서";
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
						name:"ip",
						label:i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.IP,
						value:_model.ip,
						disabled:"readOnly",
						group:"requireInfo"
					}, {
						type:"combo",
						name:"use_dept",
						label:i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.USE_DEPT,
						value:selectedTxt,
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
						id:"autocomplete",
						label:i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.USE_USER,
						value:_model.use_user,
						//collection:availableTags,
						input_data: deptCodeCollection,
						group:"requireInfo"
					},{
						type:"text",
						name:"memo",
						label:i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.MEMO,
						value:_model.memo,
						group:"requireInfo"
					}]
				});
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
					//console.log(availableTagsUser[userCnt]);
					userCnt++;
				}
				else {
					//console.log("Leave_company[" + useCodeCollectionData.models[index].attributes.name + "][" + useCodeCollectionData.models[index].attributes.leave_company + "]");
				}
			}

			$(document).ready(function() {
				if (selectedTxt == "부서") {
					$("#autocomplete").autocomplete({
						source: availableTags
					});
				}
				else {
					$("#autocomplete").autocomplete({
						source: availableTagsUser
					});
				}

				$(".ui-autocomplete").css("position", "absolute");
				$(".ui-autocomplete").css("top", "100px");
				$(".ui-autocomplete").css("left", "100px");
				$(".ui-autocomplete").css("z-index", "2147483647");
				$(".ui-autocomplete").css("background", "#FFFFFF");
		
				$('#autocomplete').val(init_data.use_user);

				$(".selectpicker").on('change', function(e){// 콤보박스 선택시 히든값 셋팅
					var _text=$(this).find("option:selected").text();
					if(_text == "직원") {
						//console.log(_text);
						selectedTxt = _text;
						$('#autocomplete').val("");
						$('#autocomplete').autocomplete("option", { source: availableTagsUser });
					}
					else if (_text == "부서") {
						//console.log(_text);
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
		submitSave : function(e){
			var dfd= new $.Deferred();
			var _view=this,_form=this.form,_data=_form.getData();
			if(!_view.checkFormData(_data.use_user)) {
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

					_IpAssignedManagerModel.attributes._id="-2";

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
						_IpAssignedManagerModel.save({},{
							success:function(model, xhr, options){
//								if(!_.isEmpty(_data.use_user)) {
									_data.use_user = saveDisplaydata;
//								}
								dfd.resolve(_.defaults(_data, _IpAssignedManagerModel.default));
							},
							error:function(model, xhr, options){
								var respons=xhr.responseJSON;
								Dialog.error(i18nCommon.IPCONFIRM.IP.REGISTER_FAIL);
								console.log("EditIpView -> submitSave Fail : " + respons.message);
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

					_IpAssignedManagerModel.attributes._id="-2";

					var _validate=_IpAssignedManagerModel.validation(_data, {// 유효성 검사 필드 
						ip:"",
						use_dept : "",
						//use_user : "",
						//memo : "", // memo에 데이터 입력안해도 등록되도록 한다.
					});
					if(!_.isUndefined(_validate)){
						Dialog.warning(_validate);
						dfd.reject();
					} else {
						_IpAssignedManagerModel.save({},{
							success:function(model, xhr, options){
								//if(!_.isEmpty(_data.use_user)) {
									_data.use_user = saveDisplaydata;
								//}
								dfd.resolve(_.defaults(_data, _IpAssignedManagerModel.default));
							},
							error:function(model, xhr, options){
								var respons=xhr.responseJSON;
								Dialog.error(i18nCommon.IPCONFIRM.IP.REGISTER_FAIL);
								console.log("EditIpView -> submitSave Fail : " + respons.message);
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
					//console.log("Undefined data : " + selectedTxt);
				}
			}
			return true;
		},
	});
	return EditIpView;
});