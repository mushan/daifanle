define([
	'zepto',
	'underscore',
	'backbone',
	'text!templates/app.html',
	'utils/util',
	'utils/pt',
	'views/home',
	'views/setting',
	'views/publish'
	
], function( $, _, Backbone, template, Util, PT, HomeView, SettingView, PublishView ) {

	var AppView = Backbone.View.extend({

		template: _.template( template ),

		events: {
			'click .icon_add' : 'showMenu',
			'click .tab-item': 'changeTab',
			'click .menus' : 'hidenMenu',
			'click .menus .item' : 'publish'
		},

		initialize: function() {
			this.tabs =[];
			return this;
		},

		render: function() {
			this.$el.html(this.template({}));
			// children pages
			// home
			var homePage = new HomeView();
			// setting
			var settingPage = new SettingView();

			this.tabs.push({
				name: 'home', view: homePage
			});
			this.tabs.push({
				name: 'setting', view: settingPage
			})

			this.currentTab = this.tabs[0];

			this.$el.append(homePage.render().$el);
			this.$el.append(settingPage.render().$el);

			settingPage.hide();
			return this;
		},

		showMenu: function() {
			$('.menus').addClass('show');
			var offset = $('.icon_add').offset();
			var left = offset.left + ($('.icon_add').width()-$('.menus .want').width())/2;
			
			$('.menus .item.give').css({
				left: left,
				top: offset.top,
			});
			$('.menus .item.want').css({
				left: left,
				top: offset.top,
			});
			$('.menus .item.together').css({
				left: left,
				top: offset.top,
			});

			$('.menus .item.want').addClass('bounceInUp_want' + ' menu_animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		      // $(this).removeClass();
		    });
		    $('.menus .item.give').addClass('bounceInUp_give' + ' menu_animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		      // $(this).removeClass();
		    });
		    $('.menus .item.together').addClass('bounceInUp_together' + ' menu_animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		      // $(this).removeClass();
		    });
		},

		hidenMenu: function() {
			

			$('.menus').addClass('fade').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		      	$('.menus').removeClass('show');

		      	var offset = $('.icon_add').offset();
				$('.menus .item.give').css({
					left: offset.left,
					top: offset.top,
				});
				$('.menus .item.want').css({
					left: offset.left,
					top: offset.top,
				});
				$('.menus .item.together').css({
					left: offset.left,
					top: offset.top,
				});
				$('.menus .item.want').removeClass('bounceInUp_want menu_animated');
				$('.menus .item.give').removeClass('bounceInUp_give menu_animated');
				$('.menus .item.together').removeClass('bounceInUp_together menu_animated');

				$('.menus').removeClass('fade');
		    });
		},

		changeTab: function(e) {
			var t = e.target;
			if ($(t).hasClass('icon') || $(t).hasClass('tab-label')) {
				t = t.parentNode;
			};

			if ($(t).hasClass('tab-item')) {
				var identify = $(t).attr('ident');
				if (identify != this.currentTab.name) {
					for(var i=0; i<this.tabs.length;i++) {
						if (this.tabs[i].name == identify) {
							this.currentTab.view.hide();

							this.currentTab = this.tabs[i];
							this.currentTab.view.show();

							break;
						};
					}
				};
			};
		},

		publish: function(e) {
			var target = $(e.target);
			var type;
			if (target.hasClass('want')) {
				type = window.Type.WANT;
			} else if(target.hasClass('give')) {
				type = window.Type.GIVE;
			} else if(target.hasClass('together')) {
				type = window.Type.TOGETHER;
			};
			var publish = new PublishView({
				type: type
			});
			PT.push(publish);
		}
	});

	return AppView;
});
