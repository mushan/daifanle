define([
	'zepto',
	'underscore',
	'backbone',
	'text!templates/menu_detail.html',
	'utils/pt',
	'utils/util',
	// 'collections/comments',
	'views/publish'
], function( $, _, Backbone, template, PT, Util, PublishView ) {

	var MenuDetail = Backbone.View.extend({
		
		template: _.template( template ),

		events: {
			'click .bar-nav .icon-left-nav': 'back',
			'click .menu-detail-image .want': 'publish',
			'click .menu-detail-image .give': 'publish'
		},

		initialize: function(options) {
			this.model = options.model;
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		back: function() {
			PT.pop();
		},

		publish: function(e) {
			var target = $(e.target);
			var type;
			if ($(target).hasClass('want')) {
				type = window.Type.WANT;
			} else if($(target).hasClass('give')) {
				type = window.Type.GIVE;
			};

			if (type) {
				PT.push(new PublishView({
					type : type,
					food: {
						pic: this.model.get('image'),
						name: this.model.get('name')
					}
				}));
			};
		}
	});

	return MenuDetail;
});