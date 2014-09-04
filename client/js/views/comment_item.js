define([
	'zepto',
	'underscore',
	'backbone',
	'text!templates/comment_item.html',
	'utils/pt',
	'models/comment'
], function( $, _, Backbone, template, PT, CommentModel ) {

	var CommentItemView = Backbone.View.extend({
		
		tagName: 'li',
		template: _.template( template ),

		events: {
			// 'click .navigate': 'onItemClick'
		},

		initialize: function(options) {
			this.model = new CommentModel(options);
		},

		render: function() {
			this.model = this.model.format();
			this.$el.addClass('table-view-cell');
			this.$el.attr("fname", this.model.get('name'));
			this.$el.attr("fid", this.model.get('comment_id'));
			
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	return CommentItemView;
});