document.addEventListener('DOMContentLoaded', iniciarAPP)

function iniciarAPP(){
    // creo la DB
    crearDB();

    const form = document.querySelector('.formulario')
    form.addEventListener('submit', cargarCivil)
}

let db;

function crearDB(){
    
   const solicitud = indexedDB.open('Registros-Personas');

   solicitud.onerror = function(evento){
        alert("Ups! Tenemos un ERROR:" + evento.code + "/" + evento.message);
    }
   solicitud.onsuccess = function(evento){
        db = evento.target.result;
    }
   solicitud.onupgradeneeded = function(evento){
        const baseDatos = evento.target.result;
        const almacen = baseDatos.createObjectStore('Registros', {keyPath: "id"});
        almacen.createIndex('Lista', 'nombre', {unique: false});
    }
}

function cargarCivil(e){

    e.preventDefault();

    const nombre = document.querySelector("#Nombre").value;
    const apellido = document.querySelector("#Apellido").value;
    const nacimiento = document.querySelector("#Fecha").value;
    const nacionalidad = document.querySelector("#Nacionalidad").value;
    const dni = document.querySelector("#DNI").value;

    const persona={
        nombre,
        apellido,
        nacimiento,
        nacionalidad,
        dni
    }

    persona.id = Date.now();

    console.log(persona)
     
    const transaccion = db.transaction(["Registros"], "readwrite");
    const almacen = transaccion.objectStore("Registros")
    
    almacen.add(persona)

    transaccion.onerror = function(){
        alert('hubo un error al agregar el nuevo registro..');
    }

    transaccion.oncomplete = function(){
        alert("se registro con exito");
    }

    document.querySelector("#Nombre").value = "";
    document.querySelector("#Apellido").value = "";
    document.querySelector("#Fecha").value = "";
    document.querySelector("#Nacionalidad").value = "";
    document.querySelector("#DNI").value = "";
}




