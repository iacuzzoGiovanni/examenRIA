/* JS Document
 * coded by GIOVANNI IACUZZO 2383
 * 2013
 */

/*jshint nonstandard: true, browser: true, boss: true */
/*global jQuery */

( function ( $ ) {
	"use strict";

	// --- global vars
	var $content = $("#content");
	var $listeDesSeries = $("#seriesList ul");
	var eSignIn = $("#firstLog");

	// --- methods
	var checkIfAlreadyLogIn = function(){
		if(window.localStorage.length == 0){
			$content.hide();
		}else{
			eSignIn.remove();
			$content.show();
			listSeries();
		}
	}; // On vérifie si la personne s'est déja servie ou pas de l'app

	var registerUser = function(e){
		e.preventDefault();
		var prenom = $("#prenom").val();
		if(!prenom == ""){
			window.localStorage.setItem('prenom', prenom);
			eSignIn.slideUp();
			$content.show();
			listSeries();
		}
	}; // On enregistre l'utilisateur en récupérant son prénom simplement

	var listSeries = function(){
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
	}; // On affiche tout les titres des séries se trouvant dans la base de donnée de betaseries

	var search = function(e){
		$listeDesSeries.empty();
		var sKeyWord = $("#seriesSearch").val();

		if(sKeyWord === ""){
			listSeries();
		}else{
			$.ajax(
				{
					url:"http://api.betaseries.com/shows/search.json?title=" + sKeyWord + "&key=81e3d2922ed3",
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
		}
	}; // On recherche une série particulière à l'aide des mots entrés par l'utilisateur

	$( function () {
		// --- onload routines
		checkIfAlreadyLogIn();
		$("#prenom").val('');
		$("#readyToGo").on("click", registerUser);
		$("#seriesSearch").on("keyup", search);
		console.log(window.localStorage);
		window.localStorage.clear();
	} );

}( jQuery ) );

