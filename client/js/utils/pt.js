define([
	'zepto',
], function($) {

	// Page Transition

	var pfx = ["webkit", "moz", "MS", "o", ""];
	var isAnimating = false,
		endCurrPage = false,
		endNextPage = false;

	var PT = {

		prefixedEvent: function(element, type, callback) {
			var at;
			for (var p = 0; p < pfx.length; p++) {
				if (!pfx[p]) {
					type = type.toLowerCase();
				}
				element.addEventListener(pfx[p]+type, callback, false);
			}
		},

		eventName: function() {
		    var t;
		    var el = document.createElement('fakeelement');
		    var transitions = {
		      'WebkitAnimation':'webkitAnimationEnd',
		      'OAnimation':'oAnimationEnd',
		      'msAnimation':'MSAnimationEnd',
		      'animation':'animationend'
		    }

		    for(t in transitions){
		        if( el.style[t] !== undefined ){
		            return transitions[t];
		        }
		    }
		},

		push:function(view, anim) {
			if( isAnimating ) {
				return false;
			}
			if (!anim) {
				anim = 'slide';
			};

			var nextView = view;
			nextView.animation = anim;

			var currView = Pages[Pages.length-1];
			var $currEl= currView.$el;
			$currEl.data( 'originalClassList', $currEl.attr( 'class' ) );
			
			$('#pt-main').append(view.render().el);
			var $nextEl = view.$el;
			$nextEl.addClass('pt-page');
			$nextEl.data( 'originalClassList', $nextEl.attr( 'class' ) );
			$nextEl.addClass( 'pt-page-current' );

			isAnimating = true;
			var outClass = '', inClass = '';
			switch( anim ) {
				case 'slide':
					// outClass = 'pt-page-moveToLeft';
					// inClass = 'pt-page-moveFromRight';
					outClass = 'pt-page-scaleDown';
					inClass = 'pt-page-moveFromRight pt-page-ontop';
					break;
				case 'slide_v':
					outClass = 'pt-page-fade';
					inClass = 'pt-page-moveFromBottom pt-page-ontop';
					break;
			}

			this.transition($currEl, $nextEl, outClass, inClass, function() {
				Pages.push(nextView);
			});
		},

		pop:function() {
			var currView = Pages[Pages.length-1];
			var $currEl = currView.$el;

			var nextView = Pages[Pages.length-2];
			var $nextEl = nextView.$el;

			$currEl.data( 'originalClassList', $currEl.attr( 'class' ) );
			$nextEl.data( 'originalClassList', $nextEl.attr( 'class' ) );
			$nextEl.addClass( 'pt-page-current' );

			var outClass = '', inClass = '';
			switch( currView.animation ) {
				case 'slide':
					// outClass = 'pt-page-moveToRight';
					// inClass = 'pt-page-moveFromLeft';
					outClass = 'pt-page-moveToRight pt-page-ontop';
					inClass = 'pt-page-scaleUp';
					break;
				case 'slide_v':
					outClass = 'pt-page-moveToBottomEasing pt-page-ontop';
					inClass = 'pt-page-moveFromTop';
					break;
			}

			this.transition($currEl, $nextEl, outClass, inClass, function() {
				currView.remove();
				Pages.pop();
			});
		},

		popToRoot: function() {
			var currView = Pages[Pages.length-1];
			var $currEl = currView.$el;

			var nextView = Pages[1];
			var $nextEl = nextView.$el;

			$currEl.data( 'originalClassList', $currEl.attr( 'class' ) );
			$nextEl.data( 'originalClassList', $nextEl.attr( 'class' ) );
			$nextEl.addClass( 'pt-page-current' );

			var outClass = '', inClass = '';
			switch( currView.animation ) {
				case 'slide':
					// outClass = 'pt-page-moveToRight';
					// inClass = 'pt-page-moveFromLeft';
					outClass = 'pt-page-moveToRight pt-page-ontop';
					inClass = 'pt-page-scaleUp';
					break;
				case 'slide_v':
					outClass = 'pt-page-moveToBottomEasing pt-page-ontop';
					inClass = 'pt-page-moveFromTop';
					break;
			}

			this.transition($currEl, $nextEl, outClass, inClass, function() {
				var length = Pages.length;
				for (var i = 2; i < length; i++) {
					Pages[i].remove();
				};
				Pages.splice(2, length-2);
			});
		},

		transition: function($currEl, $nextEl, outClass, inClass, callback) {
			
			var animEndEventName = this.eventName();
			var _self = this;

			if (outClass === '' || inClass === '') {
				this.onEndAnimation( $currEl, $nextEl, callback );
				return;
			};

			if (animEndEventName) {
				$currEl.addClass( outClass ).on( animEndEventName, function() {
					$currEl.off( animEndEventName );
					endCurrPage = true;
					if( endNextPage ) {
						_self.onEndAnimation( $currEl, $nextEl, callback );
					}
				} );

				$nextEl.addClass( inClass ).on( animEndEventName, function() {
					$nextEl.off( animEndEventName );
					endNextPage = true;
					if( endCurrPage ) {
						_self.onEndAnimation( $currEl, $nextEl, callback );
					}
				} );
			};
		},

		onEndAnimation: function( $outpage, $inpage, callback ) {
			endCurrPage = false;
			endNextPage = false;
			this.reset( $outpage, $inpage, callback );
			isAnimating = false;
		},

		reset: function( $outpage, $inpage, callback ) {	
			$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
			$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
			$outpage.removeClass('pt-page-current');
			if (callback) {
				callback();
			};
		}
	};
	return PT;
});