class Persona {
    constructor(id, nombre, apellido, fechaNacimiento) {
        if (this.validarId(id)) {
            this.id = id;
        } else {
            throw new Error("El ID debe ser un número válido y único.");
        }

        if (nombre) {
            this.nombre = nombre;
        } else {
            throw new Error("El nombre es obligatorio.");
        }

        if (apellido) {
            this.apellido = apellido;
        } else {
            throw new Error("El apellido es obligatorio.");
        }

        if (this.validarFechaNacimiento(fechaNacimiento)) {
            this.fechaNacimiento = this.formatFechaNacimiento(fechaNacimiento);
        } else {
            throw new Error("La fecha de nacimiento debe ser un número válido en formato AAAAMMDD.");
        }
    }

    validarId(id) {
        return typeof id === "number" && id !== null && id !== undefined && id > 0 && !isNaN(id);
    }

    validarFechaNacimiento(fechaNacimiento) {
        if (typeof fechaNacimiento !== "number" || fechaNacimiento === null || fechaNacimiento === undefined) {
            return false;
        }

        const fechaString = fechaNacimiento.toString();
        // Comprobar el formato AAAAMMDD
        return fechaString.length === 8 && !isNaN(fechaNacimiento);
    }

    formatFechaNacimiento(fechaNacimiento) {
        const fechaString = fechaNacimiento.toString();
        const año = fechaString.substring(0, 4);
        const mes = fechaString.substring(4, 6);
        const dia = fechaString.substring(6, 8);
        return `${dia}/${mes}/${año}`;
    }


}

class Extranjero extends Persona {
    constructor(id, nombre, apellido, fechaNacimiento, paisOrigen) {
        super(id, nombre, apellido, fechaNacimiento);
        if (paisOrigen !== null && paisOrigen !== undefined) {
            this.paisOrigen = paisOrigen;
        } else {
            throw new Error("El país de origen es obligatorio.");
        }
    }

    toString() {
        return super.toString() + `, País de Origen: ${this.paisOrigen}`;
    }
}

class Ciudadano extends Persona {
    constructor(id, nombre, apellido, fechaNacimiento, dni) {
        super(id, nombre, apellido, fechaNacimiento);
        if (dni !== null && dni !== undefined && dni > 0) {
            this.dni = dni;
        } else {
            throw new Error("El DNI debe ser mayor a 0.");
        }
    }

    toString() {
        return super.toString() + `, DNI: ${this.dni}`;
    }
}



// Convertir la cadena JSON en un objeto JavaScript
const jsonString = '[{"id":1,"apellido":"Serrano","nombre":"Horacio","fechaNacimiento":19840103,"dni":45876942},{"id":2,"apellido":"Casas","nombre":"Julian","fechaNacimiento":19990723,"dni":98536214},{"id":3,"apellido":"Galeano","nombre":"Julieta","fechaNacimiento":20081103,"dni":74859612},{"id":4,"apellido":"Molina","nombre":"Juana","fechaNacimiento":19681201,"paisOrigen":"Paraguay"},{"id":5,"apellido":"Barrichello","nombre":"Rubens","fechaNacimiento":19720523,"paisOrigen":"Brazil"},{"id":666,"apellido":"Hkkinen","nombre":"Mika","fechaNacimiento":19680928,"paisOrigen":"Finlandia"}]';
const personasData = JSON.parse(jsonString);

function crearInstancias(data) {
    return data.map(persona => {
        if (persona.hasOwnProperty('paisOrigen') && persona.paisOrigen !== "") {
            return new Extranjero(persona.id, persona.nombre, persona.apellido, persona.fechaNacimiento, persona.paisOrigen);
        } 
        else
        {
            return new Ciudadano(persona.id, persona.nombre, persona.apellido, persona.fechaNacimiento, persona.dni);
        }
        
    });
}



// Convertir los datos en instancias de Cliente o Empleado
const personasArray = crearInstancias(personasData);
console.log(personasArray);



// Función para crear una celda de la tabla con manejo de valores nulos
function createTableCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value != null ? value : "-";
    return cell;
}

// Función para filtrar personas según el tipo (Clientes, Empleados, Todos)
function filtrarPersonas(tipo) {
    switch (tipo) {
        case "Todos":
            return personasArray;
        case "Ciudadano":
            return personasArray.filter(persona => persona instanceof Ciudadano);
        case "Extranjero":
            return personasArray.filter(persona => persona instanceof Extranjero);
    }
}

