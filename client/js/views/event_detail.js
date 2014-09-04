define([
	'zepto',
	'underscore',
	'backbone',
	'text!templates/event_detail.html',
	'utils/pt',
	'utils/util',
	'collections/comments',
	'views/comment_item',
	'views/publish',
	'utils/field_dialog'
], function( $, _, Backbone, template, PT, Util, CommentColl, CommentItemView,PublishView,FieldDialog ) {

	var EventDetail = Backbone.View.extend({
		
		template: _.template( template ),

		events: {
			'click .bar-nav .icon-left-nav': 'back',
			'click .action-btn':'action',
			'click .love':'assist',
			'click .comment':'comment',
			'click li': 'reply'
		},

		initialize: function(options) {
			this.model = options.model;
			// this.collection = new CommentColl();
			// this.listenTo(this.collection, 'add', this.addOne);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));

			var type = this.model.get('type');
			var btn_el = this.$el.find('.action-btn');
			if (type == window.Type.GIVE) {
				btn_el.html('我来尝尝');
			} else if(type == window.Type.TOGETHER) {
				btn_el.html('我来拼菜');
			} else if(type == window.Type.WANT) {
				btn_el.html('应聘厨师');
			};
		
			if(this.model.get('follow_total') >= parseInt(this.model.get('limit'))) {
				this.$el.find("#action-btn").attr("disabled", true);
			};
			var follows = this.model.get('follows');
			for (var i = 0; i < follows.length; i++) {
				if (follows[i].name == window.User.name) {
					this.$el.find("#action-btn").attr("disabled", true);
					break;
				};
			};

			var self = this;
			// load comments
			_.each(this.model.get('comments'), function(c) {
    			var itemView = new CommentItemView(c);
				self.$el.find(".table-view.items").append(itemView.render().el);
    		});

    		// load follows
    		_.each(this.model.get('follows'), function(c) {
    			self.$el.find('.event-detail-food .followers').append("<div class='people'>" + c.name + "</div");
    		});

    		this.assists = this.model.get('assists');
    		for (var i = 0; i < this.assists.length; i++) {
    			if (this.assists[i].name == window.User.name) {
					var lovemeEl = self.$el.find('.event-detail-image .loveme');
					lovemeEl.removeClass('icon');
					lovemeEl.addClass('icon_h');
					this.$el.find("#action-btn").attr("disabled", true);
					break;
				};
    		};

			if (this.model.get('name') == window.User.name) {
				this.$el.find("#action-btn").attr("disabled", true);
			};
			return this;
		},

		back: function() {
			window.eventCollection.trigger('update', {
				assists: this.model.get('assists').length,
				comments: this.model.get('comments').length,
				status_id: this.model.get('_id')
			});
			PT.pop();
		},

		// addOne: function(model) {
		// 	var itemView = new CommentItemView(model);
	 //  		this.$el.find(".table-view.items").append(itemView.$el);
		// },

		action:function(){

			if(this.model.get('follow_total') >= parseInt(this.model.get('limit'))){
				return;
			};

			var follows = this.model.get('follows');
			for (var i = 0; i < follows.length; i++) {
				if (follows[i].name == window.User.name) {
					return;
				};
			};

			var type=this.model.get('type');
			var self = this;
			var data={
           		  status_id:this.model.get('_id'),
           		  name:window.User.name,
           	  }
			 
            if(type!=window.Type.TOGETHER){ 
            	self.follow(self,data);
            } else{
            	var placeholder="请输入菜名";
            	new FieldDialog({
    				placeholder: placeholder,
    				callback: function(text) {
    					if (text) {
    						 data.foodname=text;
    						 self.follow(self,data)
    					};
    				}
    			});
            }
		},

		follow:function(self,data){
			$.ajax({
            	  type:"POST",
  				  url:Util.api('follow'),
  				  dataType:"json",
  				  data:data,
  				  success:function(result){
  					if(result.err===null){

  						self.model.set('follow_total', parseInt(self.model.get('follow_total'))+1);
  						// update ui
  						self.$el.find("#action-btn").attr("disabled", true);

  						self.$el.find('.event-detail-food .followers').append("<div class='people'>" + window.User.name + "</div");
							// insert comment
							self.autoComment(data);
  						if(self.model.get('follow_total') >= parseInt(self.model.get('limit'))){
							self.$el.find("#action-btn").attr("disabled", true);
						};
  					}else{
                        alert(result.err);
  					}
  				}
			  });           	
		},
		
		autoComment: function(data) {
			var text;
			if (this.model.get('type') == window.Type.WANT) {
				text = window.User.name + " 应聘了厨神了哦～";
			} else if (this.model.get('type') == window.Type.GIVE) {
				text = window.User.name + " 要过来尝尝哦～";
			} else if (this.model.get('type') == window.Type.TOGETHER) {
				if(data!==null&&data.foodname!==null){
					text = window.User.name +"带上 "+data.foodname+ " 来拼菜了哦～";
				}else{
					text = window.User.name +"要来拼菜了哦～";
				}
				
			};

			this.commitComment(text, true);
		},
		
		assist:function(){
			var num = 1;
			var index = -1;
			for (var i = 0; i < this.assists.length; i++) {
				if (this.assists[i].name == window.User.name) {
					num = -1;
					index = i;
					break;
				};
			};
			var self = this;
			$.ajax({
        	  type:"POST",
				  url:Util.api('assist'),
				  dataType:"json",
				  data: {
				  	name: window.User.name,
				  	num: num,
				  	status_id: this.model.get('_id')
				  },
				  success:function(data){
					var cel = self.$el.find('.event-detail-image .love .text');
					var lovemeEl = self.$el.find('.event-detail-image .loveme');
					if (num == 1) {
						cel.html(cel.html()*1+1);
						lovemeEl.removeClass('icon');
						lovemeEl.addClass('icon_h');
						self.assists.push({
							name: window.User.name
						});
					} else {
						cel.html(cel.html()*1-1);
						lovemeEl.removeClass('icon_h');
						lovemeEl.addClass('icon');
						self.assists.splice(index, 1);
					};
				}
          });   	
		},
		
		comment:function(reply){
			var placeholder = "";
			if (reply !== true) {
				this.replyTo = null;
				this.replyId = null;
				placeholder = "请输入回复内容";
			} else {
				placeholder = "回复 " + this.replyTo + ":";
			};
			
			var self = this;
			new FieldDialog({
				placeholder: placeholder,
				callback: function(text) {
					if (text) {
						self.commitComment(text);
					};
				}
			});
		},

		reply: function(e) {
			var target = e.target;
			if(target.tagName.toLowerCase() != 'li') {
				target = $(target).parents('.table-view-cell');
			};

			this.replyTo = $(target).attr('fname');
			this.replyId = $(target).attr('fid');
			this.comment(true);
		},
		
		fetchSucc: function(collection, response, options) {
	    	Util.stopSpinning(this.spinner);
	    },
	    
	    fetchError: function(collection, response, options) {
	    	Util.stopSpinning(this.spinner);
	    },

	    commitComment: function(text, auto) {
	    	var self = this;
	    	var dataOptions = {
				  	status_id: this.model.get('_id'),
				  	name: window.User.name,
				  	text: text
				  };

			if (this.replyId) {
				dataOptions.comment_id = this.replyId;
			};
			if (this.replyTo) {
				dataOptions.reply_name = this.replyTo;
			};
				  
			$.ajax({
        	  type:"POST",
				  url:Util.api('comment'),
				  dataType:"json",
				  data: dataOptions,
				  success:function(data){

				  	if (self.replyTo) {
						text = "回复 <span style='color:30c1be;'>" + self.replyTo + "</span>: " + text;
					};
				  	var itemView = new CommentItemView({
						text: text,
						name:window.User.name,
						createtime: new Date().getTime()
					});
				  	
					if((self.model.get('follows').length == 0)) {
						self.$el.find(".table-view").append(itemView.render().el);
					} else {
						var firstRow = self.$el.find(".event-detail-comment .table-view-cell")[0];
						$(itemView.render().el).insertBefore($(firstRow));
					};

					var comments = self.model.get('comments');
					comments.push({name: window.User.name, text: text});
					self.model.set('comments', comments);

					if (auto) {
						var follows = self.model.get('follows');
						follows.push({name: window.User.name});
						self.model.set('follows', follows);
					};

					var cel = self.$el.find('.event-detail-image .comment .text');
					cel.html(cel.html()*1+1);
				}
          });   	
	    }
	});

	return EventDetail;
});