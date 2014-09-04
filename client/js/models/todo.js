define([
	'underscore',
	'backbone'
], function( _, Backbone ) {

	var TodoModel = Backbone.Model.extend({
		defaults: {
			title: '',
			completed: false
		}
	});

	return TodoModel;
});
