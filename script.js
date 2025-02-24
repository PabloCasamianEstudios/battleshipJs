window.onload = function() {
    // variables
    const contenedor = document.getElementById('contenedor');
    const botones = document.getElementById('botones');
    const botonPrincipal = document.getElementById('botonPrincipal');


};

// variables del programa
let jugadorRojo;
let turno = 0;


// empezar partida
function empezar(){
    let tamanio = 10;
    turno = 0;
    jugadorRojo = new Jugador("rojo", tamanio);
    jugadorRojo.mostrarTablero();
    jugadorRojo.cambiarModo(); // lo pongo en modo colocar

    botones.removeChild(this.botonPrincipal);
}

// objeto jugador
    function Jugador(color, tamanio) {
        this.color = color;
        this.tablero = new Tablero(color, tamanio);
        this.modoColocar = false; // false -> jugando  true -> colocar

        // barcos
        this.botonRotar = null;
        this.barcos = [];
        let direccion = "horizontal";


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
            if (this.direccion === "horizontal") {
                this.direccion = "vertical";
            } else {
                this.direccion = "horizontal";
            }
            console.log(this.direccion);
        }

        this.colocarBarco = function() { 

        }


    }

// objeto tablero
function Tablero(color, tamanio) {
    this.color = color;
    this.tamanio = tamanio;
    this.tablero = [];
    this.barcos = [];

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

    this.inicializarTablero();

}

function devolverPosicion(i, j) {
    console.log("Casilla seleccionada: ", i, j);
    if(turno < 1) {
        if(jugadorRojo.getModo() === true){ // aquí el tipo está en modo bob el constructor 

        }

    } 
}