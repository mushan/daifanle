define([
	'zepto',
	'underscore',
	'backbone',
	'text!templates/second.html',
	'utils/util',
	'utils/pt'
], function( $, _, Backbone, template, Util, PT ) {

	var SecondView = Backbone.View.extend({
		
		template: _.template( template ),

		events: {
			'click a' : 'back'
		},

		initialize: function() {
			
		},

		render: function() {
			this.$el.html(this.template({}));
			return this;
		},

		back: function() {
			PT.pop();
		}
	});

	return SecondView;
});