function mostrarFormularioABM(persona) {
    formAMB.style.display = "block";
    // Llenar el formulario ABM con los datos de la persona
    document.getElementById("idInput").value = persona.id || "";
    document.getElementById("nombreInput").value = persona.nombre || "";
    document.getElementById("apellidoInput").value = persona.apellido || "";
    document.getElementById("fechaNacimientoInput").value = persona.fechaNacimiento || "";
    document.getElementById("dniInput").value = persona.dni || "";
    document.getElementById("paisOrigenInput").value = persona.paisOrigen || "";
    

}

// Función para calcular la edad promedio de las personas
function calcularEdadPromedio(personas) {
    const hoy = new Date(); // Obtener la fecha actual
    
    // Calcular la suma de las edades
    const totalEdades = personas.reduce((acc, persona) => {
        // Obtener la fecha de nacimiento de la persona
        const fechaNacimiento = new Date(persona.fechaNacimiento.toString().substr(0, 4), 
                                          persona.fechaNacimiento.toString().substr(4, 2) - 1, 
                                          persona.fechaNacimiento.toString().substr(6, 2));
        
        // Calcular la diferencia de años
        const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        
        // Ajustar la edad si aún no ha pasado su cumpleaños este año
        if (hoy.getMonth() < fechaNacimiento.getMonth() || 
            (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate())) {
            acc += edad - 1;
        } else {
            acc += edad;
        }
        
        return acc;
    }, 0);
    
    // Calcular el promedio de edades
    const promedioEdades = totalEdades / personas.length;
    
    return promedioEdades.toFixed(2); // Redondear el promedio a dos decimales
}




function generarIdUnico(personasArray) {
    let nuevoId;
    do {
        nuevoId = Math.floor(Math.random() * (1000 - 0 + 1)) + 0;
    } while (personasArray.some(persona => persona.id === nuevoId));
    return nuevoId;
}




