const nombreInput = document.querySelector("#Nombre");
const apellidoInput = document.querySelector("#Apellido");
const nacimientoInput = document.querySelector("#Fecha");
const nacionalidadInput = document.querySelector("#Nacionalidad");
const dniInput = document.querySelector("#DNI");

document.addEventListener('DOMContentLoaded', ()=>{
    conectarDB();

    //aca se pasa el id del cliente
    const parametrosURL = new URLSearchParams(window.location.search);
    const a = parametrosURL.get('id');
    if(a) {
        setTimeout( () => {
            desplegarInfo(a);
        }, 100);
    }
    const btnEditar = document.querySelector('.btnSubmit');
    btnEditar.addEventListener('click', subirEdicion)
})
let db;
let idRegistro;
const persona = {
    nombre: "",
    apellido: "",
    nacimiento: "",
    nacionalidad: "",
    dni: "",
    id: "",
}

function conectarDB(){
    const solicitud = window.indexedDB.open('Registros-Personas', 1);

    solicitud.onerror = function(){
        console.log('hubo un error al conectar la DB..');
    }

    solicitud.onsuccess = function(){
        db = solicitud.result;
    }
}

function desplegarInfo(id){ 
    console.log("desplegando...");
    console.log(id)
    const transaccion = db.transaction(["Registros"], "readonly");
    const almacen = transaccion.objectStore("Registros");

    const puntero = almacen.openCursor();

    puntero.onerror = function(){
        console.log("hubo un error");
    }

    puntero.onsuccess = function(e){
        const puntero = e.target.result;
        if(puntero){
            if(puntero.value.id == id){
                llenarForm(puntero.value);
            }
            puntero.continue();
        } 
    
    }

}

function llenarForm(pers){
    const{nombre, apellido, nacimiento, nacionalidad, dni, id} = pers;

    nombreInput.value = nombre;
    apellidoInput.value = apellido;
    nacimientoInput.value = nacimiento;
    nacionalidadInput.value = nacionalidad;
    dniInput.value = dni;
    idRegistro = id;
    console.log(idRegistro);
}

function subirEdicion(e){
    e.preventDefault();

    if(nombreInput.value == "" || apellidoInput.value =="" || nacimientoInput.value =="" || nacionalidadInput.value == "" || dniInput.value == ""){
        alert("complete todos los campos")
    }else{
        persona.nombre = nombreInput.value;
        persona.apellido = apellidoInput.value;
        persona.nacimiento = nacimientoInput.value;
        persona.nacionalidad = nacionalidadInput.value;
        persona.dni = dniInput.value;
        persona.id = idRegistro;

        const transaccion = db.transaction(["Registros"], "readwrite");
        const almacen = transaccion.objectStore("Registros")
                
        almacen.put(persona);

        transaccion.onerror = function(){
            alert('hubo un error al agregar el nuevo empleado..');
        }

        transaccion.oncomplete = function(){
            alert("se edito con exito");
        }

        window.location.href = "index.html";
        limpiarHTML();
    }
}

function limpiarHTML(){
    nombreInput.value = "";
    apellidoInput.value = "";
    nacimientoInput.value = "";
    nacionalidadInput.value = "";
    dniInput.value = "";
}