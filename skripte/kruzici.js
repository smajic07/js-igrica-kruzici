const canvas = document.getElementById('canvas');
const brojOsvojenihBodova = document.getElementById('brojOsvojenihBodova');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 570;

function iscrtajPocetniTekst() {
	ctx.fillStyle = 'white';
	ctx.fillRect(canvas.width/2 - 200, canvas.height/2 - 125, 400, 250);
	ctx.fillStyle = 'black';
	ctx.font = '48px serif';
	ctx.fillText('Izaberite težinu', canvas.width/2 - 150, canvas.height/2);
}

// Globalne varijable
var canvasPosition;
var igraGotova;
var bodovi;
var gameFrame;
var tajmerUbrzanja;
var pobjeda;
var tezina;
// Glavne varijable
var igrac; // glavni kružić
var nizKruzica; // niz sporednih kružića
var i = 150; // pomoćna varijabla za pravljenje animacije za kraj igrice

// Audio elementi
var kruzicPop1 = document.createElement('audio');
kruzicPop1.setAttribute('src', 'zvukovi/pop1.mp3');
var kruzicPop2 = document.createElement('audio');
kruzicPop2.setAttribute('src', 'zvukovi/pop2.mp3');
var izgubljena = document.createElement('audio');
izgubljena.setAttribute('src', 'zvukovi/izgubljena.mp3');
var pobjeda1 = document.createElement('audio');
pobjeda1.setAttribute('src', 'zvukovi/pobjeda1.wav');
var pobjeda2 = document.createElement('audio');
pobjeda2.setAttribute('src', 'zvukovi/pobjeda2.wav');
var upozorenje = document.createElement('audio');
upozorenje.setAttribute('src', 'zvukovi/upozorenje.wav');

// Podaci o mišu:
const mis = {
    x: canvas.width/2, // x koordinata miša u platnu canvasa
    y: canvas.height/2, // y koordinata miša u platnu canvasa
    click: false
}

// Event listener za čitav prozor
window.addEventListener('mousemove', function(event){ // ažuriranje koordinata miša u platnu canvasa u skladu sa kretanjem istog
   
    canvasPosition = canvas.getBoundingClientRect();
    mis.click = true;    
    mis.x = event.x - canvasPosition.left; // ažuriranje x koordinate miša u platnu canvasa
    mis.y = event.y - canvasPosition.top; // ažuriranje y koordinate miša u platnu canvasa

});

// Glavni kružić
class GlavniKruzic {

    constructor() {
     
        this.x = canvas.width/2; // centriramo glavni kružić po x osi
        this.y = canvas.height/2; // centriramo glavni kružić po y osi

        if(canvas.width < 576){
	        this.radijus = 5 + Math.random() * 5; // glavni kružić na početku ima radijus od 5 do 10
        }
        else{
	        this.radijus = 10 + Math.random() * 10; // glavni kružić na početku ima radijus od 10 do 20
        }
    
    }

    azuriraj() {

        const dx = this.x - mis.x;
        const dy = this.y - mis.y;

        if (mis.x != this.x) {
            this.x -= dx/50; // usporavamo kretanje glavnog kružića po x osi
        }
        if (mis.y != this.y) {
            this.y -= dy/50; // usporavamo kretanje glavnog kružića po y osi
        }
        if (this.y > canvas.height) {
        	this.y = canvas.height; // ako igrač mišem ode ispod platna
        }
        if (this.x < 0) {
			this.x = 0; // ako igrač mišem ode lijevo od platna	
        }
        if (this.y < 0) {
        	this.y = 0; // ako igrač mišem ode iznad platna
        }
        if (this.x > canvas.width) {
        	this.x = canvas.width; // ako igrač mišem ode desno od platna
        }

    }

    crtaj() { // fja za iscrtavanje glavnog kružića

        ctx.fillStyle = 'lime';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radijus, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

    }

}

function stepen_u_radijane(stepen){
  var pi = Math.PI;
  return stepen * (pi/180);
}