document.addEventListener("DOMContentLoaded", function () {
    const selectFiltro = document.getElementById("filtroSelect");
    const tbody = document.getElementById("data-output");
    const calcularButton = document.getElementById("calcularButton");
    const calcularEdadInput = document.getElementById("edadPromedioInput");
    const formAMB = document.getElementById("formAMB");
    const guardarButton = document.getElementById("guardarButton");
    const cancelarButton = document.getElementById("cancelarButton");
    const agregarButton = document.getElementById("agregarButton");
    const eliminarButton = document.getElementById("eliminarButton");
    const confirmarButton = document.getElementById("confirmarButton");
    const tipoSelect = document.getElementById("tipoSelect");
    

    // Función para actualizar la tabla con las personas filtradas
    function actualizarTabla(personas) {
        
        // Limpiar el cuerpo de la tabla
        tbody.innerHTML = '';

        // Iterar sobre cada persona y agregarla a la tabla
        personas.forEach(persona => {
            const fila = document.createElement("tr");
            // Crear celdas y agregarlas a la fila
            fila.appendChild(createTableCell(persona.id));
            fila.appendChild(createTableCell(persona.nombre));
            fila.appendChild(createTableCell(persona.apellido));
            fila.appendChild(createTableCell(persona.fechaNacimiento));
            fila.appendChild(createTableCell(persona.dni));
            fila.appendChild(createTableCell(persona.paisOrigen));

            fila.addEventListener("dblclick", function () {
                mostrarFormularioABM(persona);
                confirmarButton.style.display="none";
                agregarButton.style.display="none";
                guardarButton.style.display="inline-block";
                eliminarButton.style.display="inline-block";
                document.querySelector('.Formulario').style.display = 'none';

                

                if (persona instanceof Extranjero) {
                    document.getElementById("paisOrigenInput").style.display = "block";
                    document.getElementById("dniInput").style.display = "none";
                    document.getElementById("paisOrigenLabel").style.display = "block";
                    document.getElementById("dniLabel").style.display = "none";
                    tipoSelect.style.display = "none";
                    
                } else if (persona instanceof Ciudadano) {
                    document.getElementById("paisOrigenInput").style.display = "none";
                    document.getElementById("dniInput").style.display = "block";
                    document.getElementById("paisOrigenLabel").style.display = "none";
                    document.getElementById("dniLabel").style.display = "block";
                    tipoSelect.style.display = "none";
                    
                }
            });

            tbody.appendChild(fila);

            calcularEdadInput.value = "";
        });
    }

    
    function mostrarOcultarColumna(checkbox) {
        // Obtener la tabla y el ID de la columna
        const tabla = document.getElementById("data-Table");
        const columnaId = checkbox.value; // Obtener el ID de la columna desde el valor del checkbox
        const encabezados = tabla.getElementsByTagName("th");// Obtener todos los encabezados de columna
    
        // Buscar el índice de la columna
        let columnIndex = -1;
        for (let i = 0; i < encabezados.length; i++) {
            if (encabezados[i].id === columnaId) {
                columnIndex = i; // Guardar el índice de la columna
                break;
            }
        }
        // Verificar si se encontró la columna
        if (columnIndex !== -1) {
            const filas = tabla.getElementsByTagName("tr");// Obtener todas las filas de la tabla
    
            for (let i = 0; i < filas.length; i++) {
                const celdas = filas[i].getElementsByTagName("td");// Obtener todas las celdas de la fila
                if (celdas.length > columnIndex) {
                    // Mostrar u ocultar la celda según el estado del checkbox
                    celdas[columnIndex].style.display = checkbox.checked ? "" : "none";
                }
            }
    
            // oculto el encabezado de la columna
            encabezados[columnIndex].style.display = checkbox.checked ? "" : "none";
        }
    }



    
    // Obtener todos los checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Asignar el evento de cambio a todos los checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function() {
            mostrarOcultarColumna(checkbox);
        });
    });
    



    // Evento de clic en el botón "Calcular"
    calcularButton.addEventListener('click', function () {
        const filtro = selectFiltro.value;
        const personasFiltradas = filtrarPersonas(filtro);

        // Calcular la edad promedio
        edadPromedio = calcularEdadPromedio(personasFiltradas);

        // Mostrar la edad promedio
        calcularEdadInput.value = edadPromedio;
    });

    // Evento de cambio en el selector de filtro
    selectFiltro.addEventListener("change", function () {
        const filtro = selectFiltro.value;
        const personasFiltradas = filtrarPersonas(filtro);

        // Actualizar la tabla
        actualizarTabla(personasFiltradas);
    });


    agregarButton.addEventListener("click", function(){
        document.querySelector('.Formulario').style.display = 'none';
        formAMB.style.display = "block";
        eliminarButton.style.display="none";
        guardarButton.style.display="none";
        cancelarButton.style.display="none";
        cancelarButton.style.display="inline-block";
        
        // Establecer todos los campos del formulario a vacío
        document.getElementById("idInput").value = "";
        document.getElementById("nombreInput").value = "";
        document.getElementById("apellidoInput").value = "";
        document.getElementById("fechaNacimientoInput").value = "";
        document.getElementById("dniInput").value = "";
        document.getElementById("paisOrigenInput").value = "";
        

        document.getElementById("dniInput").style.display = "none";
        document.getElementById("paisOrigenInput").style.display = "none";
        
        dniLabel.style.display = "none";
        paisOrigenLabel.style.display = "none";
        
        

        tipoSelect.addEventListener("change", function() {
            const tipoSeleccionado = tipoSelect.value;
            const dniLabel = document.getElementById("dniLabel");
            const paisOrigenLabel = document.getElementById("paisOrigenLabel");
            
            switch (tipoSeleccionado) {
                case "-":
                    document.getElementById("dniInput").style.display = "none";
                    document.getElementById("paisOrigenInput").style.display = "none";
                    dniLabel.style.display = "none";
                    paisOrigenLabel.style.display = "none";
                    break;
                case "Ciudadano":
                    document.getElementById("paisOrigenInput").style.display = "none";
                    document.getElementById("dniInput").style.display = "block";
                    paisOrigenLabel.style.display = "none";
                    dniLabel.style.display = "block";
                    break;
                case "Extranjero":
                    document.getElementById("paisOrigenInput").style.display = "block";
                    document.getElementById("dniInput").style.display = "none";
                    paisOrigenLabel.style.display = "block";
                    dniLabel.style.display = "none";
                    break;
            }
        });

    });

    confirmarButton.addEventListener("click", function(){

        // Recopilar los datos del formulario
        const id = generarIdUnico(personasArray);
        const nombre = document.getElementById("nombreInput").value;
        const apellido = document.getElementById("apellidoInput").value;
        const fechaNacimiento = parseInt(document.getElementById("fechaNacimientoInput").value);
        const dni = document.getElementById("dniInput").value;
        const paisOrigen = document.getElementById("paisOrigenInput").value;
        
        
        // Verificar que se completen los campos obligatorios
        if (!id || !nombre || !apellido || !fechaNacimiento) {
            alert("Por favor complete los campos obligatorios: ID, Nombre, Apellido y Edad.");
            return; // Detener la ejecución si falta algún campo obligatorio
        }

            const tipoSeleccionado = tipoSelect.value;
        if (tipoSeleccionado === "-") {
            alert("Por favor, seleccione un tipo (Ciudadano o Extranjero).");
            return;
        }

        
        // // Verificar que no se ingresen datos contradictorios
        // if ((dni && !paisOrigen) || (!paisOrigen && dni)) {
        //     alert("Por favor, complete bien");
        //     return; 
        // }

        




        // Crear un array con los datos de la nueva persona
         const nuevaPersonaData = [{ id, nombre, apellido, fechaNacimiento, dni, paisOrigen}];
    
         // Convertir los datos en instancias de Cliente o Empleado
         const nuevaPersonaInstancia = crearInstancias(nuevaPersonaData)[0]; // Tomar el primer elemento del array
    
        // Agregar la nueva persona al array
         personasArray.push(nuevaPersonaInstancia);
    
        // Actualizar la tabla
        actualizarTabla(personasArray);
        console.log(personasArray);

        agregarButton.style.display="block";
        formAMB.style.display = "none";
        document.querySelector('.Formulario').style.display = 'block';
        
    });
    


    // Manejar el clic en el botón "Guardar"
    guardarButton.addEventListener("click", function(){
    const id = document.getElementById("idInput").value;
    const nombre = document.getElementById("nombreInput").value;
    const apellido = document.getElementById("apellidoInput").value;
    const fechaNacimiento = parseInt(document.getElementById("fechaNacimientoInput").value);
    const dni = parseInt(document.getElementById("dniInput").value);
    const paisOrigen = parseInt(document.getElementById("paisOrigenInput").value);
    

    // Encontrar la persona correspondiente en el array
    const personaIndex = personasArray.findIndex(persona => persona.id == id);

    // Verificar si la persona existe en el array
    if (personaIndex !== -1) {
        // Actualizar los atributos de la persona
        personasArray[personaIndex].nombre = nombre;
        personasArray[personaIndex].apellido = apellido;
        personasArray[personaIndex].fechaNacimiento = fechaNacimiento;

        // Actualizar los atributos específicos dependiendo del tipo de persona
        if (personasArray[personaIndex] instanceof Extranjero) {
            personasArray[personaIndex].paisOrigen = paisOrigen;

        } else if (personasArray[personaIndex] instanceof Ciudadano) {
            personasArray[personaIndex].dni = dni;

        }

        // Actualizar la tabla
        actualizarTabla(personasArray);
    } else {
        console.log("No se encontró la persona con ID:", id);
    }

    // Ocultar el formulario ABM
    formAMB.style.display = "none";
    document.querySelector('.Formulario').style.display = 'block';
    agregarButton.style.display="block";

    });

    // Manejar el clic en el botón "Eliminar"
    eliminarButton.addEventListener("click", function () {
        // Recopilar ID de la persona a eliminar
        const id = document.getElementById("idInput").value;
    
        // Encontrar el índice de la persona correspondiente en el array
        const personaIndex = personasArray.findIndex(persona => persona.id == id);
    
        // Verificar si la persona existe en el array
        if (personaIndex !== -1) {
            // Eliminar la persona del array
            personasArray.splice(personaIndex, 1);
    
            // Actualizar la tabla
            actualizarTabla(personasArray);
        } else {
            console.log("No se encontró la persona con ID:", id);
        }
    
        // Ocultar el formulario ABM
        formAMB.style.display = "none";
        document.querySelector('.Formulario').style.display = 'block';
        agregarButton.style.display = "block";
    });

    // Manejar el clic en el botón "Cancelar"
    cancelarButton.addEventListener("click", function () {
        // Ocultar el formulario ABM
        agregarButton.style.display="block";
        formAMB.style.display = "none";
        document.querySelector('.Formulario').style.display = 'block';
        
    });

    // Inicializar la tabla al cargar la página
    actualizarTabla(personasArray);
});