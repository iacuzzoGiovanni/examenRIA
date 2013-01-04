/* JS Document
 * coded by GIOVANNI IACUZZO 2383
 * 2013
 */

/*jshint nonstandard: true, browser: true, boss: true */
/*global jQuery */

( function ( $ ) {
	"use strict";

	// --- global vars
	var $listeDesSeries = $("#seriesList ul");

	// --- methods
	var listSeries = function(){
		// On affiche tout les titres des séries se trouvant dans la base de donnée de betaseries
		$.ajax(
			{
				url:"http://api.betaseries.com/shows/display/all.json?key=81e3d2922ed3",
				type:"get",
				dataType: "jsonp",
				success:function(e){
					for (var i = 0; i<e.root.shows.length; i++) {
						$listeDesSeries.append('<li class="serie">' + e.root.shows[i].title  + '</li>');
					};
				},
				error:function(e,f,g){
					$listeDesSeries.append('<li class="errors">Une erreur s\'est produite lors du traitement de la requête</li>');
				}
			}
		)
	};

	var search = function(e){
		// On récupère la valeur du champ de recherche
		var filter = $(this).val();

		// On parcour toute la liste des séries
        $(".serie").each(function(){
            // Si l'élement de la liste ne contient pas le texte de recherche on le cache
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            // On montre la liste des séries si la recherche à aboutie à un résultat
            } else {
                $(this).show();
            }
        });
	};

	$( function () {
		// --- onload routines
		listSeries();
		$("#seriesSearch").on("keyup", search);
	} );

}( jQuery ) );

