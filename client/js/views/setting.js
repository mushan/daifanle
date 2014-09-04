define([
	'zepto',
	'underscore',
	'backbone',
	'utils/util',
	'text!templates/setting.html',
	'views/history_item',
	'utils/pt',
	'views/menu',
], function( $, _, Backbone, Util, template, HistoryItemView ,PT,MenuView) {

	var SettingView = Backbone.View.extend({
		
		template: _.template( template ),
		// el: '.tab-setting',
		events: {
			'click .pull-right':'show_menu',
            'click .segmented-control .control-item':'changeTab'
		},

		initialize: function() {
			this.wants = [];
			this.gives = [];
			this.togethers = [];
		},

		render: function() {
			this.$el.addClass('page-setting');
			this.$el.html(this.template(window.User));
            this.$el.find(".personal_name .name").html(window.User.name);
			return this;
		},

		refresh: function() {
			this.$el.find(".table-view").html('');

			var self = this;
			var spinner = Util.startSpinning('body');
			 $.ajax({
		        url: Util.api('history'),
		        type: 'POST',
		        dataType: 'json',
		        data: {
		        	name: window.User.name
		        },
		        success: function (data) {
		        	Util.stopSpinning(spinner);
		        	var result = data.result;
		        	
		        	if (result && result.length > 0) {
		        		_.each(result, function(r) {
		        			var cls;
		        					
		        			var want=false;
		        			var give=false;
		        			var together=false;
		        		    var follows=r.follows;
		        			
		        			if(r.name==window.User.name){
		        				
		        				switch(parseInt(r.type)){
			        			   case window.Type.GIVE:
			        				   give=true;
			        				   break;
			        			   case window.Type.WANT:
			        				   want=true;
			        				   break;
			        			   case window.Type.TOGETHER:
			        				   together=true;
			        				   break;
			        			};
		        			}else{
		        				
		        				switch(parseInt(r.type)){
		        				   case window.Type.GIVE:		        				
		        					   for(var i=0;i<follows.length;i++){
				        					if(follows[i].name==window.User.name){
				        						want=true;
				        						break;
				        					}
				        			   }
		        					   break;
		        				   case window.Type.WANT:
		        	                   for(var i=0;i<follows.length;i++)
		        	                     {
					        	     		if(follows[i].name==window.User.name){
					             				give=true;
					        					break;
					       					} 
		        	                     }
		        					   break;
		        				   case window.Type.TOGETHER:
		        					   for(var i=0;i<follows.length;i++){
				        					if(follows[i].name==window.User.name){
				        						together=true;
				        						break;
				        					}
				        				}
		        					   break;
		        				}
		        			}
		      			
		        			if (want) {
		        				cls = '.control-item_want';
		        			} else if(give) {
		        				cls = '.control-item_give';
		        			} else if(together) {
		        				cls = '.control-item_together';
		        			} else {
		        				return;
		        			};		        			
		        			var itemView = new HistoryItemView({
	        					o:r
	        				});
	        				self.$el.find(cls).append(itemView.render().el);	        			
		        		});
		        		
		        		self.$el.find(".table-view").forEach(function(item){
		        			if(item.children.length==1){
		        				$(item.children[0]).show();
		        			}
		        		})		        		
		        	}
		        	else
		        	{
		        	   $('.card .hide').show();
		        	};
                },
		        error: function (xhr, type, msg) {
		        	Util.stopSpinning(spinner);
		        	alert(msg);
                }
		    });
		},

		show: function() {
	    	this.$el.show();
	    	$('.bar-tab .icon-gear').parent().addClass('active');

	    	this.refresh();
	    },

	    hide: function() {
	    	this.$el.hide();
	    	$('.bar-tab .icon-gear').parent().removeClass('active');
	    },
	    
	    show_menu:function(){
	    	var menu = new MenuView();
	    	PT.push(menu, 'slide_v');
	    } ,
	    
	    changeTab:function(e)
	    {
	    	var t = e.target.hash.replace('#','');
	        $('.segmented-control .control-item').removeClass('active');
	        $(e.srcElement).addClass('active');
	        $('.card .table-view').hide();
	        var cls='.control-'+t;
	        $(cls).show();
	    }   
	    
	});

	return SettingView;
});