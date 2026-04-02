/**
 * @file Experimentations with queries against TerMef XML file. Uses jQuery.
 * @author jmc@neurondata.org  
 */

/**
 * Test the presence of text expression expr in an 'Article' field
 *
 * @param {string} expr - Text expression
 * @param {array} arr - Array of same XML-element fields in an 'Article'
 * @param {function} func - Callback function
 * @param {object} entry - Article entry, passed to the callback
 * @param {object} article - Article, passed to the callback
 * @returns {*} -  
 */
const testSingleField = function( expr, arr, func, entry, article ){
    $( arr ).each( function (index ){
	if( $(this).text().toLowerCase().includes( expr.toLowerCase() ) ){
	    func( index, entry, article );
	}
    });
};


/**
 * Test the presence of all regexps in an 'Article' field 
 *
 * @param {*} regexps - An array of regular expressions which should all be matched
 * @param {array} arr - Array of same XML-element fields in an 'Article'
 * @param {function} func - Callback function
 * @param {object} entry - Article entry, passed to the callback
 * @param {object} article - Article, passed to the callback
 * @returns {*} - 
 */
const testReSingleField = function( regexps, arr, func, entry, article ){
    $( arr ).each( function(index){
	// And test all re in regexps
	console.log( "<testRe>", regexps, $(this).text() );
	let andBool	= true;
	let nClauses	= regexps.length;
	let n		= 0;
	while( andBool && (n < nClauses) ){
	    if( null == $(this).text().match( regexps[n] ) ){
		andBool = false;
	    }
	    n += 1;
	}
	if( andBool ){
	    func( index, entry, article );
	}
    });
};


/**
 * Given an expression and a domain, find suggested revisions in TerMef
 *
 * @param {string} expr - Candidate text for revision
 * @param {string} domain - Domain of search within TerMef
 * @param {function} func - Callback which will be passed an index, the term entry and the article on each match
 * @returns {*} - 
 */
const querySuggestions = function( expr, domain, func ){
    $.get( "FranceTerme.xml",
	   function( data ){
	       console.log( $( data ).find( "CRITER Article Terme" ).length, "terms in xml file" );
	       $( data ).find( "CRITER Article" ).each( function( index ){
		   let article		= this;
		   let entry		= $(this).find( "Terme" ); // Array
		   let equiv		= $(this).find( "Equivalent Equi_prop" ); // Array
		   let equiv_var	= $(this).find( "Equivalent variante" ); // Array
		   // Filter on domain
		   $(this).find( "Dom" ).each( function(index){
		       if( $(this).text().includes( domain ) ){
			   // Test equivalents and their variants
			   // console.log( index, $( entry ).text().replace(/^\s+|\s+$/g, '') );
			   testSingleField( expr, equiv, func, entry, article );
			   testSingleField( expr, equiv_var, func, entry, article );
			   // Tests based on regexps
			   let re	= new RegExp( "« " + expr + " »" );
			   let re_val	= /est déconseillé/ ;
			   let arr	= $(article).find( "Note" );
			   testReSingleField( [ re, re_val ], arr,func, entry, article );
			   arr	= $(article).find( "Notes" );
			   testReSingleField( [ re, re_val ], arr,func, entry, article );
		       }
		   });
	       });
	   },
	   "xml"
	 );
};


/**
 * Inits and sets up search on button
 *
 * @param {nil} nil - 
 * @returns {*} - 
 */
$( function(){
    $( "#suggestions" ).on( "click", function(){
	$( "#xmlftResult" ).val( "" );
	querySuggestions( $( "#xmlftQuery" ).val(), "Informatique",
			  function( index, entry, article ){
			      // console.log( index, $( entry ).text().replace(/^\s+|\s+$/g, '') );
			      let str = $( "#xmlftResult" ).val();
			      $( "#xmlftResult" ).val( str + $( entry ).text().replace(/^\s+|\s+$/g, '') );
			  });
    });
});
