

$(document).ready(function(e){
	window.Saram={
		Model:{},
		Collections:{},
		Views:{},
		initializeModel:function(){
			var Saram=this;
			this.put("Model", "Menu", Backbone.Model.extend({
				idAttribute:"menu_id"
			}));
			
			this.put("Model", "Menus", Backbone.Model.extend({
				url:'/sm/menus',
				model: Saram.getBackbone("Model", "Menu")
			}))
		},
		initializeView:function(){
			var Saram=this;
			
			//Loding Page
			this.put("Views", "Loding", Backbone.View.extend({
	        	el:$(".loding-container"),
	        	initialize:function(){
	        		_.bindAll(this, 'render');
	        		_.bindAll(this, 'close');
	        		this.render();
	        	},
	        	render:function(){
	        		var cube=$('<div class="cube"></div>');
	        		var half1=$('<div class="half1">'
	        						+'<div class="side s1">'
	        							+'<div class="in1"></div>'
	        						+'</div>'
	        						+'<div class="side s2">'
	        							+'<div class="in2"></div>'
	        						+'</div>'
				              		+'<div class="side s5">'
				              			+'<div class="in5"></div>'
				              		+'</div>'
				    			+'</div>'
				    );
	        		var half2=$('<div class="half2">'
	        						+'<div class="side s3">'
	        							+'<div class="in3"></div>'
	        						+'</div>'
	        						+'<div class="side s4">'
	        							+'<div class="in4"></div>'
	        						+'</div>'
				              		+'<div class="side s6">'
				              			+'<div class="in6"></div>'
				              		+'</div>'
				    			+'</div>'
				    );
				    cube.append(half1);
				    cube.append(half2);
				    
	        		var cubeContainer=$('<div class="cube-container"></div>');
	        		cubeContainer.append(cube);
	        		$(this.el).append(cubeContainer);
	        		
	        		$(".loding-msg").textillate({
						loop: true,
						minDisplayTime: 2000,
						initialDelay: 0,
						autoStart: true,
						outEffects: [ 'hinge' ],
						in:{
							effect:"bounceIn",
						    delayScale: 1.5,
						    delay: 50,
						    sync: false,
						    shuffle: true,
						    reverse: false,
						    callback: function () {}
						},
						out:{
							effect: 'rotateOutDownLeft',
						    delayScale: 1.5,
						    delay: 50,
						    sync: false,
						    shuffle: true,
						    reverse: false,
						    callback: function () {}	
						}
					});
	        	},
	        	events:{
	        		"click":"close"
	        	},
	        	close:function(){
	        		$(this.el).fadeOut( "slow", function() {
					 	this.remove();
					 	Saram.get("Views", "Main");
					});
	        	}
	        }));
	        
			
			//Top NavigationBar
			this.put("Views", "NavigationBar", Backbone.View.extend({
	        	initialize:function(){
	        		_.bindAll(this, 'render');
	        	},
	        	render:function(){
	        		$(this.el).append(NavigationBar);
	        	}
	        }));
	        
	        //Main Page
	        this.put("Views", "Main", Backbone.View.extend({
	        	el:$(".main-container"),
	        	initialize:function(){
	        		_.bindAll(this, 'render');
	        	},
	        	render:function(){
	      			var NavigationBar=Saram.get("Views", "NavigationBar");
	        		$(this.el).append(NavigationBar);
	        	}
	        }));
		},
		load:function(){
			log.debug("==================================================================================================================");
	        log.debug("================================================ Welcome to Saram ================================================");
	        log.debug("==================================================================================================================");
	        this.initializeModel();
	        this.initializeView();
	        var LodingManager=this.get("Views", "Loding");
		},
		get:function(mvcType, name){
			return new this[mvcType][name]();
		},
		getBackbone:function(mvcType, name){
			return this[mvcType][name];
		},
		put:function(mvcType, name, obj){
			if (this.Util.isNull(mvcType)){
				log.debug("mvcType is null.");
				return;
			}
			if (this.Util.isNull(name)){
				log.debug("module name is null.");
				return;
			}
			
			if (this.Util.isNotNull(this[mvcType][name])){
				log.debug("mvcType:"+mvcType +"_"+name+" is Already Modeul");
				return;
			}
			this[mvcType][name]=obj;
		},
		Util:{
			isNull:function(obj){
				if(obj===""||obj===undefined||obj==="undefined"||obj===null||obj==="null") return true;
				return false;
			},
			isNotNull:function(obj){
				if(obj===""||obj===undefined||obj==="undefined"||obj===null||obj==="null") return false;
				return true;
			}
		}
	}
	
	var Saram=window.Saram;
	Saram.load();
});