// Sporedni kružići
class Kruzic {

    postaviAtribute(pocetnaPozicija) {

 		// poluprečnik sporednog kružića: (+5/-5) - Lagano, (+6/-4) - Normalno, (+7/-3) - Tesko; u odnosu na trenutni radijus glavnog kružića
        this.radijus = (igrac.radijus - 5) + Math.random() * 10 + tezina; 
        // brzina sporednog kružića je u opsegu: (1, 3) - Lagano, (2, 4) - Normalno, (3, 5) - Tesko
        this.brzina = Math.random() * 2 + 1 + tezina; 
        // udaljenost centra sporednog kružića od centra glavnog kružića this.udaljenost; 
		this.boja = "rgba(" + Math.random()*255 + ", " + Math.random()*255 + ", " + Math.random()*255 + ")";
		this.dvaSmjera = parseInt(Math.random()*2); // 0 - lijevo/dole, 1 - desno/gore

    	if (pocetnaPozicija === 0) { // kružić generišemo iznad platna
	        this.x = this.radijus + Math.random() * (canvas.width - 2 * this.radijus);
	        this.y = -(this.radijus + 100);
    	} else if (pocetnaPozicija === 1) { // kružić generišemo desno od platna
	        this.x = canvas.width + this.radijus + 100;
	        this.y = this.radijus + Math.random() * (canvas.height - 2 * this.radijus);
    	} else if (pocetnaPozicija === 2) { // kružić generišemo ispod platna
	        this.x = this.radijus + Math.random() * (canvas.width - 2 * this.radijus);
	        this.y = canvas.height + this.radijus + 100;
    	} else { // kružić generišemo lijevo od platna
	        this.x = -(this.radijus + 100);
	        this.y = this.radijus + Math.random() * (canvas.height - 2 * this.radijus);
    	}

	    this.ugao = 30 + parseInt(Math.random()*61); // 30-90, te se okreće u ovisnosti od početne pozicije

    }

    constructor(tip) {

    	this.pocetnaPozicija = parseInt(Math.random()*4);
    	this.postaviAtribute(this.pocetnaPozicija);

    	if (tip === "Specijalan") {
    		this.specijalan = true;
    	}

    }

    uduplajBrzinu() {

    	this.brzina *= 2;

    }

    azuriraj() {

    	{
	    	let dy = this.brzina;
	    	let alfa = stepen_u_radijane(this.ugao);
	    	let c = dy/Math.sin(alfa);
	    	let dx = Math.sqrt(c*c - dy*dy);

        	// this.dvaSmjera: 0 - lijevo/dole, 1 - desno/gore
	    	if (this.pocetnaPozicija === 0) { // kružić se kreće prema dole
	        	if(this.dvaSmjera === 0) this.x -= dx;
	        	else this.x += dx;
				this.y += dy;
	    	} else if (this.pocetnaPozicija === 1) { // kružić se kreće prema lijevo
	        	if(this.dvaSmjera === 0) this.y += dx;
	        	else this.y -= dx;
				this.x -= dy;
	    	} else if (this.pocetnaPozicija === 2) { // kružić se kreće prema gore
	        	if(this.dvaSmjera === 0) this.x -= dx;
	        	else this.x += dx;
				this.y -= dy;
	    	} else { // kružić se kreće prema desno
	        	if(this.dvaSmjera === 0) this.y += dx;
	        	else this.y -= dx;
				this.x += dy;
	    	}
    	}

        const dx = this.x - igrac.x;
        const dy = this.y - igrac.y;
        // ažuriranje udaljenosti centra sporednog kružića pd glavnog
        this.udaljenost = Math.sqrt(dx * dx + dy * dy); 
    }

