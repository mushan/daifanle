define([
	'zepto',
	'underscore',
	'backbone',
	'text!templates/history_item.html',
	'utils/pt',
	'models/history'
], function( $, _, Backbone, template, PT, HistoryModel ) {

	var HistoryItemView = Backbone.View.extend({
		
		tagName: 'li',
		template: _.template( template ),

		events: {
			
		},

		initialize: function(options) {
			this.model = new HistoryModel(options.o);
			this.model = this.model.format();
			this.render();
		},

		render: function() {
			this.$el.addClass('table-view-cell');
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	return HistoryItemView;
});