define([
	'zepto',
	'underscore',
	'backbone',
	'utils/pt',
	'text!templates/signin.html',
	'views/signup',
	'views/app'
], function( $, _, Backbone, PT, template, SignupView, AppView ) {

	var SigninView = Backbone.View.extend({
		
		template: _.template( template ),
		events: {
			'click .signup-btn': 'signup',
			'click .signin-btn': 'signin'
		},

		initialize: function() {
			
		},

		render: function() {
			this.$el.html(this.template({}));
            this.$el.addClass('signin-padding');
            this.$el.addClass('sign-background');
			// this.$el.addClass('pt-page pt-page-current signin-padding');
			// $('#pt-main').append(this.$el);
			// Pages.push(this);
			return this;
		},

		signup: function() {
			PT.push(new SignupView({
				parentView: this
			}), 'slide_v');
		},

		signin: function() {
			var data=$("#signin_form").serialize();
			var name = this.$el.find('.input-group input')[0].value;
			var user={name: name};

			var self = this;
			$.ajax({
				type:"POST",
				url:"http://42.62.52.155:3000/api/login",
				dataType:"json",
				data:data,
				success:function(result){
					if(result.err===null){
						localStorage.setItem('eat_user',JSON.stringify(user));
						window.User=user;
						PT.push(new AppView());

						setTimeout(function() {
							self.remove();
							Pages.splice(1, 1);
						}, 1000);
					}else{
                        alert(result.err);
					}
				}
			});

		}
	});

	return SigninView;
});