/*
 *
 * jQuery Align Height Plugin v. 0.1 I guess
 * I't takes a collection of elements and align their height on a per row basis, for visually aligning flexible grids
 * Visit http://morden.dk/2011/handy-jquery-plugin-for-aligning-height for examples and further explanation
 *
 * Usage: $( 'selector' ).alignHeight( sizes );
 * Example: $('#page > div[class^="col"]').alignHeight();
 *
 */


/* Map jQuery in a immediately invoked function to create closure and avoid comflicts */
;(function( $ ) {
	$.fn.alignHeight = function( options ) {

		// Caching collection of elements
		var $el = $( this );

		// Return elements for chaining immediately if there are not enough elements
		if ( $el.size() < 2 ) { return $el; }

		// Merge any options and get calculate rows as per opts.sizes 
		var opts = $.extend( {}, $.fn.alignHeight.defaults, options ),
			rows = $.fn.alignHeight.getRows( $el, opts.sizes );

		// Align the height of elements for each row in collection of rows 
		$.fn.alignHeight.setHeightsToRowMax( rows );

		// Return elements for chaining
		return $el;

	};
	$.fn.alignHeight.defaults = {
		
		// Sizes used as default
		sizes: {
			'col' : 100, 
			'col_25' : 25, 
			'col_33' : 33.33, 
			'col_50' : 50, 
			'col_75' : 75, 
			'col_100' : 100 
		}

	};
	$.fn.alignHeight.getRows = function( $el, sizes ) {

		// Create new array for the calculated rows
		var rows = [];
		
		/* 
		 * Push each row from the array of elements by calculating width by class names from sizes{}
		 * var total is the accumulated width, it is reset every time it gets above 100 ( hence a full row )
		 * var cols is a shifting starting point used when slicing the elements array and pushing them to rows[]
		 */
		for ( var i = 0, total = 0, cols = 0, l = $el.size(); i < l; i++ ) {
			
			/* 
			 * Calculate the width of the current element by getting it's assigned value from sizes and add it to total
			 * TODO: Find a better way than to use the first assigned className as lookup
			 */
			total += parseInt( 
				sizes[ 
					$el
						.eq( i )
						.attr( 'class' )
						.split( ' ' )[ 0 ]
				]
			, 10 );
			
			// If we exceed 100 we have a full row
			if( Math.ceil( total ) > 100 ){
				
				// So add these to the array of rows
				rows.push( $el.slice( cols, i ));
				
				// Then reset and go back one
				total = 0; cols = i; i--;
				
			// Then push any remaining elements as the last row
			} else if( i + 1 >= l ){

				rows.push( $el.slice( cols, i + 1 ) );

			}
			
		}
		
		return rows;
		
	};
	$.fn.alignHeight.setHeightsToRowMax = function( rows ) {

		// Set every elements height to maxHeight for each row in rows[]
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
}( this.jQuery ) );