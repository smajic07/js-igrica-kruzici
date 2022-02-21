let linkSadrzajCanvasa = document.getElementById("linkSadrzajCanvasa");
let linkUpute = document.getElementById("linkUpute");
let linkInfoProjekta = document.getElementById("linkInfoProjekta");

let dobrodoslica = document.getElementById("dobrodoslica");
let upute = document.getElementById("upute");
let infoProjekta = document.getElementById("info_projekta");
let sadrzajCanvas = document.getElementById("sadrzaj_canvas");

function promijeniTemu(){

	let tema = document.getElementById("tema");
	let html = document.getElementById("html"); 

	if (tema.style.backgroundColor === "white") { // Tamna je tema
		document.getElementById("canvas").style.backgroundColor = "white";

		tema.style.backgroundColor = "black";
		tema.style.color = "white";
		tema.style.border = "solid 1px white";

		html.style.backgroundColor = "#2884b8";
		html.style.backgroundImage = "linear-gradient(315deg, #2884b8 0%, #d1bad2 74%)";
	}
	else { // Svijetla je tema
		document.getElementById("canvas").style.backgroundColor = "black";

		tema.style.backgroundColor = "white";
		tema.style.color = "black";
		tema.style.border = "solid 1px black";

		html.style.backgroundColor = "#537895";
		html.style.backgroundImage = "linear-gradient(315deg, #537895 0%, #09203f 74%)";
	}

}

function prikaziSadrzajCanvasa(){

	linkUpute.style.backgroundColor = "#0d6efd";
	linkUpute.style.color = "white";
	linkUpute.style.border = "none"

	linkInfoProjekta.style.backgroundColor = "#0d6efd";
	linkInfoProjekta.style.color = "white";
	linkInfoProjekta.style.border = "none"

	linkSadrzajCanvasa.style.backgroundColor = "gold";
	linkSadrzajCanvasa.style.color = "black";
	linkSadrzajCanvasa.style.border = "solid 2px black"

	dobrodoslica.style.display = "none";;
	upute.style.display = "none";
	infoProjekta.style.display = "none";
	sadrzajCanvas.style.display = "block";

	iscrtajPocetniTekst();

}

function prikaziUpute(){

	linkSadrzajCanvasa.style.backgroundColor = "#0d6efd";
	linkSadrzajCanvasa.style.color = "white";
	linkSadrzajCanvasa.style.border = "none"

	linkInfoProjekta.style.backgroundColor = "#0d6efd";
	linkInfoProjekta.style.color = "white";
	linkInfoProjekta.style.border = "none"

	linkUpute.style.backgroundColor = "gold";
	linkUpute.style.color = "black";
	linkUpute.style.border = "solid 2px black"

	dobrodoslica.style.display = "none";
	sadrzajCanvas.style.display = "none";
	infoProjekta.style.display = "none";
	upute.style.display = "block";

}

function prikaziInfoProjekta(){

	linkSadrzajCanvasa.style.backgroundColor = "#0d6efd";
	linkSadrzajCanvasa.style.color = "white";
	linkSadrzajCanvasa.style.border = "none"

	linkUpute.style.backgroundColor = "#0d6efd";
	linkUpute.style.color = "white";
	linkUpute.style.border = "none"

	linkInfoProjekta.style.backgroundColor = "gold";
	linkInfoProjekta.style.color = "black";
	linkInfoProjekta.style.border = "solid 2px black"

	dobrodoslica.style.display = "none";
	sadrzajCanvas.style.display = "none";
	upute.style.display = "none";
	infoProjekta.style.display = "block";

}