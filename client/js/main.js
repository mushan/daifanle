// Require.js allows us to configure shortcut alias
require.config({
	paths: {
		zepto: 'lib/zepto',
		underscore: 'lib/underscore',
		backbone: 'lib/backbone',
		text: 'lib/text',
		spin: 'lib/spin'
	},
	shim: {
		zepto: {
			exports: '$'
		}
	}
});

window.Pages = []; // pages
window.User; 
window.Type = {
	WANT: 1,
	GIVE: 2,
	TOGETHER:3
}

define([
	'views/app',
	'routers/router',
	'utils/pt',
	'views/signin'
], function( AppView, Workspace, PT, SigninView ) {
	// Initialize routing and start Backbone.history()
	new Workspace();
	Backbone.history.start();

	var viewport = new Backbone.View();
	viewport.$el.addClass('pt-page pt-page-current');
	$('#pt-main').append(viewport.$el);
	Pages.push(viewport);

	var u = localStorage.getItem('eat_user');
	if (u) {
		window.User = JSON.parse(u);
		PT.push(new AppView(), 'none');
	} else {
		PT.push(new SigninView(), 'none');
	};
});
