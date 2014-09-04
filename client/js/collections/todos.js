define([
	'underscore',
	'backbone',
	'models/todo'
], function( _, Backbone, Todo ) {

	var TodosCollection = Backbone.Collection.extend({
		model: Todo
	});

	return new TodosCollection();
});
