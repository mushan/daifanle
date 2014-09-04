define([
	'zepto',
	'underscore',
	'backbone',
	'utils/util',
	'utils/pt',
	'text!templates/home.html',
	'collections/events',
	'views/event_item',
	'views/menu'

], function( $, _, Backbone, Util, PT, template, EventColl, EventItemView, MenuView ) {

	var HomeView = Backbone.View.extend({
		
		// el: '.tab-home',
		template: _.template( template ),

		events: {
			'click .icon_menu': 'onMenuClick'
		},

		initialize: function() {
			this.collection = new EventColl();
			window.eventCollection = this.collection;
			this.listenTo(this.collection, 'add', this.addOne);

			this.listenTo(this.collection, 'update', this.update);
			this.listenTo(this.collection, 'refresh', this.refresh);
		},

		render: function() {
			this.$el.addClass('page-home');
			this.$el.html(this.template({}));

			this.$el.find('.event').height($(window).height()-50);
			this.refresh();
			
			return this;
		},

		refresh: function() {
			this.spinner = Util.startSpinning('body');
			this.collection.remove(this.collection.models);
			this.$el.find(".event").html("");

			this.collection.fetch({
				type: 'POST',
	       		success: _.bind(this.fetchSucc, this),
	       		error: _.bind(this.fetchError, this)
	       	});
		},

		update: function(options) {
			for (var i = 0; i < this.collection.length; i++) {
				var m = this.collection.at(i);
				if (m.get('_id') == options.status_id) {
					m.set('assist_total', options.assists);
					m.set('comment_total', options.comments);
					break;
				};
			};
		},

		addOne: function(model) {
			var itemView = new EventItemView(model);
	  		this.$el.find(".event").append(itemView.$el);
		},

		fetchSucc: function(collection, response, options) {
	    	Util.stopSpinning(this.spinner);
	    },
	    
	    fetchError: function(collection, response, options) {
	    	Util.stopSpinning(this.spinner);
	    },

	    show: function() {
	    	this.$el.show();
	    	$('.bar-tab .icon-home').parent().addClass('active');
	    },

	    hide: function() {
	    	this.$el.hide();
	    	$('.bar-tab .icon-home').parent().removeClass('active');
	    },

	    onMenuClick: function() {
	    	var menu = new MenuView();
	    	PT.push(menu, 'slide_v');
	    }
	});

	return HomeView;
});
