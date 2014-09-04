define([
	'underscore',
	'backbone',
	'models/menu'
], function( _, Backbone, MenuModel ) {

	var MenuColl = Backbone.Collection.extend({
		model: MenuModel,
		url: 'js/data/menus.json'
	});

	return MenuColl;
});