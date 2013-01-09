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
				$listeDesSeries.append('<li class="serie">' + dataSerie.title + '</li>');				
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
				  }, 1000, function() {
				  	//effectuer
				  });
			$content.animate({
				    left: '-=75%'
				  }, 1000, function() {
				  	//effectuer
				  });
			$nav.animate({
				    left: '-=75%'
				  }, 1000, function() {
				  	//effectuer
				  });
			$searchBox.animate({
				    left: '-=75%'
				  }, 1000, function() {
				  	//effectuer
				  });
		}else{
			bMenu = true;
			$sideMenu.animate({
				    left: '+=75%'
				  }, 1000, function() {
				  	//effectuer
				  });
			$content.animate({
				    left: '+=75%'
				  }, 1000, function() {
				  	//effectuer
				  });
			$nav.animate({
				    left: '+=75%'
				  }, 1000, function() {
				  	//effectuer
				  });
			$searchBox.animate({
				    left: '+=75%'
				  }, 1000, function() {
				  	//effectuer
				  });
		}
	}; // On anime l'interface

	var showHideSearch = function(e){
		$searchBox.show();
		if(bSearch){
			bSearch = false;
			$content.animate({
				    marginTop: '-=2em'
				  }, 500, function() {
				  	//effectuer
				  });
			$searchBox.animate({
				    top: '-=2em'
				  }, 500, function() {
				  	//effectuer
				  });
		}else{
			bSearch = true;
			$content.animate({
				    marginTop: '+=2em'
				  }, 500, function() {
				  	//effectuer
				  });
			$searchBox.animate({
				    top: '+=2em'
				  }, 500, function() {
				  	//effectuer
				  });
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
			
		getInfoSerie($(this).parent().attr("data-url"), function(e){
			var data = {},
				laSerie = {"url": objetThis.parent().attr("data-url"),
				   	   "title" : objetThis.parent().attr("data-titre")
				      };

			data.banner = e.root.show.banner;
			data.description = e.root.show.description;
			data.genres = e.root.show.genres;
			data.id_thetvdb = e.root.show.id_thetvdb;
			data.seasons = e.root.show.seasons;
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
				  }, 1000, function() {
				  	//effectuer
				  });
		
		getInfoSerie(objetThis.parent().attr("data-url"), function(e){
			console.log(e);
			$("#infosSerie img").attr('src', e.root.show.banner);
			$("#infosSerie h1").text(e.root.show.title);
			$(".description").text(e.root.show.description);
		});
	}; //On affiche mes infos d'une série

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
		$("#toList").on("click", listSeries);
		console.log(window.localStorage);
	} );

}( jQuery ) );

