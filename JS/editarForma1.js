const btnBuscar = document.querySelector('.btnBuscar');
const btnEditar = document.querySelector('.btnEditar');
const formulario = document.querySelector("fieldset");
let inputDni = document.querySelector('#DNI');
const txtDni = document.querySelector('.textDni');


let inputNombre = document.createElement('input');  
let inputApellido = document.createElement('input');  
let inputNacimiento = document.createElement('input');  
let inputNacionalidad = document.createElement('input');

const labelNombre = document.createElement('label');
const labelApellido = document.createElement('label');
const labelNacimiento = document.createElement('label');
const labelNacionalidad = document.createElement('label');

const persona = {
    nombre: "",
    apellido: "",
    nacimiento: "",
    nacionalidad: "",
    dni: "",
    id: ""
}

document.addEventListener('DOMContentLoaded', ()=>{
    conectarDB();

    if(window.indexedDB.open('Registros-Personas', 1)){
        btnBuscar.addEventListener('click', buscarRegistro);
        btnEditar.addEventListener('click', subirRegistro);
    } 
})

let db;

function conectarDB(){
    const solicitud = window.indexedDB.open('Registros-Personas', 1);

    solicitud.onerror = function(){
        console.log('hubo un error al conectar la DB..');
    }

    solicitud.onsuccess = function(){
        db = solicitud.result;
    }
}

function buscarRegistro(e){
    e.preventDefault();

    const ident = document.querySelector('#DNI').value;

    if(ident !== ""){
        
        const transaccion = db.transaction(["Registros"], "readonly");
        const almacen = transaccion.objectStore("Registros");

        const puntero = almacen.openCursor();

        puntero.onsuccess = function(e){
            const puntero = e.target.result;
                
            if(puntero){
                const{nombre, apellido, nacimiento, nacionalidad, dni, id} = puntero.value;

                if(ident === puntero.value.dni){
                    persona.nombre = nombre;
                    persona.apellido = apellido;
                    persona.nacimiento = nacimiento;
                    persona.nacionalidad = nacionalidad;
                    persona.dni = dni;
                    persona.id = id;

                    mostrarRegistro(persona);
                }
                puntero.continue();
            }
        }
    }else{
        alert("ingresa la informacion requerida")
    }
}

function mostrarRegistro(persona){
    const {apellido, nombre, nacimiento, nacionalidad} = persona;

    txtDni.textContent = "dni";
    labelNombre.textContent = "nombre";
    labelApellido.textContent = "apellido";
    labelNacimiento.textContent = "nacimiento";
    labelNacionalidad.textContent = "nacionalidad";

    inputApellido.value = apellido;
    inputNombre.value= nombre;
    inputNacimiento.value= nacimiento;
    inputNacionalidad.value= nacionalidad;

    formulario.appendChild(labelNombre);
    formulario.appendChild(inputNombre);
    formulario.appendChild(labelApellido)
    formulario.appendChild(inputApellido)
    formulario.appendChild(labelNacimiento)
    formulario.appendChild(inputNacimiento)
    formulario.appendChild(labelNacionalidad)
    formulario.appendChild(inputNacionalidad)

    console.log(persona);
}

function subirRegistro(e){
    e.preventDefault();

    if(inputNombre.value == "" || inputApellido.value =="" || inputNacimiento.value =="" || inputNacionalidad.value == ""){
        alert("busca un registro")
    }else{
        persona.nombre = inputNombre.value;
        persona.apellido = inputApellido.value;
        persona.nacimiento = inputNacimiento.value;
        persona.nacionalidad = inputNacionalidad.value;
        persona.dni = inputDni.value;

        const transaccion = db.transaction(["Registros"], "readwrite");
        const almacen = transaccion.objectStore("Registros")
                
        almacen.put(persona);

        transaccion.onerror = function(){
            alert('hubo un error al agregar el nuevo empleado..');
        }

        transaccion.oncomplete = function(){
            alert("se edito con exito");
        }

        limpiarInputs()
        limpiarHTML()
    }
}

function limpiarInputs(){
    inputDni.value = "";
    inputNombre.value = "";
    inputApellido.value = "";
    inputNacimiento.value = "";
    inputNacionalidad.value = "";
    inputDni.value = "";
}

function limpiarHTML(){
    txtDni.textContent = "buscar por dni";

    formulario.removeChild(inputNombre);
    formulario.removeChild(inputApellido);
    formulario.removeChild(inputNacimiento);
    formulario.removeChild(inputNacionalidad);
    formulario.removeChild(labelNombre);
    formulario.removeChild(labelApellido);
    formulario.removeChild(labelNacimiento);
    formulario.removeChild(labelNacionalidad);
}