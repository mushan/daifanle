define([
	'zepto',
	'underscore',
	'backbone',
	'text!templates/event_item.html',
	'utils/pt',
	'views/event_detail'
], function( $, _, Backbone, template, PT, EventDetail ) {

	var EventItemView = Backbone.View.extend({
		
		tagName: 'li',
		template: _.template( template ),

		events: {
			'click .food-image': 'onItemClick'
		},

		initialize: function(model) {
			this.model = model;
			this.model.on('change:assist_total', _.bind(this.changeAssistsTotal, this)),
			this.model.on('change:comment_total', _.bind(this.changeCommentsTotal, this)),
			this.render();
		},

		render: function() {
			// this.$el.addClass('table-view-cell');
			this.model = this.model.format();
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		changeAssistsTotal: function() {
			this.$el.html(this.template(this.model.toJSON()));
		},

		changeCommentsTotal: function() {
			this.$el.html(this.template(this.model.toJSON()));
		},

		onItemClick: function() {
			var detail = new EventDetail({
				model:this.model
			});
			PT.push(detail);
		}
	});

	return EventItemView;
});