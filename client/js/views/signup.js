define([
	'zepto',
	'underscore',
	'backbone',
	'utils/pt',
	'text!templates/signup.html',
	'views/app'
], function( $, _, Backbone, PT, template, AppView) {

	var SignupView = Backbone.View.extend({
		
		template: _.template( template ),
		events: {
			'click .register-btn': 'register',
			'click .back': 'back'
		},

		initialize: function(options) {
			this.parentView = options.parentView;
		},

		render: function() {
			this.$el.html(this.template({}));
			this.$el.addClass('signin-padding');
            this.$el.addClass('sign-background');
			return this;
		},

		register: function() {
			var data=$("#signup_form").serialize();
			var name = this.$el.find('.input-group input')[0].value;
			var user={name: name};
			var self = this;
			$.ajax({
				type:"POST",
				url:"http://42.62.52.155:3000/api/register",
				dataType:"json",
				data:data,
				success:function(result){
					if(result.err===null){
						localStorage.setItem('eat_user',JSON.stringify(user));
						window.User=user;					
						PT.push(new AppView());

						setTimeout(function() {
							self.remove();
							self.parentView.remove();
							Pages.splice(1, 2);
						}, 1000);
					}else{
						alert(result.err);
					}
				}
			});
		},

		back: function() {
			PT.pop();
		}
	});

	return SignupView;
});