// Obtener la tabla y el cuerpo de la tabla
const tableBody = document.querySelector("#clientes-list tbody");

// BOTON LOGOUT
document.getElementById("logoutButton").addEventListener("click", function () {
  window.location.href = "./Login.html";
});
let clientes = [];
//FUNCION PARA CARGAR CLIENTES EN LA TABLA
async function cargarClientes() {
  try {
    const response = await fetch(
      "http://localhost:3000/clientes",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener los clientes");
    }

    clientes = await response.json();
    const tableBody = document.getElementById("clientes-list");
    tableBody.innerHTML = ""; // Limpiar la tabla

    // Llenar la tabla
    clientes.forEach((cliente) => {
        const row = document.createElement("tr");
        row.id = `cliente-${cliente.idCliente}`; // ID único

        // Agregar la fila con un botón "Modificar"
        row.innerHTML = `
          <td>${cliente.idCliente}</td>
          <td>${cliente.Nombre}</td>
          <td>${cliente.Direccion}</td>
          <td>${
            cliente.nombreLocalidad ? cliente.nombreLocalidad : "sin definir"
          }</td>
          <td>
            
              <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#modalModificarCliente" onclick="mostrarModalModificar(${cliente.idCliente})">Modificar</button>
              <button class="btn btn-danger btn-sm" onclick="cambiarEstadoCliente(${cliente.idCliente},${cliente.Estado})">Cambiar Estado</button>
          </td>
          <td>${cliente.Estado ==1? 'Activo':'Inactivo'}</td>
        `;
        tableBody.appendChild(row);
      
    });
    console.log("Clientes cargados:", clientes);
  } catch (error) {
    console.error("Error al cargar los clientes:", error);
  }
}

