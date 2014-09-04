define([
	'underscore',
	'backbone',
	'models/event',
	'utils/util'
], function( _, Backbone, EventModel, Util ) {

	var EventColl = Backbone.Collection.extend({
		model: EventModel,
		url: Util.api('status_list'),
		parse: function(response) {
            return response.result;
        },
	});

	return EventColl;
});
