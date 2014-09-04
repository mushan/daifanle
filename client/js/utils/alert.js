define([
	'zepto',
	'underscore',
	'backbone',
	'text!templates/alert.html'
], function( $, _, Backbone, statsTemplate ) {

	var AlertView = Backbone.View.extend({

		// Compile our stats template
		template: _.template( statsTemplate ),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'click .alert_confirm':  'confirm'
		},

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function(options) {
			this.message = options.message;
			this.callback = options.callback;
			this.render();
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function() {
			$(this.el).html(this.template({
				message: this.message
			}));

			$('body').append($(this.el));
		},

		confirm: function() {
			if (this.callback) {
				this.callback();
			};
			
			this.remove();
		}
	});

	return AlertView;
});
