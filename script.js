window.onload = function() {
    // variables
    const contenedor = document.getElementById('contenedor');
    const botones = document.getElementById('botones');
    const botonPrincipal = document.getElementById('botonPrincipal');
    const mensaje = document.getElementById('mensaje');
    const direccionBarco = document.getElementById('direccionBarco');
    const mensajeBarco = document.getElementById('mensajeBarco');
};
  // variables del programa
let jugadorRojo;
let jugadorAmarillo;

let turno = 0;


// empezar partida
function empezar(){
    let tamanio = 10;
    turno = 0;
    jugadorRojo = new Jugador("rojo", tamanio);
    jugadorRojo.mostrarTablero();
    jugadorRojo.cambiarModo(); // lo pongo en modo colocar
    direccionBarco.innerHTML = "Horizontal";
    
    botones.removeChild(this.botonPrincipal);
}
// objeto jugador
function Jugador(color, tamanio) {
    this.color = color;
    this.tablero = new Tablero(color, tamanio);
    this.modoColocar = false; // false -> jugando  true -> colocar
    this.hundidos = 0;

    // barcos
    this.botonRotar = null;
    this.direccion = "Horizontal";

    //métodos
    this.mostrarTablero = function(){
        this.tablero.mostrarTablero();
    }
    
    this.cambiarModo = function(){
        this.modoColocar =!this.modoColocar;
        if(!this.modoColocar){
            console.log("Modo jugando");
            if (this.botonRotar) {
                botones.removeChild(this.botonRotar);
                this.botonRotar = null; // Restablecer la referencia
            }

        }else{
            console.log("Modo colocar");
            this.botonRotar = document.createElement('button');
            this.botonRotar.textContent = "Rotar";
            this.botonRotar.addEventListener('click', this.rotarBarco.bind(this)); 
            botones.appendChild(this.botonRotar);
        }

    }

    this.getModo = function(){
        return this.modoColocar;
    }

    this.rotarBarco = function() {
        // Obtener el barco que se está colocando
        let barcoActual = this.tablero.barcos[this.tablero.barcosColocados];

        // Verificar si el barcoActual está definido y si se ha empezado a colocar para permitir rotar
        if (barcoActual && barcoActual.length > 1 && barcoActual[1].length > 1) {
            mensaje.innerHTML = "<h3>No se puede rotar mientras se está colocando un barco, excepto en la primera celda.</h3>";
            return;
        }
        // Cambiar dirección y limpiar mensaje si todo sale bien
        if (this.direccion === "Horizontal") {
            this.direccion = "Vertical";
            direccionBarco.innerHTML = this.direccion;
            mensaje.innerHTML = "";
        } else {
            this.direccion = "Horizontal";
            direccionBarco.innerHTML = this.direccion;
            mensaje.innerHTML = "";
        }
        console.log(this.direccion);
    }

    this.colocarBarco = function(i,j) {
        this.tablero.pintarBarco(i,j, this.direccion);
    }

    this.disparar = function(i, j, receptor) {
        let resultado = receptor.recibirDisparo(i, j);
        console.log(resultado);
        turno++;

        if (resultado === "victoria"){
            victoria(this);
        } else {
            let celdaAtacante = this.tablero.tablero[i][j]; // La celda en el tablero del que dispara
            if (resultado === "impacto") {
                celdaAtacante.classList.add('impacto');
            } else {
                celdaAtacante.classList.add('fallo');
            }
        }
    
       

    };
    this.recibirDisparo = function(i, j) {
        let impacto = false;
    
        for (let barco of this.tablero.barcos) {
            let posiciones = barco[1]; // Acceder correctamente a la lista de posiciones
    
            for (let n = 0;n < posiciones.length; n++) {
                let [barcoI, barcoJ] = posiciones[n];
    
                if (barcoI === i && barcoJ === j) { 
                    mensaje.innerHTML = "¡Tocado!";
                    impacto = true;
    
                    // a tocar por saco la posición alcanzada
                    posiciones.splice(n, 1);
    
                    if (posiciones.length === 0) { // Si ya no quedan posiciones, hundido
                        console.log("¡Hundido!");
                        mensaje.innerHTML = "¡Hundido!";
                        this.hundidos++;
                        if(this.hundidos === this.tablero.barcos.length) {
                            return "victoria";                     
                        }
                    }
    
                    return "impacto"; 
                }
            }
        }

        mensaje.innerHTML = "Agua";
        return "fallo";
    };
    
    
}

