// A typical tag is : {text: " ", weight: [1-10], url: " ", title: " ", type : "popup or null" }
var word_list = [
	{text: "Défis", weight: 6, url: "tags/defis.html", title: "Relevons vos défis", type: "popup"},
	{text: "Offshore", weight: 10, url: "tags/offshore.html", title: "Offshore", type: "popup"},
	{text: "Service", weight: 7, url: "tags/services.html", title: "Service configurable", type: "popup"},
	{text: "Confidentialité", weight: 5, url: "tags/confidentialite.html", title: "Confidentialité", type: "popup"},
	{text: "4SH", weight: 6, url: "tags/4sh.html", title: "4SH", type: "popup"},
	{text: "Créer", weight: 9, url: "tags/creer.html", title:"Créer", type: "popup"},
	{text: "Documenter", weight: 5, url: "tags/documenter.html", title: "Documenter", type: "popup"},
	{text: "Benchmarker", weight: 7, url: "tags/benchmarker.html", title: "Benchmarker", type: "popup"},
	{text: "Supporter", weight: 6, url: "tags/supporter.html", title: "Prendre en charge", type: "popup"},
	{text: "Vendre", weight: 9, url: "tags/vendre.html", title: "Aider à vendre", type: "popup"},
	{text: "Restructurer", weight: 8, url: "tags/restructurer.html", title: "Restructurer", type: "popup"},
	{text: "Auditer", weight: 6, url: "tags/auditer.html", title: "Auditer et conseiller", type: "popup"},
	{text: "Améliorer", weight: 5, url: "tags/ameliorer.html", title: "Améliorer l'organisation de la production", type: "popup"},
	{text: "Controler", weight: 5, url: "tags/controler.html", title: "Controler", type: "popup"},
	{text: "Sélectionner", weight: 7, url: "tags/selectionner.html", title: "Sélectionner", type: "popup"},
	{text: "Technologie", weight: 9, url: "tags/technologie.html", title: "Les technologies", type: "popup"},
	{text: "Challenges", weight: 6, url: "tags/defis.html", title: "Vos défis - Nos challenges", type: "popup"},
	{text: "Méthodologie", weight: 6, url: "tags/methodologie.html", title: "La méthodologie", type: "popup"},
	{text: "Atout", weight: 10, url: "tags/atout.html", title: "Atout 4SH", type: "popup"},
	{text: "Différences", weight: 9, url: "tags/differences.html", title: "Différence 4SH", type: "popup"},
	{text: "Société", weight: 9, url: "tags/societe.html", title: "La société", type: "popup"},
	{text: "Equipe", weight: 5, url: "tags/equipe.html", title: "L'équipe", type: "popup"},
	{text: "Syntys", weight: 8, url: "tags/syntys.html", title: "Syntys", type: "popup"},
	{text: "Localisation", weight: 5, url: "", title: "Localisation", type: "popup"},
	{text: "Contact", weight: 5, url: "contact.html", title: "Contact"},
	{text: "R&D", weight: 1, url: "tags/r_d.html", title: "R&D", type: "popup"}
];

$(document).ready(function() {
	$("#tag-cloud").jQCloud(word_list,
	 function () {
		 $(".popup").fancybox({
			 'width'			: 850,
			 'height'			: 550,
			 'autoScale'		: true,
			 'transitionIn'		: 'fade',
			 'transitionOut'	: 'fade',
			 'type'				: 'iframe',
			 'overlayColor' : '#f5f4f2'
		 });
	 }
	);
});