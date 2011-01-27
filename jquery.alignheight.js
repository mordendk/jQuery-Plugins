
/*
 *  jQuery pluggy for aligning portlet heights per row
 */
;(function( $ ) {
	$.fn.alignHeight = function( options ) {

		$el = $( this );

		// Return if not enough elements
		if ( $el.size() < 2 ) return $el;

		// Merge options and get rows
		var opts = $.extend( {}, $.fn.alignHeight.defaults, options ),
			rows = $.fn.alignHeight.getRows( $el, opts.sizes );


		// Align the heights for each row and set a class for last element in each row
		$.fn.alignHeight.setHeightsToRowMax( rows );

		// Return elements for chaining
		return $el;

	};
	$.fn.alignHeight.defaults = {
		sizes: {
			'col' : '100', 
			'col_25' : '25', 
			'col_33' : '33,33', 
			'col_50' : '50', 
			'col_75' : '75', 
			'col_100' : '100' 
		}
	};
	$.fn.alignHeight.getRows = function( $el, sizes ) {

		// Create new array for rows
		var rows = [];
		
		// Push each row from the array of elements by calculating widths by classnames from sizes{}
		// var total is the collected with, it is reset every time it gets above 100 
		// cols is the starting point used when slicing the elements array and pusing it to rows[]
		for (var i = 0, total = 0, cols = 0, l = $el.size(); i < l; i++) {
			
			// Calculate the width of the current element by class
			total += parseInt( 
				sizes[ 
					$el
						.eq( i )
						.attr('class')
						.split(' ')[ 0 ]
				]
			);
			
			// If we exceed 100 we have a full row
			if( Math.ceil( total ) > 100 ){
				
				// So add these to the array of rows
				rows.push( $el.slice( cols, i ));
				
				// Then reset and go back one
				cols = i; total = 0; i--;
				
			}
			
			// And push any remaining elements as the last row
			else if( i + 1 >= l ){
				rows.push( $el.slice( cols, i + 1 ) );
			}
			
		}
		
		return rows;
		
	};
	$.fn.alignHeight.setHeightsToRowMax = function( rows ) {

		// Set all heights to maxHeight for each row in rows[] and adding any additional addHeight from options
		for ( var i = 0, l = rows.length; i < l; i++ ) {
			var $row = $( rows[ i ] );
			if( $row.length > 1 ){
				$row.height( $.fn.alignHeight.findMaxHeight( $row ) );
			}
		}
	};
	$.fn.alignHeight.findMaxHeight = function( $el ) {

		//Set maxHeight to the height of the first element
		var maxHeight = $el.height(),
			curHeight;

		//Loop through the rest to see if one is higher
		for ( var i = 1, l = $el.size(); i < l; i++ ) {
			curHeight = $el.eq( i ).height();
			maxHeight = ( curHeight > maxHeight ) ? curHeight : maxHeight;
		}

		return maxHeight;

	};
})( this.jQuery );