// objeto tablero
function Tablero(color, tamanio) {
this.color = color;
this.tamanio = tamanio;
this.tablero = [];

// variables de los barcos (el indice 0 es la length del barco)
this.barcos = [[4],[2],[3],[2],[3],[2]];
this.barcosColocados = 0;

// pintar el tablero
this.pintarBarco = function(i, j, direccion) {
    if (this.barcosColocados >= this.barcos.length) {
        console.log("Todos los barcos han sido colocados.");
        return;
    }

    // Comprobar si la casilla ya tiene un barco
    if (this.tablero[i][j].classList.contains('barco')) {
        mensaje.innerHTML = "<h3>No se puede colocar un barco sobre otro.</h3>";
        return;
    }

    // Comprobar si es la primera celda del barco
    if (this.barcos[this.barcosColocados].length === 1) {
        this.barcos[this.barcosColocados].push([]); 
    }

    // Verificar si la colocación es válida según la dirección
    let barcoActual = this.barcos[this.barcosColocados][1];
    if (barcoActual.length > 0) {
        let esValida = false;
        for (let [ultimaI, ultimaJ] of barcoActual) {
            if (direccion === "Horizontal" && (i === ultimaI + 1 || i === ultimaI - 1) && j === ultimaJ) {
                esValida = true;
                break;
            }
            if (direccion === "Vertical" && (j === ultimaJ + 1 || j === ultimaJ - 1) && i === ultimaI) {
                esValida = true;
                break;
            }
        }
        if (!esValida) {
            mensaje.innerHTML = "<h3>El barco solo puede colocarse en una posición contigua válida.</h3>";
            return false;
        }
    }

    this.barcos[this.barcosColocados][1].push([i, j]);
    this.tablero[i][j].classList.add('barco');
    // Limpiar mensaje si todo sale bien
    mensaje.innerHTML = "";

    // Comprobar si el barco está completamente colocado
    if (this.barcos[this.barcosColocados][1].length === this.barcos[this.barcosColocados][0]) {
        this.barcosColocados++; 
        
        if(this.barcosColocados >= this.barcos.length){ // TODO COLOCAO'
            let botonSiguiente = document.createElement("button");
            botonSiguiente.textContent = "Siguiente fase";

            /////////////////////////////////////////////////// FASE DE DISPAROS //////////////////////////////////
            botonSiguiente.addEventListener("click", function (){
                
                jugadorRojo.cambiarModo();
                jugadorAmarillo = new Jugador('amarillo', tamanio);
                jugadorAmarillo.mostrarTablero();
                turno++;

                botones.removeChild(botonSiguiente);
            });
            botones.appendChild(botonSiguiente);

            // Verifica si el botón existe antes de intentar eliminarlo
            if (jugadorRojo.botonRotar) {
                botones.removeChild(jugadorRojo.botonRotar);
                jugadorRojo.botonRotar = null; // Evitar referencias colgantes
            }
        }
    }

    mensajeBarco.innerHTML = 
        this.barcosColocados < this.barcos.length 
        ? `Colocando barco de ${this.barcos[this.barcosColocados][0]} posiciones` 
        : "Todos los barcos han sido colocados.";
};


// inicializar tablero
this.inicializarTablero = function() {
    for (let i = 0; i < this.tamanio; i++) {
        this.tablero[i] = [];
        for (let j = 0; j < this.tamanio; j++) {
            let celda = document.createElement('div');
            celda.className = 'celda';
            this.tablero[i][j] = celda;
        }
    }
};

// devolver tablero
this.mostrarTablero = function() {
    contenedor.innerHTML = ''; // limpio lo que haya antes
    const tabla = document.createElement('table'); 

    for (let i = 0; i < this.tamanio; i++) {
        let fila = document.createElement("tr");
        for (let j = 0; j < this.tamanio; j++) {
            let celda = this.tablero[i][j];
            let casilla = document.createElement('td');
            casilla.appendChild(celda);

            casilla.dataset.i = i; // yo mismo me siendo anonadado de que esto sea posible
            casilla.dataset.j = j;

            casilla.addEventListener('click', function(){
                devolverPosicion(i, j);
            });


            casilla.classList.add('celda');

            fila.appendChild(casilla);
        }
        tabla.appendChild(fila);
    }
    contenedor.appendChild(tabla);
};

this.getBarcos = function() { 
    return this.barcos;
}

this.inicializarTablero();

}

function devolverPosicion(i, j) {
console.log("Casilla seleccionada: ", i, j);
console.log(turno);
if(turno <= 0) {
    if(jugadorRojo.getModo() === true){ // aquí el tipo está en modo bob el constructor 
        jugadorRojo.colocarBarco(i,j);
    } 

} else {
    jugadorAmarillo.disparar(i,j, jugadorRojo);
}
}
    /* Cada turno se evaluará si se ha ganao' o todavía no */ 
function victoria(jugador) {
    mensaje.innerHTML = ('Ha ganado el jugador ' + jugador.color);
    contenedor.innerHTML ="";
    let mejor = mejorPuntuacion(turno);
    contenedor.innerHTML ="<br> A NECESITADO: "+turno+" turnos. <br> Actualmente el mejor resultado fueron: "+mejor+" turnos";

    
}


    // lo de las cookies que falta
    function mejorPuntuacion(puntuacion) {
        let mejor = getCookie("mejor");
        
        if (mejor === null) {
            mejor = puntuacion;
        } else {
            mejor = parseInt(mejor);
            if (puntuacion < mejor) {
                mejor = puntuacion;
            }
        }
            document.cookie = `mejor=${mejor}`;
    
        return mejor;
    }
    
    

function getCookie(nombre){
    let cookies = document.cookie.split(";");
    for(let cookie of cookies){
        let [name, value] = cookie.split("=");
        if(name.trim() === nombre){
            return value;
        }
    }
    return null;
}