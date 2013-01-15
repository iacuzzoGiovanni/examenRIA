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
	var $feedback = $("#feedback");
	
	// --- methods
	var checkIfAlreadyLogIn = function(){
		if(window.localStorage.length == 0){
			$content.hide();
			$nav.hide();
			$searchBox.hide();
			$infosBox.hide();
			$maSerie.hide();
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
		$content.css('marginTop', '4em');
		$content.show();
		$infosBox.hide();
		$maSerie.hide();
		$searchButton.hide();
		$searchBox.hide();
		$listeDesSeries.empty();
		iCurrentPage = 1;
		currentPageName();
		if(e.type === "click"){
			showHideMenu();
		}
		for( var serie in window.localStorage ){
			if( serie.substring( 0, 6 ) === "serie_" ){
				var dataSerie = JSON.parse(window.localStorage.getItem(serie));
				$listeDesSeries.append('<li class="serie" data-titre="' + dataSerie.title +'" data-url="' + dataSerie.url +'"><span>' + dataSerie.title + '</span><button class="icon-right-circled aSaison"></button></li>');				
			}
		}
	}; // On affiche tout les titres des séries ajoutée par l'utilisateur

	var search = function(e){
		$listeDesSeries.empty();
		var sKeyWord = $("#seriesSearch").val();

		if(sKeyWord === "" || sKeyWord.length < 3){

		}else{
			$.ajax(
				{
					url:"http://api.betaseries.com/shows/search.json?title=" + sKeyWord + "&key=81e3d2922ed3",
					type:"get",
					dataType: "jsonp",
					success:function(e){
						for (var i = 0; i<e.root.shows.length; i++) {
							//$listeDesSeries.append('<li class="serie" data-url="' + e.root.shows[i].url + '" data-titre="' + e.root.shows[i].title + '"><span>' + e.root.shows[i].title +'</span><button class="icon-info-circled"></button><button class="icon-plus-circled"></button></li>');
							if(!checkIfAlreadyAdded(e.root.shows[i].url)){
								$listeDesSeries.append('<li class="serie" data-url="' + e.root.shows[i].url + '" data-titre="' + e.root.shows[i].title + '"><span>' + e.root.shows[i].title +'</span><button class="icon-info-circled"></button><button class="icon-plus-circled"></button></li>');
							}
						};
					},
					error:function(e,f,g){
						$listeDesSeries.append('<li class="errors">Une erreur s\'est produite lors du traitement de la requête</li>');
					}
				}
			)
		}
	}; // On recherche une série particulière à l'aide des mots entrés par l'utilisateur

	var checkIfAlreadyAdded = function(data){
		var theSerie;
		for(var serie in window.localStorage){
			if(serie.substring( 0, 6 ) === "serie_"){
				var dataSerie = JSON.parse(window.localStorage.getItem(serie));
				if(data === dataSerie.url){
					theSerie = true;
				}
			}
		}
		return theSerie;
	};

	var showHideMenu = function(e){
		if(bMenu){
			bMenu = false;
			$sideMenu.animate({left: '-=75%'}, 1000);
			$content.animate({left: '-=75%'}, 1000);
			$nav.animate({left: '-=75%'}, 1000);
			$searchBox.animate({left: '-=75%'}, 1000);
			$infosBox.animate({left: '-=75%'}, 1000);
			$maSerie.animate({left: '-=75%'}, 1000);
		}else{
			bMenu = true;
			$sideMenu.animate({left: '+=75%'}, 1000);
			$content.animate({left: '+=75%'}, 1000);
			$nav.animate({left: '+=75%'}, 1000);
			$searchBox.animate({left: '+=75%'}, 1000);
			$infosBox.animate({left: '+=75%'}, 1000);
			$maSerie.animate({left: '+=75%'}, 1000);
		}
	}; // On anime l'interface

	var goToAddPage = function(e){
		$maSerie.hide();
		$searchButton.show();
		$searchBox.css("top", "4em");
		$content.css("marginTop", "6em");
		$searchBox.show();
		iCurrentPage = 2;
		currentPageName();
		showHideMenu();
		$listeDesSeries.empty();
	}; // On redirige vers la page d'ajout de serie

	var currentPageName = function(){
		var $pageName = $("nav h2");
		switch (iCurrentPage) {
			case 1:
			$pageName.text("-- liste de mes séries --");
			break;
			case 2:
			$pageName.text("-- ajouter une série --");
			break;
			case 3:
			$pageName.text("-- mon planning --");
			break;
		}	
	}; // On regarde si l'id de la page correspond a une des pages et affiche la parge sur laquelle on se trouve

	var addSerie = function(event){
		var objetThis = $(this);
		/*for(serie in window.localStorage){
			if(serie.substring( 0, 6 ) === "serie_"){
				if(serie.url === objetThis.parent().attr("data-url")){

				}
			}
		}*/
		getInfoSerie(objetThis.parent().attr("data-url"), function(e){
			getDataSerie(objetThis.parent().attr("data-url"), function(ev){
				var seasons = ev.root.seasons,
					data = {},
					laSerie = {"url": objetThis.parent().attr("data-url"),
						   	   "title" : objetThis.parent().attr("data-titre"),
						   	   "seasons" : seasons
				    };
				
				for(var i = 0; i<seasons.length; i++){
					for(var j = 0; j<seasons[i].episodes.length; j++){
						seasons[i].episodes[j].view = false;
					}
				}
				
				data.banner = e.root.show.banner;
				data.channel = e.root.show.network;
				laSerie.infosSerie = data;
				window.localStorage.setItem("serie_" + objetThis.parent().attr("data-titre"), JSON.stringify(laSerie));
				displayFeedback('votre série à bien été ajouté dans la base de données');
				setFeeback();
			});
		});

	}; // On ajoute la serie dans le local storage


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
		$("html").scrollTop(0);
		$searchBox.css("top", "2em");
		$infosBox.show();
		$content.animate({left: '-=100%'}, 1000);
		$infosBox.animate({left: '-=100%'}, 1000, function(){$content.hide();});
		
		getInfoSerie(objetThis.parent().attr("data-url"), function(e){
			$infosBox.attr('data-url', e.root.show.url);
			$infosBox.attr('data-titre', e.root.show.title);
			$("#infosSerie img").attr('src', e.root.show.banner);
			$("#infosSerie h1").text(e.root.show.title);
			$(".description").text(e.root.show.description);
			$(".genre p").text(e.root.show.genres);
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
		$searchBox.css("top", "4em");
		$content.animate({left: '+=100%'}, 1000);
		$infosBox.animate({left: '+=100%'}, 1000, function(){$("html").scrollTop(0); });
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
	}; //On récupère les nfos des séries

	var afficheSaison = function(e){
		$maSerie.css("left", "100%");
		$maSerie.show();
		$content.animate({left: '-=100%'}, 1000, function(){
															$content.hide();
															$content.animate({left: '+=100%'}, 1000);
															});
		$maSerie.animate({left: '-=100%'}, 1000, function(){$content.hide();});
		
		for( var serie in window.localStorage ){
			if( serie === "serie_"+$(this).parent().attr('data-titre') ){
				var dataSerie = JSON.parse(window.localStorage.getItem(serie));
				for(var i = 0; i<dataSerie.seasons.length; i++){
					$maSerie.append('<h2>Saison ' + (parseInt(i)+parseInt(1)) + '</h2>');
					for(var j = 0; j<dataSerie.seasons[i].episodes.length; j++){
						var nb = (parseInt(j)+parseInt(1)),
							view,
							icon;

						if(dataSerie.seasons[i].episodes[j].view==true){
							view = 'vu';
							icon = 'icon-check'
						}else{
							view = 'nonVu';
							icon = 'icon-cancel'
						}
						$maSerie.append('<a href="#" class="' + view + ' episode" data-titre="' + dataSerie.title +'" data-saison="' + dataSerie.seasons[i].number + '" data-episode="' + dataSerie.seasons[i].episodes[j].episode + '">Episode ' + nb.toString() + ' : ' + dataSerie.seasons[i].episodes[j].title + '<span class="' + icon + '"></span></a>');
					}
				}
			}
		}
		e.preventDefault();
	}; // On affiche les saisons d'une série

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
	}; //On récupère les données du planning

	var afficherMonPlanning = function(e){
		$content.css("marginTop", "4em");
		$searchBox.css("top", "2em");
		$maSerie.hide();
		$content.show();
		$listeDesSeries.empty();
		iCurrentPage = 3;
		currentPageName();
		showHideMenu();
		getDataPlanning(function(e){
			for( var serie in window.localStorage ){
				if( serie.substring( 0, 6 ) === "serie_" ){
					var dataSerie = JSON.parse(window.localStorage.getItem(serie));
					$listeDesSeries.append('<li><h2 class="titrePlanning">' + dataSerie.title + '</h2><ul class="' + dataSerie.url + '"></ul></li>');
					for(var i = 0; i<e.root.planning.length; i++){
						if(e.root.planning[i].url === dataSerie.url){
							var date = new Date(e.root.planning[i].date*1000);
							var year = date.getFullYear();
							var day = date.getDate();
							var month = date.getMonth()+1;
							$("." + dataSerie.url).append('<li class="serie">' + e.root.planning[i].number + ' sera diffusé le : ' + day + ' / ' + month + ' / ' + year + ' sur ' + dataSerie.infosSerie.channel + '</li>');
						}
					}				
				}
			}
		});
	}; // On affiche le planning de tous mes épisodes

	var updateData = function(){
		var i=0,
			n=0,
			urlS = [],
			localNbEpisodes = [],
			episodesManquant = [];
		for( var serie in window.localStorage){
			if( serie.substring( 0, 6 ) === "serie_" ){
				var dataSerie = JSON.parse(window.localStorage.getItem(serie));
				localNbEpisodes[i] = dataSerie.seasons[dataSerie.seasons.length-1].episodes.length;
 				urlS[i] = dataSerie.url;
 				getDataSerie(urlS[i], function(e){
					var betaDbnBEpisodes = e.root.seasons[e.root.seasons.length-1].episodes.length;
					if(localNbEpisodes[n] === betaDbnBEpisodes){
	 					var nbEpisodeM = betaDbnBEpisodes - localNbEpisodes[n];
	 					var episodeAajouter = episodeAajouterF(nbEpisodeM, betaDbnBEpisodes);
	 					for(var k = 0; k<episodeAajouter.length; k++){
							episodesManquant[k] = e.root.seasons[dataSerie.seasons.length-1].episodes[episodeAajouter[k]-1];
	 						dataSerie.seasons[dataSerie.seasons.length-1].episodes[episodeAajouter[k]-1] = episodesManquant[k];
	 						dataSerie.seasons[dataSerie.seasons.length-1].episodes[episodeAajouter[k]-1].view = false;
	 						window.localStorage.setItem('serie_'+dataSerie.title, JSON.stringify(dataSerie));
	 					}
	 				}
	 				n++;
 				});
				i++;
			}
		}
	}; // On vérifie si de nouveaux épisodes sont parru ou pas et si oui on les ajoute au localStorage

	var episodeAajouterF = function(nb, top){
		var nbI = nb;
		var tab = [];
		for(var i = 0; i<nb; i++){
			tab[i] = top-(nbI-1);
			nbI--;
		}
		return tab;
	} // On calcule les numero des épisodes qu'il faut rajotuer

	var vuPasVu = function(e){
		e.preventDefault();
		$(this).attr('class', 'vu episode');
		$(this).children("span").attr("class", "icon-check");
		for( var serie in window.localStorage){
			if(serie === 'serie_'+$(this).attr('data-titre')){
				var dataSerie = JSON.parse(window.localStorage.getItem(serie));
				dataSerie.seasons[($(this).attr('data-saison'))-1].episodes[($(this).attr('data-episode'))-1].view = true;
				window.localStorage.setItem("serie_" + $(this).attr("data-titre"), JSON.stringify(dataSerie));
			}
		}
	}; // On indique si un épisode à été vu ou pas

	var setFeeback = function(){
		$feedback.css("top", (($(window).height()/2)-($feedback.height()/2))+"px");
		$feedback.css("left", (($(window).width()/2)-($feedback.width()/2))+"px");
		$feedback.children("span").css("top", $feedback.height()/2-$feedback.children("span").height()/2);
	}; // Settings des feeback

	var displayFeedback = function(data){
		$feedback.children("span").text(data);
		$feedback.animate({opacity: '+=.8'}, 1000, function(){$feedback.delay(2000).animate({opacity:"-=.8"}, 1000);});
	}; // On affiche les feedback

	$( function () {
		// --- onload routines
		setFeeback();
		updateData();
		$("#prenom").val('');
		$("#sideMenu h1").text("Que veux-tu faire "+ window.localStorage.getItem("prenom") +" ?");
		checkIfAlreadyLogIn();
		$("#readyToGo").on("click", registerUser);
		$(".icon-menu").on("click", showHideMenu);
		$("#seriesSearch").on("keyup", search);
		$toAdd.on("click", goToAddPage);
		$(".icon-plus-circled").live("click", addSerie);
		$(".icon-info-circled").live("click", displayInfoSerie);
		$(".icon-back").on("click", displaySearch);
		$("#infosSerie.icon-plus-circled").on("click", addSerie);
		$("#toList").on("click", listSeries);
		$(".aSaison").live("click", afficheSaison);
		$(".episode").live("click", vuPasVu);
		$toPlan.on("click", afficherMonPlanning);
		console.log(window.localStorage);
	} );
}( jQuery ) );

