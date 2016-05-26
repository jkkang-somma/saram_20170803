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
    	    	
    	    	//인원체크
    	    	var deptmem = [];
    	    	var usermem = [];
    	    	var tolmem = 0;
    	    	//퇴사자 필터링
    	    	for(var i=0;i<userorg.length;i++){
    	    		if(userorg[i].leave_company == null || userorg[i].leave_company ==""){
    	    			usermem[i] = userorg[i].dept_code;
    	    		}
    	    	}
    	    	for(var i=0;i<deptorg.length;i++){
    	    		deptmem[i] =0;
    	    	}
    	    	//부서별 총원
    	    	for(var i=0;i<deptorg.length;i++){
    	    		for(var j=0;j<usermem.length;j++){
    	    			if(deptorg[i].code == usermem[j]){
    	    				deptmem[i] +=1;  
    	    			}
    	    		}
    	    	}
    	    	//yescnc 총원
    	    	for(var i=0;i<deptorg.length;i++){
    	    		tolmem += deptmem[i];
    	    	}
    	    	
    	    	//서울수원
    	    	var seoul = 0;
    	    	var suwon = 0;
    	    	for(var i=0;i<deptorg.length;i++){
	    	    	if(deptorg[i].code == 5400 || deptorg[i].code == 7400 || deptorg[i].area == "수원"){
	    	    			suwon +=deptmem[i]; 	 
	    	    	}   		
    	    	}
    	    	seoul = tolmem - suwon;