    crtaj() {

        ctx.fillStyle = this.boja;

        if (this.specijalan) { // posebna priprema boje za specijalni kružić
	        ctx.fillStyle = 'red';
	        let my_gradient = ctx.createLinearGradient(this.x-this.radijus, this.y, this.x+this.radijus, this.y);
			my_gradient.addColorStop(0, "red");
			my_gradient.addColorStop(1, "lime");
			ctx.fillStyle = my_gradient;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radijus, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

    }

}

function promijeniSituaciju() {

	let slucaj = parseInt(Math.random()*4);

	if (slucaj === 0) { // brzina kretanja svih sporednih kružića je 2x
		tajmerUbrzanja = 500 + parseInt(Math.random()*500); // ubrzanje traje od 500 do 1000 frejmova
		for(let i=0; i< nizKruzica.length; i++) {
			nizKruzica[i].uduplajBrzinu();
		}
	} else if (slucaj === 1) {
		igrac.radijus *= 2;
	} else if (slucaj === 2) {
		// ne želimo da nam ikad radijus igrača bude ispod 5, u tom slučaju se može desiti da neki od sporednih kružića dobije negativan radijus
		if(igrac.radijus>10) igrac.radijus /= 2.;
	} else {
		for(let i=0; i<nizKruzica.length; i++) {
			let smjer = parseInt(Math.random()*4);
			while (smjer == nizKruzica[i].pocetnaPozicija) {
				smjer = parseInt(Math.random()*4);
			}
			nizKruzica[i].pocetnaPozicija = smjer;
		}
	}

}

function isrctajAzurirajProvjeriSudare() {

	let polaznaVelicina = nizKruzica.length;
	let specijalan;

    for (let i = 0; i < polaznaVelicina; i++) {
        nizKruzica[i].crtaj();
        nizKruzica[i].azuriraj();
        if (!igraGotova) {
	        if ((nizKruzica[i].pocetnaPozicija === 0 && (nizKruzica[i].x > canvas.width + nizKruzica[i].radijus || nizKruzica[i].y > canvas.height + nizKruzica[i].radijus || nizKruzica[i].x < -nizKruzica[i].radijus)) || // ako posmatrani kružić pređe desni, donji ili lijevi zid 
	            (nizKruzica[i].pocetnaPozicija === 1 && (nizKruzica[i].y > canvas.height + nizKruzica[i].radijus || nizKruzica[i].x < -nizKruzica[i].radijus || nizKruzica[i].y < -nizKruzica[i].radijus)) || // ako posmatrani kružić pređe donji, lijevi ili gornji zid
	            (nizKruzica[i].pocetnaPozicija === 2 && (nizKruzica[i].x < -nizKruzica[i].radijus || nizKruzica[i].y < -nizKruzica[i].radijus || nizKruzica[i].x > canvas.width + nizKruzica[i].radijus)) || // ako posmatrani kružić pređe lijevi, gornji ili desni zid
	            (nizKruzica[i].pocetnaPozicija === 3 && (nizKruzica[i].y < -nizKruzica[i].radijus || nizKruzica[i].x > canvas.width + nizKruzica[i].radijus || nizKruzica[i].y > canvas.height + nizKruzica[i].radijus))) { // ako posmatrani kružić pređe gornji, desni ili donji zid
	            nizKruzica.splice(i, 1);
	            i--;
	            polaznaVelicina--;
			    nizKruzica.push(new Kruzic());
			    if (tajmerUbrzanja > 0) {
		    		nizKruzica[nizKruzica.length-1].uduplajBrzinu();
		    	}
	        } 
	        else if (nizKruzica[i].udaljenost <= nizKruzica[i].radijus + igrac.radijus) { // ako glavni kružić dodirne neki sporedni kružić
	        	if (!nizKruzica[i].specijalan && nizKruzica[i].radijus > igrac.radijus) { // ako je glavni kružić dodio veći kružić od sebe 
	        		izgubljena.play();
					igraGotova = true;
					continue; // treba sve iscrtat iako je kraj igrice
				} // ovo ispod se izvršava ako je glavni kružić dodio manji ili jednak kružić od sebe
				if (Math.random() < 0.5) {
					kruzicPop1.play();
				} else {
					kruzicPop2.play();
				}
				if (nizKruzica[i].specijalan) {
		        	specijalan = true;
		        }
		        bodovi++;
		        igrac.radijus += nizKruzica[i].radijus * (0.07 - tezina * 0.02); // glavni kružić raste za: 7% - Lagano, 5% - Normalno, 3% - Tesko; u odnosu na veličinu "pojedenog" sporednog kružića
		        nizKruzica.splice(i, 1);
		        i--;
	        	polaznaVelicina--;
			    nizKruzica.push(new Kruzic());
			    if(tajmerUbrzanja > 0) {
		    		nizKruzica[nizKruzica.length-1].uduplajBrzinu();
		    	}
        	}
        }
    }

    if (specijalan) {
		upozorenje.play();
    	promijeniSituaciju();
    }

}

function iscrtajKraj(){

	if (i === 0) {
		ctx.fillStyle = 'white';
    	ctx.fillRect(canvas.width/2 - 150, canvas.height/2 - 100, 300, 200);
 		ctx.font = '32px serif';
 		if (pobjeda) {
    		ctx.fillStyle = '#008b27';
 			ctx.fillText('Pobijedili ste!', canvas.width/2 - 85, canvas.height/2);
			document.getElementById("linkSadrzajCanvasa").style.backgroundColor = "lime";
    	}
    	else {
    		ctx.fillStyle = '#d71616';
 			ctx.fillText('Izgubili ste!', canvas.width/2 - 75, canvas.height/2);
			document.getElementById("linkSadrzajCanvasa").style.backgroundColor = "red";
    	}

    	cancelAnimationFrame(iscrtajKraj);

		document.getElementById("linkSadrzajCanvasa").style.border = "solid 2px white";
		document.getElementById("linkSadrzajCanvasa").disabled = false;
		document.getElementById("linkUpute").disabled = false;
		document.getElementById("linkInfoProjekta").disabled = false;
	}
    else {
    	ctx.fillRect(0, 0, canvas.width/i, canvas.height/i);
	    i--;
		requestAnimationFrame(iscrtajKraj);
	}

}

// Funkcija koja kada se pozove poziva requestAnimationFrame(animate) sve dok se ne desi kraj igre
function animate() {

    if (igraGotova) {
    	pobjeda = false;
		i = 150;
		cancelAnimationFrame(animate);
        ctx.fillStyle = '#d71616';
		requestAnimationFrame(iscrtajKraj);
    }
    else if (igrac.radijus > canvas.height/2) { // pobjeda
    	pobjeda = true;
		i = 150;
        if (Math.random() < 0.5) {
			pobjeda1.play();
		}
		else {
			pobjeda2.play();
		}
		cancelAnimationFrame(animate);
        ctx.fillStyle = '#008b27';
		requestAnimationFrame(iscrtajKraj);
    }
    else {
    	//console.log("Frejm broj " + gameFrame);
    	if (tezina === 0) { // za težinu Lagano
    		if (gameFrame % 1000 === 0) { // povremeno generisani kružić
			    nizKruzica.push(new Kruzic("A"));
			    if (tajmerUbrzanja > 0) {
		    		nizKruzica[nizKruzica.length-1].uduplajBrzinu();
		    	}
    		}
    	}
    	else if (tezina === 1) { // za težinu Normalno
	    	if (gameFrame % 750 === 0) { // povremeno generisani kružić
			    nizKruzica.push(new Kruzic("A"));
			    if (tajmerUbrzanja > 0) {
		    		nizKruzica[nizKruzica.length-1].uduplajBrzinu();
		    	}
	    	}
	    }
    	else if (tezina === 2) { // za težinu Tesko
	    	if (gameFrame % 500 === 0) { // povremeno generisani kružić
			    nizKruzica.push(new Kruzic("A"));
			    if (tajmerUbrzanja > 0) {
		    		nizKruzica[nizKruzica.length-1].uduplajBrzinu();
		    	}
	    	}
	    }

    	if (gameFrame % 2000 === 0) { // generišemo specijalni kružić svakih 2000 frejmova
		    nizKruzica.push(new Kruzic("Specijalan"));
    	}

	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    isrctajAzurirajProvjeriSudare();
	    if (igraGotova) {
	    	pobjeda = false;
			i = 150;
			cancelAnimationFrame(animate);
	        ctx.fillStyle = '#d71616';
			requestAnimationFrame(iscrtajKraj);
	    }
	    igrac.azuriraj();
	    igrac.crtaj();

	    brojOsvojenihBodova.innerText = "Broj osvojenih bodova: " + bodovi;

	    gameFrame++; // povećavamo broj frejmova iscrtanih do sada
	    if (tajmerUbrzanja > 0) {
	    	tajmerUbrzanja--;
	    }
	    requestAnimationFrame(animate); // zahtijevamo iscrtavanje sljedećeg frejma
	}

}

function ustimajSveZaVelicinu() {

	canvasPosition = canvas.getBoundingClientRect();

	if (window.innerWidth < 450) {
		canvas.width = 350;
		canvas.height = 300;
    }
    else if (window.innerWidth < 576) {
		canvas.width = 450;
		canvas.height = 300;
    }
    else if (window.innerWidth < 768) {
		canvas.width = 556;
		canvas.height = 400;
    }
    else if (window.innerWidth < 992) {
		canvas.width = 748;
		canvas.height = 500;
    }
    else {
		canvas.width = 900;
		canvas.height = 570;
    }

}

window.addEventListener('resize', function() { // ažurira veličinu canvasa u ovisnosti od veličine prozora

	ustimajSveZaVelicinu();

});

function pokreniIgru(tezina1) {

	ustimajSveZaVelicinu();

	igraGotova = false;
	bodovi = 0;
	gameFrame = 0;
	tajmerUbrzanja = 0;
	pobjeda = false;

	igrac = new GlavniKruzic();

	if (tezina1 === "Lagano") {
		tezina = 0;
		nizKruzica = [new Kruzic("A"), new Kruzic("A"), new Kruzic("A")];
	}
	else if (tezina1 === "Normalno") {
		tezina = 1;
		nizKruzica = [new Kruzic("A"), new Kruzic("A"), new Kruzic("A"), new Kruzic("A")];
	}
	else {
		tezina = 2;
		nizKruzica = [new Kruzic("A"), new Kruzic("A"), new Kruzic("A"), new Kruzic("A"), new Kruzic("A")];
	}

	document.getElementById("linkSadrzajCanvasa").style.backgroundColor = "#0d6efd";
	document.getElementById("linkSadrzajCanvasa").style.color = "white";
	document.getElementById("linkSadrzajCanvasa").style.border = "none";
	document.getElementById("linkSadrzajCanvasa").disabled = true;
	document.getElementById("linkUpute").disabled = true;
	document.getElementById("linkInfoProjekta").disabled = true;
	
    igrac.crtaj();

	$('canvas').one('mousemove', function() {
		animate();
	});

}
// Za različite težine igrice postupam po sljedećim pravilima:
// poluprečnik sporednih kružića: (+5/-5) - Lagano, (+6/-4) - Normalno, (+7/-3) - Tesko; u odnosu na trenutni radijus glavnog kružića
// brzina sporednih kružića je u opsegu: (1, 3) - Lagano, (2, 4) - Normalno, (3, 5) - Tesko
// glavni kružić raste za: (7%) - Lagano, (5%) - Normalno, (3%) - Tesko; u odnosu na veličinu "pojedenog" sporednog kružića
// povremeno generisani kružić se generiše svakih: (1000 frejmova) - Lagano, (750 frejmova) - Normalno, (500 frejmova) - Tesko
// na početku imamo 'običnih' kružića: (3) - Lagano, (4) - Normalno, (5) - Tesko