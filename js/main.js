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
	var $sideMenu = $("#sideMenu");
	var $searchBox = $("#search");
	var bMenu = false;
	var bSearch = false;
	var $nav = $("nav");
	var iCurrentPage;
	var $toAdd = $("#toAdd");
	var oIfByClick = {"type": undefined};
	var $searchButton = $(".icon-search");
	var $infosBox = $("#infosSerie");
	var $maSerie = $("#maSerie");
	var $toPlan = $("#toPlan");
	
	// --- methods
	var checkIfAlreadyLogIn = function(){
		if(window.localStorage.length == 0){
			$content.hide();
			$nav.hide();
			$searchBox.hide();
		}else{
			eSignIn.remove();
			$content.show();
			$nav.show();
			$searchBox.show();
			listSeries(oIfByClick);
		}
	}; // On vérifie si la personne s'est déja servie ou pas de l'app

	var registerUser = function(e){
		e.preventDefault();
		var prenom = $("#prenom").val();
		if(!prenom == ""){
			window.localStorage.setItem('prenom', prenom);
			eSignIn.animate({
				    top: '-=100%'
				  }, 1000, function() {
				  	$("#sideMenu h1").text("Que veux-tu faire "+ window.localStorage.getItem("prenom") +" ?");
				    $content.show();
				    $nav.show();
					listSeries(oIfByClick);
				  });	
		}
	}; // On enregistre l'utilisateur en récupérant son prénom simplement

	var listSeries = function(e){
		$searchButton.hide();
		$searchBox.hide();
		$listeDesSeries.empty();
		iCurrentPage = 1;
		currentPageName();
		console.log(e);
		if(e.type === "click"){
			showHideMenu();
		}
		for( var serie in window.localStorage ){
			if( serie.substring( 0, 6 ) === "serie_" ){
				var dataSerie = JSON.parse(window.localStorage.getItem(serie));
				$listeDesSeries.append('<li class="serie" data-url="' + dataSerie.url +'"><span>' + dataSerie.title + '</span><button class="icon-right-circled aSaison"></button></li>');				
			}
		}
	}; // On affiche tout les titres des séries ajoutée par l'utilisateur

	var search = function(e){
		$listeDesSeries.empty();
		var sKeyWord = $("#seriesSearch").val();

		if(sKeyWord === "" || sKeyWord.length < 3){

			//listSeries(oIfByClick);
		}else{
			$.ajax(
				{
					url:"http://api.betaseries.com/shows/search.json?title=" + sKeyWord + "&key=81e3d2922ed3",
					type:"get",
					dataType: "jsonp",
					success:function(e){
						for (var i = 0; i<e.root.shows.length; i++) {
							$listeDesSeries.append('<li class="serie" data-url="' + e.root.shows[i].url + '" data-titre="' + e.root.shows[i].title + '"><span>' + e.root.shows[i].title +'</span><button class="icon-info-circled"></button><button class="icon-plus-circled"></button></li>');
						};
					},
					error:function(e,f,g){
						$listeDesSeries.append('<li class="errors">Une erreur s\'est produite lors du traitement de la requête</li>');
					}
				}
			)
		}
	}; // On recherche une série particulière à l'aide des mots entrés par l'utilisateur

	var showHideMenu = function(e){
		if(bMenu){
			bMenu = false;
			$sideMenu.animate({
				    left: '-=75%'
				  }, 1000);
			$content.animate({
				    left: '-=75%'
				  }, 1000);
			$nav.animate({
				    left: '-=75%'
				  }, 1000);
			$searchBox.animate({
				    left: '-=75%'
				  }, 1000);
			$infosBox.animate({
					left: '-=75%'
				  }, 1000);
		}else{
			bMenu = true;
			$sideMenu.animate({
				    left: '+=75%'
				  }, 1000);
			$content.animate({
				    left: '+=75%'
				  }, 1000);
			$nav.animate({
				    left: '+=75%'
				  }, 1000);
			$searchBox.animate({
				    left: '+=75%'
				  }, 1000);
			$infosBox.animate({
					left: '+=75%'
				  }, 1000);
		}
	}; // On anime l'interface

	var showHideSearch = function(e){
		$searchBox.show();
		if(bSearch){
			bSearch = false;
			$content.animate({
				    marginTop: '-=2em'
				  }, 500);
			$searchBox.animate({
				    top: '-=2em'
				  }, 500);
			$infosBox.animate({
				    top: '-=2em'
				  }, 500);
		}else{
			bSearch = true;
			$content.animate({
				    marginTop: '+=2em'
				  }, 500);
			$searchBox.animate({
				    top: '+=2em'
				  }, 500);
			$infosBox.animate({
				    top: '+=2em'
				  }, 500);
		}
	}; // On montre ou as la zone de recherche

	var goToAddPage = function(e){
		$searchButton.show();
		iCurrentPage = 2;
		currentPageName();
		showHideMenu();
		$listeDesSeries.empty();
	}; // On redirige vers la page d'ajout de serie

	var currentPageName = function(){
		var $pageName = $("nav h2");
		switch (iCurrentPage) {
			case 1:
			$pageName.text("-- liste de mes séries --")
			break;
			case 2:
			$pageName.text("-- ajouter une série --")
			break;
		}	
	}; // On regarde si l'id de la page correspond a une des pages et affiche la parge sur laquelle on se trouve

	var addSerie = function(event){
		var objetThis = $(this);
			
		getInfoSerie(objetThis.parent().attr("data-url"), function(e){
			var data = {},
				laSerie = {"url": objetThis.parent().attr("data-url"),
				   	   "title" : objetThis.parent().attr("data-titre")
				      };

			data.banner = e.root.show.banner;
			laSerie.infosSerie = data;
			window.localStorage.setItem("serie_" + objetThis.parent().attr("data-titre"), JSON.stringify(laSerie));
		});
			
	}; // On ajoute la serie dans le local storage avec quelques infos de bases

	var getInfoSerie = function(urlSerie, successCallback){
		$.ajax(
				{
					url:"http://api.betaseries.com/shows/display/" + urlSerie + ".json?key=81e3d2922ed3",
					type:"get",
					dataType: "jsonp",
					success:function(e){						
						successCallback.apply(null, [e]);
					},
					error:function(e,f,g){
						$listeDesSeries.append('<li class="errors">Une erreur s\'est produite lors du traitement de la requête</li>');
					}
				}
			)
	}; // On récupère les infos d'une série

	var displayInfoSerie = function(e){
		var objetThis = $(this);
		$content.animate({
				    left: '-=100%'
				  }, 1000);
		$infosBox.animate({
				    left: '-=100%'
				  }, 1000, function(){
				  	$content.hide();
				  });
		
		getInfoSerie(objetThis.parent().attr("data-url"), function(e){
			console.log(e);
			$infosBox.attr('data-url', e.root.show.url);
			$infosBox.attr('data-titre', e.root.show.title);
			$("#infosSerie img").attr('src', e.root.show.banner);
			$("#infosSerie h1").text(e.root.show.title);
			$(".description").text(e.root.show.description);
			$(".genre p").text(e.root.show.genres);
			//console.log(e.root.show.seasons.length());
			$(".saisons p").text(calculateNumberOfSeasons(e.root.show.seasons));
		});
	}; //On affiche mes infos d'une série

	var calculateNumberOfSeasons = function(data){
		var count = 0;

	    for(var prop in data) {
	    	if(data.hasOwnProperty(prop))
	    		++count;
	    }

	    return count;
	}; // On calcule le nombre de saison

	var displaySearch = function(e){
		$content.show();
		$content.animate({
				    left: '+=100%'
				  }, 1000);
		$infosBox.animate({
				    left: '+=100%'
				  }, 1000, function(){
				  	$("html").scrollTop(0);
				  });
	}; // On retourne à la recherche

	var getDataSerie = function(urlSerie, successCallback){
		$.ajax(
				{
					url:"http://api.betaseries.com/shows/episodes/" + urlSerie + ".json?summary=1&hide_notes=1&key=81e3d2922ed3",
					type:"get",
					dataType: "jsonp",
					success:function(e){			
						successCallback.apply(null, [e]);
					},
					error:function(e,f,g){
						$listeDesSeries.append('<li class="errors">Une erreur s\'est produite lors du traitement de la requête</li>');
					}
				}
			)
	};

	var afficheSaison = function(e){
		var objetThis = $(this);
		
		$content.animate({
				    left: '-=100%'
				  }, 1000);
		$maSerie.animate({
				    left: '-=100%'
				  }, 1000, function(){
				  	$content.hide();
				  });

		getDataSerie(objetThis.parent().attr("data-url"), function(e){
			console.log(e);
			console.log(e.root.seasons.length);	

			for(var i = 0; i<e.root.seasons.length; i++){
				$maSerie.append('<h2>Saison ' + (parseInt(i)+parseInt(1)) + '</h2>');

				for(var j = 0; j<e.root.seasons[i].episodes.length; j++){
					var nb = (parseInt(j)+parseInt(1));
					$maSerie.append('<p>Episode ' + nb.toString() + ' : ' + e.root.seasons[i].episodes[j].title + '</p>');
				}
			}
		});
	};

	var getDataPlanning = function(successCallback){
		$.ajax(
				{
					url:"http://api.betaseries.com/planning/general.json?key=81e3d2922ed3",
					type:"get",
					dataType: "jsonp",
					success:function(e){			
						successCallback.apply(null, [e]);
					},
					error:function(e,f,g){
						$listeDesSeries.append('<li class="errors">Une erreur s\'est produite lors du traitement de la requête</li>');
					}
				}
			)
	};

	var afficherMonPlanning = function(e){
		getDataPlanning(function(e){
			console.log(e);
		});
	};

	$( function () {
		// --- onload routines
		$("#prenom").val('');
		$("#sideMenu h1").text("Que veux-tu faire "+ window.localStorage.getItem("prenom") +" ?");
		checkIfAlreadyLogIn();
		$("#readyToGo").on("click", registerUser);
		$(".icon-menu").on("click", showHideMenu);
		$searchButton.on("click", showHideSearch);
		$("#seriesSearch").on("keyup", search);
		$toAdd.on("click", goToAddPage);
		$(".icon-plus-circled").live("click", addSerie);
		$(".icon-info-circled").live("click", displayInfoSerie);
		$(".icon-back").on("click", displaySearch);
		$("#infosSerie.icon-plus-circled").on("click", addSerie);
		$("#toList").on("click", listSeries);
		$(".aSaison").live("click", afficheSaison);
		$toPlan.on("click", afficherMonPlanning);

		console.log(window.localStorage);
	} );

}( jQuery ) );