//    	    	console.log(seoul);
//    	    	console.log(suwon);
    	    	
    	    	//솔루션개발팀 +1명
    	    	for(var i=0;i<deptorg.length;i++){
	    	    	if(deptorg[i].code == 8100){
	    	    		if(deptorg[i].leader == 160401){
	    	    			deptmem[i] +=1;
	    	    		}    	 
	    	    	}   		
    	    	}
    	    	
    	    	//Div 총 width
    	    	var tWidth = 0;
    	    	//임원+경영지원팀 고정
				if(deptorg[0].leader){							
					var category = $(
							'<div style="padding-left:10px; float:left; padding-right:10px; width:300px;display: table-cell;">'+
								'<div class ="printdiv" id="div_'+deptorg[0].code+'" style="margin-bottom:30px;">'
									+'<div id=ystyle style="background: linear-gradient(#777FDC, #9BA0DC);font-weight: bold;font-size:28px;"><span id=ybold>'+deptorg[0].name + "</span></div><div class='deptColor team0000'></div>" +
									'<table id="tbl_'+deptorg[0].code+'" style="box-shadow: 2px 2px 2px 0px lightgray; width:280px;">'+ '</table>'+
								'</div>'
								+'<div class ="printdiv" id="div_'+deptorg[2].code+'">'
									+'<div id=ystyle style="background: linear-gradient(#37EFFF, #83F5FF);font-weight: bold;font-size:28px;"><span id=ybold>'+deptorg[2].name + "</span></div><div class='deptColor team1000' style='padding-bottom:20px;'></div>" +
									'<table id="tbl_'+deptorg[2].code+'" style="box-shadow: 2px 2px 2px 0px lightgray; width:280px;">'+ '</table>'+
								'</div>'
							+'</div>'
						);	
				}					
				$(_content).append(category);
				tWidth += $(category).width();
								
				//leader 중복값 제거
				var leaderorg = [];
				for(var i=3;i<deptorg.length;i++){
					leaderorg[i] = deptorg[i].leader;
				}
				function onlyUnique(value, index, self) { 
				    return self.indexOf(value) === index;
				}
				var leaderArr = leaderorg.filter( onlyUnique ); 
				
				var tDiv = $('<div id=tDiv style="display: table; margin:auto;"></div>');
				$(_content).append(tDiv);
								
				//AllTeamDiv   1 deptorg[i].leader 중복값 제거
				for(var i=0;i<leaderArr.length;i++){		
					if(leaderArr[i]){
						var category = $(
								'<div id ='+ leaderArr[i] +' style="padding-left:10px;float:left; padding-right:10px; width:300px;display: table-cell;"></div>'
							);
					}
					$(tDiv).append(category);
					tWidth += $(category).width();
				}
				$(tDiv).width(tWidth-130);
								
				var divleader = [];
				//TeamDiv 2 AllTeam div안에 넣기
				for(var i=3,num=1;i<deptorg.length;i++){		
//					if(_.has(deptorg[i], "leader")) {
					if(deptorg[i].leader !=null){
						var category = $(
								'<div class ="printdiv" id="div_'+deptorg[i].code+'" style="margin-bottom:30px;">'
								+"<div class='TopColor dept"+ num +"'id=ystyle style='font-weight: bold;font-size:28px;'>"
									+'<span id=ybold>'+deptorg[i].name + '</span>'
								+ '</div>'
								+"<div class='deptColor team"+num+"'></div>" +
								'<table id="tbl_'+deptorg[i].code+'" style="box-shadow: 2px 2px 2px 0px lightgray; width:280px;">'+ '</table>'+
							'</div>'
							);
						
						num++;
//					}			
					
						divleader = "#" + deptorg[i].leader;
						if($($(_content).find(divleader)).find(".member").length == 1){
							var count = parseInt($($(_content).find(divleader)).find(".member").text().slice(2,-1)) + deptmem[i];
							$($(_content).find(divleader)).find(".member").text(" ("+count+"명)")
						}else {
							category.find("#ystyle").append($('<span class="member" style=font-size:23px;>' +" ("+deptmem[i]+"명)"+'</span>'));
						}
						$(_content).find(divleader).append(category);

					}
				}
				
				var leaderList =[];
				//leader 3 TeamDiv안에 leader 넣기
				for(var i=3;i<deptorg.length;i++){
					for(var j=0;j<userorg.length;j++){ 		
						var phoneoffice ="";
						if(deptorg[i].leader == userorg[j].id){
							if(userorg[j].phone_office != "" && userorg[j].phone_office != null){
								phoneoffice += "("+ userorg[j].phone_office + ")";
							}
							
							var teamleader = $(
									'<tr><td id=tdfont bgcolor=#E9E9E9 style = "text-align:center; padding-top: 30px;padding-bottom: 20px; border:1px solid #D7D7D7;">'+ "<b id=printleader>" +"팀장 " + userorg[j].name + " " + 
											userorg[j].position_name.replace("연구원","")+"<br>" +"(" +userorg[j].email.replace("@yescnc.co.kr","") + ")" + "</b>" + "<br>"+userorg[j].phone + phoneoffice  + '</td></tr>'
									);
						
							leaderList.push(userorg[j].id);
						}
					}
					if(_.has(deptorg[i], "leader")) {
						var tleader = "#tbl_" + deptorg[i].code;
						$(_content).find(tleader).append(teamleader);							
					}			
				}			
								
									
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
						else if(!_.contains(leaderList, item.id)) {
							trHTML += '<tr style = "background-color: white;"><td id=tdfont style = " padding-left: 15px; padding-bottom: 15px; padding-top: 25px; border:1px solid #D7D7D7;">' 
									+ "<b id=printname>" + item.name + "</b>" +" " + item.position_name.substring(0,3)  +" (" + item.email.replace("@yescnc.co.kr","") + ")" +"<br>" + item.phone + phoneoffice  + '</td></tr>';  
									target.append(trHTML);
						}
					}
				});
				
    	    	//개발품질팀(수원) 팀장 중복 제거
				$("#div_7400").find("tr :eq(0)").remove();
				//하단 div
				var footer = $(
						'<div id= footer style="float:right; margin-top:-50px; margin-right:20px; font-size:24px;">'
						+"총 인원- "+ tolmem +"명" + "( " + "사내- "+ seoul+ "명" + ", " + "수원- "+ suwon + "명 )"+"<br>"
						+"사내 전화번호: 070-7163-XXXX" 
						+"<br>"+ "수원 사업장 U-city 전화번호: 031-213-8740~2"
						+'</div>'
						);
				$(_content).append(footer);
    	    })
    	      	        	    
    	    var _content=$(ContentHTML).attr("id", this.option.el);	   
    	    _layOut.append(_head);
    	    _layOut.append(_content);
    	    $(this.el).html(_layOut);   
    	    
     	}
    	
    });
    
    return OrganizationView;
});