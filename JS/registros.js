document.addEventListener('DOMContentLoaded', ()=>{
    conectarDB();
    if(window.indexedDB.open('Registros-Personas',1)){
        mostrar();
    }
    resultado.addEventListener('click', eliminar)
})

let db;
const resultado = document.querySelector(".result");

function conectarDB(){
    const solicitud = window.indexedDB.open('Registros-Personas', 1);

    solicitud.onerror = function(){
        console.log('hubo un error al conectar la DB..');
    }

    solicitud.onsuccess = function(){
        db = solicitud.result;
    }
}

function mostrar(){
    const abrirConexion = window.indexedDB.open('Registros-Personas', 1);

    abrirConexion.onerror = function(){
        console.log('hubo un error al conectar la DB..');
    }

    abrirConexion.onsuccess = function(){
        const transaccion = db.transaction(["Registros"], "readonly");
        const almacen = transaccion.objectStore("Registros");

        // transaccion.addEventListener('complete', mostrarRegistros)

        const puntero = almacen.openCursor();

        puntero.onsuccess = function(e){
            const puntero = e.target.result;

            if(puntero){
                mostrarPersonas(puntero.value)
                puntero.continue();
            }
        }
    }

}

function mostrarPersonas(puntero){
    const{nombre, apellido, nacimiento, nacionalidad, dni, id} = puntero;

    resultado.innerHTML += `
        <div class="card">
            <li><strong>Nombre: </strong>${nombre}</li>
            <br>
            <li><strong>Apellido: </strong>${apellido}</li>
            <br>
            <li><strong>Nacimiento: </strong>${nacimiento}</li>
            <br>
            <li><strong>Nacionalidad: </strong>${nacionalidad}</li>
            <br>
            <li><strong>Dni: </strong>${dni}</li>
            <hr>
            <div class="btn el e" data-cliente="${id}">
                <p class="eliminar e" data-cliente="${id}">X</p>
            </div>
            <div  class="btn ed" >
                <a href="editarCliente2.html?id=${id}" class="editar">Editar</a>
            </div>
        </div>
    `;
}

function eliminar(e){
    if(e.target.classList.contains('e')){
        
        const confirmar = confirm("desea eliminar este cliente");

        if(confirmar){
            const key = Number(e.target.dataset.cliente);
            console.log("eliminando cliente", key)

            const transaccion = db.transaction(["Registros"], "readwrite");
            const almacen = transaccion.objectStore("Registros");

            almacen.delete(key)

            transaccion.oncomplete = function(){
                limpiarHTML()
                mostrar();
            }

            transaccion.onerror = function(){
                console.log("hubo un error")
            }
        }

    }    
}

function limpiarHTML(){
    resultado.innerHTML = "";
}