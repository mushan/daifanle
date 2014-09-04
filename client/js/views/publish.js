define([
	'zepto',
	'underscore',
	'backbone',
	'utils/util',
	'utils/pt',
	'text!templates/publish.html',
	'utils/alert'

], function( $, _, Backbone, Util, PT, template, AlertView) {

	var PublishView = Backbone.View.extend({
		
		template: _.template( template ),

		events: {
			'click .bar-nav .icon-left-nav': 'back',
			'click .pbtn': 'publish'
		},

		initialize: function(options) {
			this.type = options.type;
			this.food = options.food;
		},

		render: function() {
			this.$el.html(this.template({}));
			if (this.type == window.Type.GIVE) {
				this.$el.find('.bar-nav .title').html('我要请客');
				this.$el.find('.people_count').show();
			} else if (this.type == window.Type.WANT) {
				this.$el.find('.bar-nav .title').html('聘请厨神');
			} else if (this.type == window.Type.TOGETHER) {
				this.$el.find('.bar-nav .title').html('快来拼菜');
				this.$el.find('.people_count').show();
			};

			var picField = this.$el.find('#publish_capture');
			picField.on('change', _.bind(this.takeCallback, this));

			var self = this;
			setTimeout(function() {
				if (self.food) {
					self.$el.find('.foodname input').val(self.food.name);
					self.loadImage(self.food.pic);
				};
			}, 200);

			return this;
		},

	    back: function() {
			PT.pop();
		},

		takeCallback: function() {
			var spinner = Util.startSpinning('publish_addicon');

			var picField = document.getElementById('publish_capture');
			var file = picField.files[0];
			
			var reader = new FileReader();
			reader.onload = function (e) {
			    var dataURL = e.target.result,
			        c = document.getElementById('publish_canvas'),
			        ctx = c.getContext('2d'),
			        img = new Image();
			    
			    c.style.cssText += 'display:block';
			    img.onload = function() {
			      c.width = img.width;
			      c.height = img.height;
			      ctx.drawImage(img, 0, 0);

			      Util.stopSpinning(spinner);
			    };

			    img.src = dataURL;
			};

			reader.readAsDataURL(file);
		},

		loadImage: function(url) {
			var c = document.getElementById('publish_canvas'),
		        ctx = c.getContext('2d'),
		        img = new Image();
		    
		    c.style.cssText += 'display:block';
		    img.onload = function() {
		      c.width = img.width;
		      c.height = img.height;
		      ctx.drawImage(img, 0, 0);		    };

		    img.src = url;
		},

		publish: function() {
			if($("#publish_foodname").val()==""){
				alert('请输入菜名');
				return;
			}
			if (this.type == 1) {
				$('#publish_limit').val(1);
			};

			if (!$('#publish_time').val()) {
				alert('请输入时间');
				return;
			};

           	var date = new Date($('#publish_time').val());
           	$('#publish_date').val(date.getTime());
           	$('#publish_type').val(this.type);
           	// $('#publish_user').val(User.name); TODO
           	$('#publish_user').val(window.User.name);

           	if (!$('#publish_capture').val()) {
           		if (this.food && this.food.pic) {
           			$('#publish_pic').val(this.food.pic);
           		};
           	};

           	var spinner = Util.startSpinning('body');
            var formData = new FormData($('#publish_form')[0]);

		    $.ajax({
		        url: Util.api('release_status'),
		        type: 'POST',
		        data: formData,
		        cache: false,
		        contentType: false,
		        processData: false,
		        success: function (result) {
		        	console.log(result);
		        	Util.stopSpinning(spinner);	        		
			        	new AlertView({
			        		message: "发布成功",
			        		callback: function() {
			        			PT.popToRoot();
			        			window.eventCollection.trigger('refresh');
			        		}
			        	});
                },
		        error: function (xhr, type, msg) {
		        	Util.stopSpinning(spinner);
		        	alert(msg);
                },       
		    });    
		}
	});

	return PublishView;
});
