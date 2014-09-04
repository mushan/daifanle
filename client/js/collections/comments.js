define([
	'underscore',
	'backbone',
	'models/comment'
], function( _, Backbone, CommentModel ) {

	var CommentColl = Backbone.Collection.extend({
		model: CommentModel,
		url: 'js/data/comments.json'
	});

	return CommentColl;
});
