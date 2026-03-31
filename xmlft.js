const querySuggestions = function( expr, domain, func ){
    $.get( "FranceTerme.xml",
	   function( data ){
	       console.log( $( data ).find( "CRITER Article Terme" ).length, "terms in xml file" );
	       $( data ).find( "CRITER Article" ).each( function( index ){
		   let article = this;
		   let entry = $(this).find( "Terme" ); // Array
		   let equiv = $(this).find( "Equi_prop" ); // Array
		   // Filter on domain
		   $(this).find( "Dom" ).each( function(index){
		       if( $(this).text().includes( domain ) ){
			   // Test term entry and equivalents
			   // console.log( index, $( entry ).text().replace(/^\s+|\s+$/g, '') );
			   $( equiv ).each( function(index){
			       if( $(this).text().includes( expr ) ){
				   func( index, entry, article );
			       }
			   });
		       }
		   });
	       });
	   },
	   "xml"
	 );
};

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