// FUNCION PARA REGISTRAR UN NUEVO CLIENTE
async function Guardarnuevocliente() {
  let nombre = document.getElementById("nombreapellido").value;
  let direccion = document.getElementById("direccion").value;
  let localidad = document.getElementById("localidad").value;

  let nuevocliente = {
    nombre: nombre,
    direccion: direccion,
    localidad: localidad,
  };

  try {
    const response = await fetch("http://localhost:3000/clientes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevocliente),
    });

    if (response.ok) {
      await cargarClientes();
      selectDinamico();
      document.getElementById("nombreapellido").value = "";
      document.getElementById("direccion").value = "";
      document.getElementById("localidad").value = "0";
      
      // Cerrar el modal después de guardar
      const modalAdd = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
      modalAdd.hide();
    } else {
      console.error("Error al guardar el cliente:", response.status);
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

//FUNCION PARA HACER EL SELECT DINAMICO
async function selectDinamico() {
  try {
    // Hacer la solicitud GET al servidor para obtener la lista de clientes
    const response = await fetch("http://localhost:3000/clientes");
    if (!response.ok) {
      throw new Error("Error al obtener los clientes");
    }

    // Convertir la respuesta a JSON
    const clientes = await response.json();


    // Obtener el select del DOM y vaciarlo para evitar duplicados
    const selectElement = document.getElementById("clienteSelect");
    selectElement.innerHTML = ""; // Limpiar las opciones anteriores

    // Agregar la opción "Seleccionar cliente" como la primera opción
    const defaultOption = document.createElement("option");
    defaultOption.value = ""; // Valor vacío para indicar que no se ha seleccionado un cliente
    defaultOption.textContent = "Seleccionar cliente"; // Texto predeterminado
    selectElement.appendChild(defaultOption);

    // Iterar sobre la lista de clientes, pero evitar agregar los ocultos
    clientes.forEach((cliente) => {
      const option = document.createElement("option");
      option.value = cliente.idCliente; // Usar el id como valor
      option.textContent = cliente.Nombre; // Usar el nombre como texto
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar el select:", error);
  }
}
var idClienteselect = 0;

//FUNCION PARA MOSTRAR EL MODAL DEL MODIFICAR
async function mostrarModalModificar(idCliente) {
  try {
    // Hacer una solicitud al servidor para obtener los detalles del cliente
    const response = await fetch(`http://localhost:3000/clientes/${idCliente}`);
    const cliente = await response.json();
    idClienteselect = idCliente;
    
    console.log(cliente); 

    // Asignar los valores a los campos del modal
    document.getElementById("modificarNombre").value = cliente[0].Nombre;
    document.getElementById("modificarDireccion").value = cliente[0].Direccion;
    document.getElementById("modificarLocalidad").value = cliente[0].Localidad || 0;

    // Almacenar el ID del cliente para cuando guardemos los cambios
    document.getElementById("modificarClienteId").value = cliente.idCliente;
  } catch (error) {
    console.error("Error al abrir el modal de modificar:", error);
  }
}

//FUNCION PARA GUARDAR LOS CAMBIOS DEL MODAL MODIFICAR
async function GuardarCambiosCliente() {
  let nombre = document.getElementById("modificarNombre").value;
  let direccion = document.getElementById("modificarDireccion").value;
  let localidad = document.getElementById("modificarLocalidad").value;

  let clienteModificado = {
    nombre: nombre,
    direccion: direccion,
    localidad: localidad,
  };

  try {
    const response = await fetch(`http://localhost:3000/clientes/${idClienteselect}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clienteModificado),
    });

    if (response.ok) {
      await cargarClientes();
      
      // Cerrar el modal después de guardar los cambios
      const modalEdit = bootstrap.Modal.getInstance(document.getElementById("modalModificarCliente"));
      modalEdit.hide();
    } else {
      console.error("Error al modificar el cliente:", response.status);
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

///CAMBIAR ESTADO CLIENTE  
async function cambiarEstadoCliente(idCliente, estado) {
  console.log("ID del cliente:", idCliente,estado);
   estado = estado == 1 ? 0 : 1;
  try {
    const response = await fetch(`http://localhost:3000/clientes/estado/${idCliente}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado:estado }),
      }
    );

    if (response.ok) {
      console.log("Estado del cliente actualizado correctamente");
      cargarClientes(); // Recargar la tabla
    } else {
      console.error("Error al actualizar el estado del cliente");
    }
  } catch (error) {
    console.error("Error en la solicitud de actualización de estado:", error);
  }
}

///FILTRADO DE LOS CLIENTES POR NOMBRE Y BAR O PARTICULAR
// Obtener el input de búsqueda
const buscarClienteInput = document.getElementById("buscarCliente");

// Agregar evento input para filtrar la lista
buscarClienteInput.addEventListener("input", function () {
  const query = buscarClienteInput.value.toLowerCase(); // Convertir el texto a minúsculas
  filtrarClientes(query); // Llamar a la función de filtrado
});

//FUNCION PARA FILTRAR POR NOMBRE
function filtrarClientes(query) {
  const rows = document.querySelectorAll("#clientes-list tr");

  rows.forEach((row) => {
    const nombreCliente = row
      .querySelector("td:nth-child(2)")
      .textContent.toLowerCase(); // Obtener el nombre del cliente y convertir a minúsculas

    if (nombreCliente.includes(query)) {
      row.style.display = ""; // Mostrar fila si coincide
    } else {
      row.style.display = "none"; // Ocultar fila si no coincide
    }
  });
}

//FUNCION PARA FILTRAR POR ESTADO
function filtrarPorEstado(estado) {
  const tableBody = document.getElementById("clientes-list");
  tableBody.innerHTML = ""; // Limpiar la tabla

  // Filtrar los clientes según el estado seleccionado
  let clientesFiltrados;
  if (estado === "" || estado === "Todos") {
    // Si el estado es "Todos" o está vacío, mostrar todos los clientes
    clientesFiltrados = clientes;
  } else {
    // Filtrar según el estado (1: Activo, 0: Inactivo)
    clientesFiltrados = clientes.filter(cliente => {
      return estado == 1 ? cliente.Estado === 1 : cliente.Estado === 0;
    });
  }

  // Llenar la tabla con los clientes filtrados
  clientesFiltrados.forEach(cliente => {
    const row = document.createElement("tr");
    row.id = `cliente-${cliente.idCliente}`;
    row.innerHTML = `
      <td>${cliente.idCliente}</td>
      <td>${cliente.Nombre}</td>
      <td>${cliente.Direccion}</td>
      <td>${cliente.nombreLocalidad ? cliente.nombreLocalidad : "sin definir"}</td>
      <td>
        <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#modalModificarCliente" onclick="mostrarModalModificar(${cliente.idCliente})">Modificar</button>
        <button class="btn btn-danger btn-sm" onclick="cambiarEstadoCliente(${cliente.idCliente},${cliente.Estado})">Cambiar Estado</button>
      <td>${cliente.Estado == 1 ? 'Activo' : 'Inactivo'}</td>
      </td>
     
    `;
    tableBody.appendChild(row);
  });
}
const filtroEstadoSelect = document.getElementById("estadoFiltro");
filtroEstadoSelect.addEventListener("change", function () {
  const estado = filtroEstadoSelect.value; // Obtener estado seleccionado

  filtrarPorEstado(estado); // Filtrar por estado
});

//llamar la funcion select dinamico
window.onload = selectDinamico();
// Cargar los clientes al inicio
cargarClientes();
