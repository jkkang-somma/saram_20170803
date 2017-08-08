define([
        'jquery',
        'jquery.ui',
        'underscore',
        'backbone',
        'core/BaseView',
        'schemas',
        'i18n!nls/common',
        'models/sm/SessionModel',
        'dialog',

        'text!templates/default/head.html',
        'text!templates/gis/gisView.html',
        'text!templates/gis/gisViewTemplate.html',
        'text!templates/gis/person.html',

        'collection/sm/UserCollection',
        'collection/sm/DepartmentCollection'
        ], function(
        		$, jui, _, Backbone, BaseView, Schemas, i18Common, SessionModel, Dialog,
        		HeadHTML, ContentHTML, LayoutHTML, PersonTemplate,
        		UserCollection, DepartmentCollection
        )
        {
	var GisView = BaseView.extend({
		el:".side-container",
		initialize:function(){
			this.option = {
					el:"gis_content", 
					pos_y1:44,
					pos_y2:102,
					pos_y3:205,
					pos_y4:263,
					pos_y5:325,

					draggingIndex : null,
					moveIndex:-1,

					userCollection:null,
			};
		},

		events: {
			'click #gisSaveBtn' : 'onClickSaveBtn',
		},

		onClickSaveBtn:function(){
			var _this = this;
			Dialog.confirm({
	        	msg : "수정하시겠습니까?",
                action:function(){
                	var dfd = new $.Deferred();
                	if ( SessionModel.getUserInfo().admin == 1 ) {

                		// 1. 지정 자리가 있을 경우
						var $personList = $(_this.el).find(".gis_position");
						for ( var i = 0 ; i < $personList.size() ; i++ ) {
							var $person = $($personList[i]);
							if ( $person.children().size() >= 2 ) {
								// 자리번호
								var pos_id = $person[0].id;

								// 사번
								var p = $person.children()[1];
								var id = p.id;

								// 사번 정보를 찾아 자리 정보가 다른 경우 업데이트 하도록 함.
								var userModel = _this.option.userCollection.findWhere({id:id});
								if ( !_.isUndefined(userModel) && userModel.get("gis_pos") != pos_id ) {
									userModel.set("gis_pos", pos_id);
									_this.ajaxCall(userModel);
								}
							}
						}

						// 2. 지정 자리가 없는 인원
						var $gis_member_list = $(_this.el).find("#gis_member_list .gis_person");
						for ( var i = 0 ; i < $gis_member_list.length ; i++ ) {
							var person = $gis_member_list[i];
							var userModel = _this.option.userCollection.findWhere({id:person.id});
								if ( !_.isUndefined(userModel) && userModel.get("gis_pos") != null ) {
									userModel.set("gis_pos", null);
									_this.ajaxCall(userModel);
								}
						}

						dfd.resolve();
                	}
                	return dfd.promise();
                },
                actionCallBack:function(res){//response schema
                	_this.render();
                },
    	    });
		},

		ajaxCall:function(userModelOne) {
			var dfd = new $.Deferred();
    	    var url = "/user/setGisPos/" + userModelOne.get("id");
    	    var ajaxSetting = {
    	        method : "PUT",
    	        data : userModelOne.attributes,
    	        success : function(result){
    	            dfd.resolve();
    	        },
    	        error : function(){
    	            dfd.resolve();
    	        }
    	    };
    	    
    	    $.ajax( url, ajaxSetting );
     		return dfd.promise();
        },

		addDragEvent:function() {
			var _this = this;
			$(this.el).find(".gis_person").draggable({
				// appendTo : ".gis_position",
				helper: 'clone',
				scroll: false,
				// revert: true,
				// stack: "div",
				start : function(event,ui){
					_this.option.moveIndex = $(this).attr("id");
					console.log("start : " + _this.option.moveIndex);
					// $(this).draggable("option", "revert", true);
					// $(this).draggable("option", "appendTo", "#gis_main");
					$(".gis_person").css("zIndex", 10);
					$(this).css("zIndex", 100);
				},
				stop : function(event, ui){
					_this.option.moveIndex = -1;
					console.log("end : " + _this.option.moveIndex);
				}
			});

			$(this.el).find(".gis_position").droppable({
				drop : function(event, ui) {
					if ( _this.option.moveIndex != -1 ) {
						if ( $(this).children().size() >= 2 ) {
							console.log("already exitst");
							var alreadyExistNode = $(this).children()[1];
							$(_this.el).find("#gis_member_list").append(alreadyExistNode);
						}
						var $person = $(_this.el).find("#"+_this.option.moveIndex);
						$person.parent().removeClass("added");

						$(this).append($(_this.el).find("#"+_this.option.moveIndex));
						$(this).addClass("added");
					}

					// 1 : 사장님
					// 2 : 부사장님
					// 3 ~ 6 : 관리부
					// 10 ~ 19 : y1 ( 최상단 라인 )
					// 30 ~ 40 : y2
					// 50 ~ 63 : y3
					// 70 ~ 83 : y4
					// 90 ~ 97 : y5

					if ( this.id == "gis_pos_01" || this.id == "gis_pos_02" ||
						 this.id.indexOf("gis_pos_3") >= 0 || this.id.indexOf("gis_pos_7") >= 0 || 
						 this.id.indexOf("gis_pos_8") >= 0 ) 
					{
						$(this).find("span").insertAfter( $(this).find("img") );
						$(this).find("img").css("margin-top", "");
					}else{
						$(this).find("img").insertAfter( $(this).find("span") );
						$(this).find("img").css("margin-top", "0px");
					}
				}
			});

			$(this.el).find("#gis_member_list").droppable({
				drop : function(event, ui) {
					if ( _this.option.moveIndex != -1 ) {
						var $person = $(_this.el).find("#"+_this.option.moveIndex);
						$person.parent().removeClass("added");
						$(this).append($person);
						$person.find("span").insertAfter( $person.find("img") );
						$person.find("img").css("margin-top", "");
					}
				}
			});
		},

		onSave:function() {

		},
		onDropToPosition:function (target) {
			var childNodes = target.currentTarget.childNodes;
			if ( childNodes.length != 0 ) {
				for ( var i = childNodes.length - 1 ; i >= 0; i-- ) {
					var existNode = childNodes[i];
					var memberList = $(this.el).find("#gis_member_list");
					memberList[0].appendChild(document.getElementById(existNode.id));	
				}
			}

			target.currentTarget.appendChild(document.getElementById(this.option.draggingIndex));
		},

		onDropToList:function (target) {
			var memberList = $(this.el).find("#gis_member_list");
			memberList[0].appendChild(document.getElementById(this.option.draggingIndex));	
		},

		onDragEnter:function() {
			return false;
		},

		onDragOver:function() {
			return false;
		},

		render:function(){
			if ( $(this.el).find("giscontainer").length == 1 ) {
				$(this.el).find("giscontainer")[0].remove();
			}

			var _headSchema=Schemas.getSchema('headTemp');
			var _headTemp=_.template(HeadHTML);
			var _layOut=$(LayoutHTML);
			// Head
			var date = new Date();
			var yyyy = date.getFullYear().toString();
			var mm = (date.getMonth()+1).toString();
			var dd  = date.getDate().toString();
			var mmChars = mm.split('');
			var ddChars = dd.split('');
			var dateTime = yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);

			var _head=$(_headTemp(_headSchema.getDefault({title:i18Common.GIS.TITLE, subTitle:dateTime})));
			_head.addClass("left-padding");
			_head.addClass("relative-layout"); 		 
			$(_head).find("small").addClass("small");			  					
			var _content=$(ContentHTML).attr("id", this.option.el);		
			_layOut.append(_head);
			_layOut.append(_content);
			$(this.el).html(_layOut);

			var promiseArr = [];
			this.option.userCollection = new UserCollection();
			promiseArr.push(this.option.userCollection.fetch());
			var departmentCollection = new DepartmentCollection();
			promiseArr.push(departmentCollection.fetch());
			var _this = this;

			// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// 자리 위치 설정 총 63자리
			// 1 : 사장님
			// 2 : 부사장님
			// 3 ~ 6 : 관리부
			// 10 ~ 19 : y1 ( 최상단 라인 )
			// 30 ~ 40 : y2
			// 50 ~ 63 : y3
			// 70 ~ 83 : y4
			// 90 ~ 97 : y5

			var gisMainDiv = $(this.el).find("#gis_main");
			var htmlStr = "<div id='<ID>' class='gis_position' style='top:<TOP>px; left:<LEFT>px;'><div class='num'><NUM></div></div>";

			// 1 : 사장님
			var htmlStr2 = htmlStr.replace("<ID>", "gis_pos_01").replace("<TOP>", "252").replace("<LEFT>", "65").replace("<NUM>", 1);
			gisMainDiv.append(htmlStr2);

			// // 2 : 부사장님
			htmlStr2 = htmlStr.replace("<ID>", "gis_pos_02").replace("<TOP>", "72").replace("<LEFT>", "65").replace("<NUM>", 2);
			gisMainDiv.append(htmlStr2);

			// // 3 ~ 6 : 관리부
			htmlStr2 = htmlStr.replace("<ID>", "gis_pos_03").replace("<TOP>", "208").replace("<LEFT>", "374").replace("<NUM>", 3);
			gisMainDiv.append(htmlStr2);
			htmlStr2 = htmlStr.replace("<ID>", "gis_pos_04").replace("<TOP>", "273").replace("<LEFT>", "300").replace("<NUM>", 4);
			gisMainDiv.append(htmlStr2);
			htmlStr2 = htmlStr.replace("<ID>", "gis_pos_05").replace("<TOP>", "273").replace("<LEFT>", "374").replace("<NUM>", 5);
			gisMainDiv.append(htmlStr2);
			htmlStr2 = htmlStr.replace("<ID>", "gis_pos_06").replace("<TOP>", "332").replace("<LEFT>", "374").replace("<NUM>", 6);
			gisMainDiv.append(htmlStr2);

			// 10 ~ 19 : y1 ( 최상단 라인 )
			var posLeft = 760;
			for ( var i = 10 ; i <= 13 ; i++ ) {
				htmlStr2 = htmlStr.replace("<ID>", "gis_pos_"+i).replace("<TOP>", this.option.pos_y1).replace("<LEFT>", posLeft).replace("<NUM>", i);
				gisMainDiv.append(htmlStr2);
				if ( i % 2 == 0 )
					posLeft += 68;
				else
					posLeft += 40;
			}
			posLeft += 26;
			for ( var i = 14 ; i <= 20 ; i++ ) {

				if ( i == 18 ) {
					posLeft += 38;
					continue;
				}

				htmlStr2 = htmlStr.replace("<ID>", "gis_pos_"+i).replace("<TOP>", this.option.pos_y1).replace("<LEFT>", posLeft).replace("<NUM>", i);
				gisMainDiv.append(htmlStr2);
				if ( i % 2 == 1 )
					posLeft += 68;
				else
					posLeft += 40;
			}

			// 30 ~ 40 : y2
			posLeft = 760;
			for ( var i = 30 ; i <= 33 ; i++ ) {
				htmlStr2 = htmlStr.replace("<ID>", "gis_pos_"+i).replace("<TOP>", this.option.pos_y2).replace("<LEFT>", posLeft).replace("<NUM>", i);
				gisMainDiv.append(htmlStr2);
				if ( i % 2 == 0 )
					posLeft += 68;
				else
					posLeft += 40;

			}
			posLeft += 26;
			for ( var i = 34 ; i <= 40 ; i++ ) {
				htmlStr2 = htmlStr.replace("<ID>", "gis_pos_"+i).replace("<TOP>", this.option.pos_y2).replace("<LEFT>", posLeft).replace("<NUM>", i);
				gisMainDiv.append(htmlStr2);
				if ( i % 2 == 1 )
					posLeft += 68;
				else
					posLeft += 40;
			}


			// 50 ~ 63 : y3
			posLeft = 610;
			for ( var i = 50 ; i <= 63 ; i++ ) {
				htmlStr2 = htmlStr.replace("<ID>", "gis_pos_"+i).replace("<TOP>", this.option.pos_y3).replace("<LEFT>", posLeft).replace("<NUM>", i);
				gisMainDiv.append(htmlStr2);
				if ( i % 2 == 0 )
					posLeft += 68;
				else
					posLeft += 40;
			}


			// 70 ~ 83 : y4
			posLeft = 610;
			for ( var i = 70 ; i <= 83 ; i++ ) {
				htmlStr2 = htmlStr.replace("<ID>", "gis_pos_"+i).replace("<TOP>", this.option.pos_y4).replace("<LEFT>", posLeft).replace("<NUM>", i);
				gisMainDiv.append(htmlStr2);
				if ( i % 2 == 0 )
					posLeft += 68;
				else
					posLeft += 40;
			}


			// 90 ~ 97 : y5
			// 90 91 92 93 94 95 96 97
			var leftPosList = [610, 718, 822, 934, 1002, 1150, 1258, 1326];
			for ( var i = 90 ; i <= 97 ; i++ ) {
				htmlStr2 = htmlStr.replace("<ID>", "gis_pos_"+i).replace("<TOP>", this.option.pos_y5).replace("<LEFT>", leftPosList[i-90]).replace("<NUM>", i);
				gisMainDiv.append(htmlStr2);	
			}			

			// 사원 정보를 지정된 자리에 배치
			$.when.apply($, promiseArr).then(function(userParam, deptParam){
				var userList = userParam[0];
				var deptList = deptParam[0];

				var deptMap = {};
				for ( var deptIdx = 0 ; deptIdx < deptList.length ; deptIdx++ ) {
					var dept = deptList[deptIdx];
					deptMap[dept.code] = dept;
				}

				var gis_member_list = $(_this.el).find("#gis_member_list");
				for ( var userIdx = 0 ; userIdx < userList.length ; userIdx++ ) 
				{
					// 수원 제외 ( 부서 기준 )
					var user = userList[userIdx];
					if ( deptMap[user.dept_code].area != "서울" ) {
						continue;
					}

					// 퇴사자 제외
					if ( user.leave_company != null && user.leave_company != "" ) {
						continue;
					}

					var htmlTag = PersonTemplate.replace("<USER_ID>", user.id).replace("<USER_NAME>", user.name).replace("<PIC_SRC>", "/userpic?file="+user.id);

					// 자리 배치가 이미 되어 있는 경우 지정된 자리로 설정
					if ( !_.isNull(user.gis_pos) && user.gis_pos.length != 0 ) {
						var $userPos = $(_this.el).find("#" + user.gis_pos);
						if (  $userPos.length == 1 ) {

							$userPos.append(htmlTag);
							$userPos.addClass("added");

							if ( $userPos[0].id == "gis_pos_01" || $userPos[0].id == "gis_pos_02" ||
						 		 $userPos[0].id.indexOf("gis_pos_3") >= 0 || $userPos[0].id.indexOf("gis_pos_7") >= 0|| 
						 		 $userPos[0].id.indexOf("gis_pos_8") >= 0 ) 
							{
								$userPos.find("span").insertAfter( $userPos.find("img") );
								$userPos.find("img").css("margin-top", "");
							}else{
								$userPos.find("img").insertAfter( $userPos.find("span") );
								$userPos.find("img").css("margin-top", "0px");
							}

						}else{
							// exception case
							if ( SessionModel.getUserInfo().admin == 1 ) {
								gis_member_list.append(htmlTag);
							}
						}
					}else{
						if ( SessionModel.getUserInfo().admin == 1 ) {
							gis_member_list.append(htmlTag);
						}
					}
				}

				if ( SessionModel.getUserInfo().admin != 1 ) {
					gis_member_list.remove();
				}else{
					// 이벤트 추가
					_this.addDragEvent();
				}
			});

			// 저장 버튼 ( 관리자 )
			if ( SessionModel.getUserInfo().admin != 1 ) {
				$(_this.el).find("#gisSaveBtn").remove();
			}
		}
	});
	return GisView;
});
