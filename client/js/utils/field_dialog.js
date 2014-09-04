define([
	'zepto',
	'underscore',
	'backbone',
	'text!templates/field_dialog.html'
], function( $, _, Backbone, statsTemplate ) {

	var FieldDialogView = Backbone.View.extend({

		// Compile our stats template
		template: _.template( statsTemplate ),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'click .alert_confirm':  'confirm',
			'click .a_modal': 'hide'
		},

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function(options) {
			this.placeholder = options.placeholder;
			this.callback = options.callback;
			this.render();
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function() {
			$(this.el).html(this.template({
				placeholder: this.placeholder
			}));

			$('body').append($(this.el));
		},

		confirm: function() {
			if (this.callback) {
				this.callback($('.alert_dialog input').val());
			};
			
			this.remove();
		},

		hide: function() {
			this.remove();
		}
	});

	return FieldDialogView;
});
