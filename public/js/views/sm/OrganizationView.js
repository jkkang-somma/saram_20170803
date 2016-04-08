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
  'text!templates/default/content.html',
  'text!templates/layout/organization.html',
  'collection/sm/UserCollection',
  'collection/sm/DepartmentCollection',
  'text!templates/default/button.html',
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
    ButtonHTML,
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
    	    var _head=$(_headTemp(_headSchema.getDefault({title:i18Common.ORGANIZATION.TITLE})));
    	    _head.addClass("left-padding");
    	    _head.addClass("relative-layout"); 	        	    
    	    
    	    var promiseArr = [];
    	    var userCollection = new UserCollection();
    	    promiseArr.push(userCollection.fetch());
    	    var departmentCollection = new DepartmentCollection();
    	    promiseArr.push(departmentCollection.fetch());
    	    
    	    $.when.apply($, promiseArr).then(function(user, dept){
    	    	
    	    	//data에서 dept_code기준으로 정렬
     	    	var userorg = [];
    	    	var deptorg = [];
    	    	userorg = user[0];
    	    	deptorg = dept[0];	    	
    	    	
//    	    	//position_code 정렬 직급->이름
//    	    	function PositionSort(a,b){
//    	    		if(a.dept_code != "0000" && b.dept_code != "0000"){
//	    	    		if(a.position_code==b.position_code){
//	    	    			return a.name > b.name ? 1 : -1
//	    	    					}
//	    	    		return a.position_code > b.position_code ? 1 : -1
//	    	    	}	
//    	    	}
//    	    	//join_company 정렬 (dept_code가 0000인 경우)
//    	    	function JoinSort(a,b){
//					if(a.dept_code === "0000" || b.dept_code === "0000"){
//	    	    		if(a.position_code==b.position_code){
//	    	    			return a.join_company > b.join_company ? 1 : -1
//	    	    					}
//	    	    		return a.position_code > b.position_code ? 1 : -1
//					}
//						else{
//							return 0
//					}	
//				}
//    	    	userorg.sort(PositionSort);  	 
//    	    	userorg.sort(JoinSort); 
    	    	
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
    	    	
				
    	    	// 인원
    	    	var dept5400 =0;
    	    	var dept7010 =0;
    	    	var dept7400 =0;
    	    	var dept8100 =0;
    	    	for(var i=0;i<userorg.length;i++){
    	    		if(userorg[i].leave_company == null || userorg[i].leave_company ==""){
	    	    		if(userorg[i].dept_code == 5400){dept5400 +=1;}
	    	    		if(userorg[i].dept_code == 7010){dept7010 +=1;}
	    	    		if(userorg[i].dept_code == 7300){dept7400 +=1;}
	    	    		if(userorg[i].dept_code == 7400){dept7400 +=1;}
	    	    		if(userorg[i].dept_code == 8100){dept8100 +=1;}
    	    		}
    	    	}
				//임원+경영지원팀 
				if(deptorg[0].leader){							
					var category = $(
							'<div  style="float:left; padding-left:10px; padding-right:10px; width:360px;">'+
								'<div id="div_'+deptorg[0].code+'" style="margin-bottom:30px;">'
									+'<div id=ystyle style="background: linear-gradient(#777FDC, #9BA0DC);font-weight: bold;font-size:30px;"><span id=ybold>'+deptorg[0].name + '</span></div><div class=dept00></div>' +
									'<table id="tbl_'+deptorg[0].code+'" style="box-shadow: 2px 2px 2px 0px lightgray; width:340px;">'+ '</table>'+
								'</div>'
								+'<div id="div_'+deptorg[2].code+'">'
									+'<div id=ystyle style="background: linear-gradient(#37EFFF, #83F5FF);font-weight: bold;font-size:30px;"><span id=ybold>'+deptorg[2].name + '</span></div><div class=dept02 style="padding-bottom:20px;"></div>' +
									'<table id="tbl_'+deptorg[2].code+'" style="box-shadow: 2px 2px 2px 0px lightgray; width:340px;">'+ '</table>'+
								'</div>'
							+'</div>'
						);	
				}					
				$(_content).append(category);
				
				
				//품질검증팀
				if(deptorg[7].leader){							
					var category = $(
							'<div  style="float:left; padding-left:10px; padding-right:10px; padding-bottom: 20px; width:360px;">'+
								'<div id="div_'+deptorg[7].code+'">'
									+'<div id=ystyle style="background: linear-gradient(#26FF9E, #84FFC8);font-weight: bold;font-size:30px;"><span id=ybold>' +deptorg[7].name+'</span>'+ '<span style=font-size:25px;>' +" ("+dept5400+"명)"+'</span>' +'</div><div class=dept07></div>' +
									'<table id="tbl_'+deptorg[7].code+'" style="box-shadow: 2px 2px 2px 0px lightgray; width:340px;">'+ '</table>'+
								'</div>'
							+'</div>'
						);	
				}
//				leader
				for(var j=0;j<userorg.length;j++){ 		
					var phoneoffice ="";
					if(deptorg[7].leader == userorg[j].id){
						if(userorg[j].phone_office != "" && userorg[j].phone_office != null){
							phoneoffice += "("+ userorg[j].phone_office + ")";
							}
					}
					if(deptorg[7].leader == userorg[j].id){
						var teamleader = $(
								'<tr><td id=tdfont bgcolor=#E9E9E9 style = "text-align:center; padding-top: 30px;padding-bottom: 20px; border:1px solid #D7D7D7;">'+ "<b id=printleader>" +"팀장 " + userorg[j].name + " " + 
										userorg[j].position_name.replace("연구원","")+ "(" +userorg[j].email.replace("@yescnc.co.kr","") + ")" + "</b>" + "<br>"+userorg[j].phone + phoneoffice  + '</td></tr>'
								);
					}	
				}
				$(category).find("table").append(teamleader);
				$(_content).append(category);

				
				//NMS개발팀
				if(deptorg[8].leader){							
					var category = $(
							'<div  style="float:left; padding-left:10px; padding-right:10px; padding-bottom: 20px; width:360px;">'+
								'<div id="div_'+deptorg[8].code+'">'
									+'<div id=ystyle style="background: linear-gradient(#2FFF39, #76FF7D);font-weight: bold;font-size:30px;"><span id=ybold>' +deptorg[8].name+'</span>'+ '<span style=font-size:25px;>' +" ("+dept7010+"명)"+'</span>' +'</div><div class=dept08></div>' +
									'<table id="tbl_'+deptorg[8].code+'" style="box-shadow: 2px 2px 2px 0px lightgray; width:340px;">'+ '</table>'+
								'</div>'
							+'</div>'
						);	
				}
//				leader
				for(var j=0;j<userorg.length;j++){ 		
					var phoneoffice ="";
					if(deptorg[8].leader == userorg[j].id){
						if(userorg[j].phone_office != "" && userorg[j].phone_office != null){
							phoneoffice += "("+ userorg[j].phone_office + ")";
							}
					}
					if(deptorg[8].leader == userorg[j].id){
						var teamleader = $(
								'<tr><td id=tdfont bgcolor=#E9E9E9 style = "text-align:center; padding-top: 30px;padding-bottom: 20px; border:1px solid #D7D7D7;">'+ "<b id=printleader>" +"팀장 " + userorg[j].name + " " + 
										userorg[j].position_name.replace("연구원","")+ "(" +userorg[j].email.replace("@yescnc.co.kr","") + ")" + "</b>" + "<br>"+userorg[j].phone + phoneoffice  + '</td></tr>'
								);
					}	
				}
				$(category).find("table").append(teamleader);
				$(_content).append(category);
				
				//개발품질팀+수원팀 
				if(deptorg[9].leader){							
					var category = $(
							'<div  style="float:left; padding-left:10px; padding-right:10px; padding-bottom: 20px; width:360px;">'+
								'<div id="div_'+deptorg[9].code+'" style="margin-bottom:30px;">'
									+'<div id=ystyle style="background: linear-gradient(#FFB23C, #FFCA7A);font-weight: bold;font-size:30px;"><span id=ybold>' +deptorg[9].name+'</span>'+ '<span style=font-size:25px;>' +" ("+dept7400+"명)"+'</span>' +'</div><div class=dept09></div>' +
									'<table id="tbl_'+deptorg[9].code+'" style="box-shadow: 2px 2px 2px 0px lightgray; width:340px;">'+ '</table>'+
								'</div>'
								+'<div id="div_'+deptorg[10].code+'">'
									+'<div id=ystyle style="background: linear-gradient(#FFB23C, #FFCA7A);font-weight: bold;font-size:31px;"><span id=ybold>'+ deptorg[9].name+'</span>'+ '<span style=font-size:25px;>' +" ("+"수원)"+'</span>' 
									+'</div><div class=dept09 style="padding-bottom:20px;"></div>' +
									'<table id="tbl_'+deptorg[10].code+'" style="box-shadow: 2px 2px 2px 0px lightgray; width:340px;">'+ '</table>'+
								'</div>'
							+'</div>'
						);	
				}	
//				leader
				for(var j=0;j<userorg.length;j++){ 		
					var phoneoffice ="";
					if(deptorg[9].leader == userorg[j].id){
						if(userorg[j].phone_office != "" && userorg[j].phone_office != null){
							phoneoffice += "("+ userorg[j].phone_office + ")";
							}
					}
					if(deptorg[9].leader == userorg[j].id){
						var teamleader = $(
								'<tr><td id=tdfont bgcolor=#E9E9E9 style = "text-align:center; padding-top: 30px;padding-bottom: 20px; border:1px solid #D7D7D7;">'+ "<b id=printleader>" +"팀장 " + userorg[j].name + " " + 
										userorg[j].position_name.replace("연구원","")+ "(" +userorg[j].email.replace("@yescnc.co.kr","") + ")" + "</b>" + "<br>"+userorg[j].phone + phoneoffice  + '</td></tr>'
								);
					}	
				}
				$(category).find("table").append(teamleader);
				$(_content).append(category);
				
				
				//솔루션개발팀  
				if(deptorg[11].leader){							
					var category = $(
							'<div  style="float:left; padding-left:10px; padding-right:10px; padding-bottom: 20px; width:360px;">'+
								'<div id="div_'+deptorg[11].code+'">'
									+'<div id=ystyle style="background: linear-gradient(#FF3636, #FF7E7E);font-weight: bold;font-size:30px;"><span id=ybold>' +deptorg[11].name+'</span>'+ '<span style=font-size:25px;>' +" ("+dept8100+"명)"+'</span>' +'</div><div class=dept11></div>' +
									'<table id="tbl_'+deptorg[11].code+'" style="box-shadow: 2px 2px 2px 0px lightgray; width:340px;">'+ '</table>'+
								'</div>'
							+'</div>'
						);	
				}				
//				leader
				for(var j=0;j<userorg.length;j++){ 		
					var phoneoffice ="";
					if(deptorg[11].leader == userorg[j].id){
						if(userorg[j].phone_office != "" && userorg[j].phone_office != null){
							phoneoffice += "("+ userorg[j].phone_office + ")";
							}
					}
					if(deptorg[11].leader == userorg[j].id){
						var teamleader = $(
							'<tr><td id=tdfont bgcolor=#E9E9E9 style = "text-align:center; padding-top: 30px;padding-bottom: 20px; border:1px solid #D7D7D7;">'+ "<b id=printleader>" +"팀장 " + userorg[j].name + " " + 
									userorg[j].position_name.replace("연구원","")+ "(" +userorg[j].email.replace("@yescnc.co.kr","") + ")" + "</b>" + "<br>"+userorg[j].phone + phoneoffice  + '</td></tr>'
							);
					}	
				}
				$(category).find("table").append(teamleader);
				$(_content).append(category);

				
				//tr td th만들기
				$.each(userorg, function (i ,item){
					var target = $(_content).find("#tbl_"+item.dept_code);
					var trHTML = "";
					var phoneoffice ="";
					if(item.phone_office != "" && item.phone_office != null){phoneoffice += "("+ item.phone_office + ")";}
					if(item.leave_company == "" || item.leave_company == null){
						if(item.dept_code == "0000"){
							trHTML += '<tr style = "background-color: white;"><td id=tdfont style = "padding-left: 15px; padding-bottom: 15px; padding-top: 15px; border:1px solid #D7D7D7;">' 
							+ "<h4 id=printh4><b>" + item.position_name + "</h4></b>" + "<br>" +"<b id=printname>"+ item.name + "</b>"+" (" + item.email.replace("@yescnc.co.kr","") + ")" +  "<br>" + item.phone + phoneoffice + '</td></tr>';			    	    	
							target.append(trHTML);
						}
						else if(item.id!="071102" && item.id!= "110201" && item.id!= "070901" && item.id!=  "060601" ){					
							trHTML += '<tr style = "background-color: white;"><td id=tdfont style = " padding-left: 15px; padding-bottom: 15px; padding-top: 25px; border:1px solid #D7D7D7;">' 
							+ "<b id=printname>" + item.name + "</b>" +" " + item.position_name.substring(0,3)  +" (" + item.email.replace("@yescnc.co.kr","") + ")" +"<br>" + item.phone + phoneoffice  + '</td></tr>';  
							target.append(trHTML);
						}
					}
				});
				
    	    	//개발품질팀(수원) 팀장 중복 제거
				$("#div_7400").find("tr :eq(0)").remove();
    	    })
    	      	        	    
    	    var _content=$(ContentHTML).attr("id", this.option.el);	   
    	    _layOut.append(_head);
    	    _layOut.append(_content);
    	    $(this.el).html(_layOut);   
    	    
     	}
    	
    });
    
    return OrganizationView;
});