define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'lodingButton',
  'schemas',
  'i18n!nls/common',
  'dialog',
  'models/sm/SessionModel',
  'text!templates/default/head.html',
  'text!templates/sm/OrganizationView.html',
  'text!templates/layout/organization.html',
  'collection/sm/UserCollection',
  'collection/sm/DepartmentCollection',
  'collection/sm/PartCollection',
  'code',
], function(
    $, 
    _, 
    Backbone, 
    BaseView, 
    Grid, 
    LodingButton, 
    Schemas, 
    i18Common, 
    Dialog, 
    SessionModel, 
    HeadHTML, 
    ContentHTML, 
    LayoutHTML,  
    UserCollection,
    DepartmentCollection,
	PartCollection,
    Code){
	
    var OrganizationView = BaseView.extend({
    	el:".side-container",
    	initialize:function(){ 	    
    	    this.option = {
        		    el:"organization_content",       		    
        		};
    	},
  	
    	render:function(){
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    //Head 
    	    var date = new Date();
    	    var yyyy = date.getFullYear().toString();
    	    var mm = (date.getMonth()+1).toString();
    	    var dd  = date.getDate().toString();
    	    var mmChars = mm.split('');
    	    var ddChars = dd.split('');
    	    var dateTime = yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
    	    
    	    var _head=$(_headTemp(_headSchema.getDefault({title:i18Common.ORGANIZATION.TITLE, subTitle:dateTime})));
    	    _head.addClass("left-padding");
    	    _head.addClass("relative-layout"); 	     
    	    $(_head).find("small").addClass("small");    	      	        	    
    	    var _content=$(ContentHTML).attr("id", this.option.el);	   
    	    _layOut.append(_head);
    	    _layOut.append(_content);
    	    $(this.el).html(_layOut);

			var promiseArr = [];
    	    var userCollection = new UserCollection();
    	    promiseArr.push(userCollection.fetch());
    	    var departmentCollection = new DepartmentCollection();
    	    promiseArr.push(departmentCollection.fetch());
			var partCollection = new PartCollection();
    	    promiseArr.push(partCollection.fetch());    	    
    	    $.when.apply($, promiseArr).then(function(user, dept, part){
				//data에서 dept_code기준으로 정렬
     	    	var userorg = [];
    	    	var deptorg = [];
				var partorg = [];
    	    	userorg = user[0];
    	    	deptorg = dept[0];	    	
				partorg = part[0];

    	    	function PositionSort(a,b){
		    		if(a.dept_code != "0000" && b.dept_code != "0000"){
	    	    		if(a.position_code==b.position_code){
	    	    			return a.name > b.name ? 1 : -1
	    	    		}
	    	    		return a.position_code > b.position_code ? 1 : -1
	    	    	}	
		    		else if(a.dept_code === "0000" || b.dept_code === "0000"){
	    	    		if(a.position_code==b.position_code){
	    	    			return a.join_company > b.join_company ? 1 : -1
		    			}
		    		return a.position_code > b.position_code ? 1 : -1
		    		}
    	    	}    	    	
    	    	userorg.sort(PositionSort);
    	    	
				// 부서코드 찾기(파트 코드는 부서코드 맨 뒷자리만 사용하도록 약속함.)
				function getFineDeptCode(partCode) {					
					return partCode.substring(0,3) + '0';
				}

				// 파트 코드 정보에 소속된 부서 코드 추가
				_.each(partorg, function(part) {
					var deptCode = getFineDeptCode(part.code);
					_.extend(part, {"dept_code" : deptCode});
				});
				
				// 퇴사자 필터링
				var liveUsers = _.filter(userorg, function(user) {
					if(user.leave_company == null || user.leave_company =="") {
						return true;
					} else {
						return false;
					}
				})

				// 파트장(SL) 최상위로 위치 변경
				function setPartOwnerMove(parts) {
					var newParts = [];
					var partCode = _.uniq(_.pluck(parts, "part_code"));

					// 파트 정보 추출
					var findPartInfo = _.filter(partorg, function(partInfo) {
						if(partInfo.code == partCode) {
							return true;
						}
					})


					if(_.isUndefined(findPartInfo) || findPartInfo.length > 1) {
						console.log("Not found SL !!!");
					} else {
						// 파트 정보를 이용하여
						_.each(parts, function(partInfo) {
							if(!_.isUndefined(findPartInfo[0]) && findPartInfo[0].leader == partInfo.id) {
								newParts.splice(0, 0, partInfo);
							} else {
								newParts.push(partInfo);
							}
						})
					}
					return newParts;
				}

				var organList = [];
				// 그룹별 인원 분류
				var groupByUsers = _.groupBy(liveUsers, "dept_code");
				var deptKeys = _.keys(groupByUsers).sort();
				_.each(deptKeys, function(key) {
					var sDept = groupByUsers[key];
					var partByUsers = _.groupBy(sDept, "part_code");
					var userMap = {};
					_.each(partByUsers, function(userPart) {
						userPart.sort(PositionSort);
						_.extend(userPart, setPartOwnerMove(userPart));
					});
					userMap[key] = partByUsers
					organList.push(userMap);
				});
								
				var seoul = 0;
				var suwon = 0;
				var exception = 0;
				_.each(organList, function(deptData) {										
					//부서별 데이터

					_.each(deptData, function(data, deptCode) {						
						//파트별 데이터
						var count = getUserCount(data);
						getAreaCount(deptCode, count);
						var html = getUserList(deptCode, data);							
						$(_content).find("#dept_" + deptCode + " table").append(html);

						// Title 출력
						var keyVal = _.keys(data)[0];
						var deptTitle = data[keyVal][0].dept_name + "(" + count + "명)";
						$(_content).find("#dept_" + deptCode + " span").append(deptTitle);

						// 품질검증2팀 본사/수원 
						//if(deptCode == 5200 || deptCode == 5400) {
						//	exception += count;
						//	$(_content).find("#dept_5200" + " span").html(exception);
						//} else {
						//	$(_content).find("#dept_" + deptCode + " span").append(count);
						//}
					});					
				});

				function getAreaCount(deptCode, count) {
					var deptInfo =  _.find(deptorg, function(deptData) {
						if(deptData.code == deptCode) {
							return true;
						}	
					});	
					var area = deptInfo.area;
					if(area == "대구") {
						suwon += count;
					} else if(area == "판교") {
						seoul += count;
					}
				}
				
				function getUserCount(users) {
					var count = 0;
					var keys = _.keys(users);
					_.each(keys, function(data) {
						count += _.values(users[data]).length;
					})	
					return count;
				}

				function getUserList(deptCode, userData) {
					var target = $("<div>");					
					var partCode = _.keys(userData).sort();
					_.each(partCode, function(code) {
						var datas = userData[code];					
						if(deptCode == "0000"){
							_.each(datas, function(data) {
							
								// 직급 우측에 메모 추가 2017.08.09
								var roleStr = "";
								if ( data.name == "이남노" ) 
									roleStr = " (사업부장)";
								else if ( data.name == "전영호")
									roleStr = " (영업)";
								else if ( data.name == "유강재")
									roleStr = " (전략사업본부)";
								else if ( data.name == "최홍락")
									roleStr = " (기술연구소장)";
																
								target.append('<tr style = "background-color: white;"><td id=tdfont style = "padding-left: 15px; padding-bottom: 15px; padding-top: 15px;">' 
									+ "<h4 id=printh4><b>" + data.position_name
									+ '<role style="font-size: 15px;font-weight: normal;">'+roleStr+"</role>" + "</h4></b>"
									+ "<br>" +"<b id=printname>"+ data.name + "</b>"+" (" + data.email.replace("@yescnc.co.kr","") + ")" 
									+ "<br>" + data.phone + "(" + data.phone_office + ")" + '</td></tr>');
							});				
						} else {
							//var partTr = $("<table style = 'border:2px solid grey;width:100%'></tr>");
							var len = datas.length;
							var idx = 1;						
							_.each(datas, function(data) {
								var inner_phone = "";
								if(_.isUndefined(data.phone_office) || data.phone_office == "" || _.isNull(data.phone_office)) {
									inner_phone = "";
								} else {
									inner_phone = "(" + data.phone_office + ")";
								}
								if(code == "0000") {										
									target.append('<tr><td id=tdfont bgcolor=#E9E9E9 style = "text-align:center; padding-top: 30px;padding-bottom: 20px;">'+ "<b id=printleader>" +"팀장 " 
									+ data.name + " " + data.position_name.replace("연구원","")+"<br>" +"(" +data.email.replace("@yescnc.co.kr","") + ")" 
									+ "</b>" + "<br>"+data.phone + inner_phone + '</td></tr>');									
								} else {								
									if(idx == 1) {
 										var thtml;	
										if(len != 1){						
										    thtml = '<tr class="partTop"><td>'
										}else{
										    thtml = '<tr class="partTop partBottom"><td>'
										}
 										target.append(thtml					 
										+ "<b id=printname>" + data.name + "</b>" +" " + data.position_name.substring(0,3)  +" (" + data.email.replace("@yescnc.co.kr","") + ")" +"<br>" 
										+ data.phone + inner_phone + '</td></tr>');	
									} else if(idx == len) {
										target.append('<tr class="partBottom"><td>' 
										+ "<b id=printname>" + data.name + "</b>" +" " + data.position_name.substring(0,3)  +" (" + data.email.replace("@yescnc.co.kr","") + ")" +"<br>" 
										+ data.phone + inner_phone + '</td></tr>');
									} else {
										target.append('<tr class="partCenter"><td>' 
										+ "<b id=printname>" + data.name + "</b>" +" " + data.position_name.substring(0,3)  +" (" + data.email.replace("@yescnc.co.kr","") + ")" +"<br>" 
										+ data.phone + inner_phone + '</td></tr>');
									}									
								}
								idx++;								
							});
						}
					});					
					return target.html();
				}

				function getDeptName(deptCode) {
					var deptName = "";
					deptName =  _.find(deptorg, function(deptData) {
						if(deptData.code == deptCode) {
							return true;
						}	
					});
					return deptName.name;
				}
				var totMem = (seoul + suwon) + "명(본사 : " + seoul + "명, 수원 : " + suwon + "명";
				$(_content).find("#total_member").append(totMem);
			});
     	}    	
    });    
    return OrganizationView;
});
