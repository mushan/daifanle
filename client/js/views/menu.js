define([
	'zepto',
	'underscore',
	'backbone',
	'utils/util',
	'utils/pt',
	'text!templates/menu.html',
	'collections/menus',
	'views/menu_item'

], function( $, _, Backbone, Util, PT, template, MenuColl, MenuItemView ) {

	var HomeView = Backbone.View.extend({
		
		template: _.template( template ),

		events: {
			'click .bar-nav .icon-left-nav': 'back'
		},

		initialize: function() {
			this.collection = new MenuColl();
			this.listenTo(this.collection, 'add', this.addOne);
		},

		render: function() {
			this.$el.html(this.template({}));

			this.spinner = Util.startSpinning('body');
			this.collection.fetch({
	       		success: _.bind(this.fetchSucc, this),
	       		error: _.bind(this.fetchError, this)
	       	});
			return this;
		},

		addOne: function(model) {
			var itemView = new MenuItemView(model);
	  		this.$el.find(".grid-view").append(itemView.$el);
		},

		fetchSucc: function(collection, response, options) {
	    	Util.stopSpinning(this.spinner);
	    },
	    
	    fetchError: function(collection, response, options) {
	    	Util.stopSpinning(this.spinner);
	    },

	    back: function() {
			PT.pop();
		}
	});

	return HomeView;
});
