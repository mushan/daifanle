define([
	'zepto',
	'underscore',
	'backbone',
	'text!templates/menu_item.html',
	'utils/pt',
	'views/menu_detail'
], function( $, _, Backbone, template, PT, MenuDetail ) {

	var MenuItemView = Backbone.View.extend({
		
		tagName: 'li',
		template: _.template( template ),

		events: {
			'click .image': 'onItemClick'
		},

		initialize: function(model) {
			this.model = model;
			this.render();
		},

		render: function() {
			this.$el.addClass('grid-view-cell menuitem');
			this.model = this.model.format();
			this.$el.html(this.template(this.model.toJSON()));

			var w = $(window).width()-4;
			this.$el.css({
				width: w/2,
				height: w/2,
				float: 'left'
			});

			return this;
		},

		onItemClick: function() {
			var detail = new MenuDetail({
				model:this.model
			});
			PT.push(detail);
		}
	});

	return MenuItemView;
});