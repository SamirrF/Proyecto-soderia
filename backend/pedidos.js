document.addEventListener("DOMContentLoaded", () => {
  cargarClientes();
  cargarProductos();
  cargarPedidos(); // Llama a cargarPedidos al iniciar la página
});

// BOTON DE LOGOUT
document.getElementById("logoutButton").addEventListener("click", function () {
  window.location.href = "./Login.html";
});

// FUNCION PARA REGISTRAR PEDIDOS
async function registrarPedido() {
  const clienteSelect = document.getElementById("clienteSelect");
  const direccionInput = document.getElementById("direccion");
  const fechaPedidoInput = document.getElementById("fechaPedido");
  const montoTotalElem = document.getElementById("montoTotal");

  if (
    !clienteSelect ||
    !direccionInput ||
    !fechaPedidoInput ||
    !montoTotalElem
  ) {
    console.error("Uno o más elementos no se encontraron en el DOM");
    return;
  }

  const clienteId = clienteSelect.value;
  const direccion = direccionInput.value;
  const fechaPedido = fechaPedidoInput.value;
  const montoTotal = parseFloat(
    montoTotalElem.textContent.replace("Monto Total: $", "")
  );

  // Crear el objeto con los datos del nuevo pedido
  const nuevoPedido = {
    idCliente: clienteId,
    direccion,
    FechaPedido: fechaPedido,
    productosSeleccionados: productosSeleccionados.map((producto) => ({
      idProducto: producto.idProducto,
      cantidad: producto.cantidad,
      precio: Number(producto.precio),
    })),
    Total: montoTotal,
    EstadoPedido: 1, // Puedes ajustar este valor según tus necesidades
    idUsuario: 1, // Ajusta el idUsuario según tu lógica de autenticación
  };

  try {
    const response = await fetch("http://localhost:3000/pedidos/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoPedido),
    });

    if (!response.ok) {
      throw new Error("Error al registrar el pedido");
    }

    alert("Pedido registrado con éxito");
    borrarSeleccion(); // Limpiar el formulario después del registro
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("modalNuevoPedido")
    );
    modal.hide();
    cargarPedidos();
  } catch (error) {
    console.error("Error al registrar el pedido:", error);
    alert("Hubo un problema al registrar el pedido");
  }

}
const pedidos = [];
const pedidosFiltrar = [];
// FUNCION PARA CARGAR PEDIDOS EN LA GRILLA
async function cargarPedidos() {
  try {
    const response = await fetch("http://localhost:3000/pedidos");
    if (!response.ok) {
      throw new Error("Error al obtener los pedidos");
    }
    const pedidos = await response.json();
    pedidosFiltrar.push(...pedidos);
    const tablaPedidos = document.querySelector("#tablaPedidos tbody");
    tablaPedidos.innerHTML = ""; // Limpiar la tabla antes de cargar los pedidos
    console.log(pedidos);
    pedidos.forEach((pedido) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${pedido.Nombre}</td> <!-- Actualiza este campo según los datos de cliente -->
          <td>${pedido.direccion || "N/A"}</td> <!-- Agrega esta propiedad si la tienes en el registro -->
          <td>${pedido.FechaPedido}</td>
          <td>$${pedido.total}</td>
          <td>${pedido.EstadoPedido == 1? "Pendiente"
              : pedido.EstadoPedido == 2? "Entregado"
              : pedido.EstadoPedido == 3? "Cancelado"
              : "Desconocido"
          }
        </td>
          <td>
          <button class="btn btn-success" onclick="verDetallePedido(${pedido.idPedido})">Ver Detalle</button>
          <button class="btn btn-warning" onclick="cargarPedidoAmodificar(${pedido.idPedido})">Modificar</button>
        </td>

        `;
      tablaPedidos.appendChild(row);
    });
  } catch (error) {
    console.error("Error al cargar los pedidos:", error);
  }
}

//FUNCION CARGAR CLIENTES EN SELECT REGISTRAR PEDIDOS
// async function cargarClientes() {
//     try {
//         const response = await fetch('http://localhost:3000/clientes/clientes/activos', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer token' // Si usas autenticación
//             }
//         });

//         // Verificar si la respuesta fue exitosa
//         if (!response.ok) {
//             throw new Error('Error en la respuesta del servidor');
//         }

//         const clientes = await response.json();

//         // Verificar los datos recibidos
//         console.log('Datos recibidos:', clientes);

//         // Verificar que los datos no estén vacíos
//         if (clientes.length === 0) {
//             console.log('No hay clientes en la base de datos.');
//             return;
//         }

//         // Obtener el select del DOM
//         const selectElement = document.getElementById('clienteSelect');

//         // Limpiar el select antes de agregar las nuevas opciones
//         selectElement.innerHTML = '';

//         // Agregar la opción por defecto "Seleccionar cliente"
//         const defaultOption = document.createElement('option');
//         defaultOption.value = '';
//         defaultOption.textContent = 'Seleccionar cliente';
//         selectElement.appendChild(defaultOption);
//         // Filtrar solo los clientes activos (ajusta el campo según tu estructura de datos)
//         const clientesActivos = clientes.filter(cliente => cliente.Estado == 1);

//         console.log('Clientes activos:', clientesActivos); // Verifica que el filtro funcione

//         // Iterar sobre los clientes activos obtenidos para llenar el select
//         clientesActivos.forEach(cliente => {
//             const option = document.createElement('option');
//             option.value = cliente.id; // Ajustar el campo de ID del cliente
//             option.textContent = cliente.Nombre; // Ajustar el campo de nombre del cliente
//             selectElement.appendChild(option);
//         });
//     } catch (error) {
//         // Manejar errores de la petición o del procesamiento de la respuesta
//         console.error('Error al hacer fetch:', error);
//     }
// }
let clientesData = []; // Variable para almacenar los clientes y sus datos

// Función para cargar clientes y llenar el select
async function cargarClientes() {
  try {
    const response = await fetch(
      "http://localhost:3000/clientes/clientes/activos",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token", // Si usas autenticación
        },
      }
    );

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const clientes = await response.json();

    // Verificar que los datos no estén vacíos
    if (clientes.length === 0) {
      console.log("No hay clientes en la base de datos.");
      return;
    }

    // Guardar los datos de clientes para el autocompletado
    clientesData = clientes;

    // Obtener el select del DOM
    const selectElement = document.getElementById("clienteSelect");

    // Limpiar el select antes de agregar las nuevas opciones
    selectElement.innerHTML = "";

    // Agregar la opción por defecto "Seleccionar cliente"
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccionar cliente";
    selectElement.appendChild(defaultOption);

    // Filtrar solo los clientes activos (ajusta el campo según tu estructura de datos)
    const clientesActivos = clientes.filter((cliente) => cliente.Estado == 1);

    // Iterar sobre los clientes activos obtenidos para llenar el select
    clientesActivos.forEach((cliente) => {
      const option = document.createElement("option");
      option.value = cliente.idCliente; // Ajustar el campo de ID del cliente
      option.textContent = cliente.Nombre; // Ajustar el campo de nombre del cliente
      selectElement.appendChild(option);
    });

    // Agregar el evento change para autocompletar la dirección
    selectElement.addEventListener("change", autocompletarDireccion);
  } catch (error) {
    console.error("Error al hacer fetch:", error);
  }
}

// Función para autocompletar la dirección al seleccionar un cliente
function autocompletarDireccion() {
  const clienteId = document.getElementById("clienteSelect").value;

  // Buscar el cliente seleccionado en la lista de clientes
  const clienteSeleccionado = clientesData.find(
    (cliente) => cliente.idCliente == clienteId
  );

  // Si se encuentra el cliente, actualizar el campo de la dirección
  if (clienteSeleccionado) {
    document.getElementById("direccion").value = clienteSeleccionado.Direccion;
  } else {
    document.getElementById("direccion").value = ""; // Limpiar si no se selecciona un cliente válido
  }
}

var detallePedido = [];
var productosSeleccionados = []; // Array para almacenar productos seleccionados con sus cantidades

function agregarProductos(producto) {
  // Verificar si el producto ya fue agregado
  const productoExistente = productosSeleccionados.find(
    (p) => p.idProducto === producto.idProducto
  );

  if (productoExistente) {
    // Si el producto ya está en la lista, incrementar su cantidad
    productoExistente.cantidad += 1;
  } else {
    // Si es un producto nuevo, añadirlo con cantidad 1
    productosSeleccionados.push({ ...producto, cantidad: 1 });
  }

  // Actualizar el área de texto con los productos seleccionados
  actualizarProductosSeleccionados();
}

function actualizarProductosSeleccionados() {
  const textarea = document.getElementById("productosSeleccionados");
  textarea.value = productosSeleccionados
    .map((p) => `${p.nombre} - Cantidad: ${p.cantidad} |`)
    .join("\n"); // Formato del texto a mostrar
}

// FUNCION PARA CARGAR LOS PRODUCTOS EN EL SELECT
let productosData = [];
async function cargarProductos() {
  try {
    const response = await fetch(
      "http://localhost:3000/productos/disponibles",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }

    const productos = await response.json();
    productosData = productos;

    const productoSelect = document.getElementById("productoSelect");
    productoSelect.innerHTML = ""; // Limpiar antes de agregar nuevos productos

    const defaultOption = document.createElement("li");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccionar producto";
    productoSelect.appendChild(defaultOption);

    productos.forEach((producto) => {
      const option = document.createElement("li");
      option.value = producto.idProducto;
      option.textContent = producto.nombre;
      option.dataset.precio = producto.precio;

      const btnAdd = document.createElement("button");
      btnAdd.textContent = "Agregar";

      btnAdd.addEventListener("click", (event) => {
        event.preventDefault();
        agregarProductos(producto); // Llama a la función agregarProductos
        calcularMonto();
      });

      option.appendChild(btnAdd);
      productoSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

//FUNCION PARA CALCULAR EL MONTO Y MOSTRARLO
function calcularMonto() {
  const montoTotal = productosSeleccionados.reduce((total, producto) => {
    return total + producto.precio * producto.cantidad;
  }, 0);

  // Mostrar el monto total en un campo de texto o etiqueta
  document.getElementById(
    "montoTotal"
  ).textContent = `Monto Total: $${montoTotal.toFixed(2)}`;
}

//funcion para borrar las selecciones
function borrarSeleccion() {
  document.getElementById("formNuevoPedido").reset(); // Cambia "miFormulario" por el id de tu formulario

  productosSeleccionados = [];
  actualizarProductosSeleccionados();
  calcularMonto();

  const montoTotal = document.getElementById("montoTotal");
  if (montoTotal) montoTotal.textContent = "Monto Total: $0.00";
}

// FUNCION PARA VER DETALLE DEL PEDIDO
function verDetallePedido(idPedido) {
  fetch(`http://localhost:3000/pedidos/${idPedido}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los detalles del pedido");
      }
      return response.json();
    })
    .then((detalles) => {
      // console.log("detalle", detalles)
      mostrarDetallesPedido(detalles);
    })
    .catch((error) => {
      console.error("Error al obtener los detalles del pedido:", error);
    });
}

function mostrarDetallesPedido(detalles) {
  const modalContent = document.getElementById("detallePedidoContent");
  modalContent.innerHTML = detalles
    .map(
      (pedido) => `
    <li>
      <strong>Producto:</strong> ${pedido.Nombre}<br>
      <strong>Cantidad:</strong> ${pedido.cantidad}<br>
      <strong>Precio:</strong> $${pedido.precioUnitario}<br>
      <strong>Subtotal:</strong> $${pedido.subtotal}
    </li>
  `
    )
    .join("");

  const modal = new bootstrap.Modal(
    document.getElementById("detallePedidoModal")
  );
  modal.show();
}

function cerrarModal() {
  const modal = document.querySelector("#detallePedidoModal");
  if (modal) {
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    bootstrapModal.hide();
  }
}

// Función para cargar clientes y llenar el select
async function cargarClientesModificar() {
  try {
    const response = await fetch(
      "http://localhost:3000/clientes/clientes/activos",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const clientes = await response.json();

    // Verificar que los datos no estén vacíos
    if (clientes.length === 0) {
      console.log("No hay clientes en la base de datos.");
      return;
    }

    // Guardar los datos de clientes para el autocompletado
    clientesData = clientes;

    // Obtener el select del DOM
    const selectElement = document.getElementById("modificarClienteSelect");

    // Limpiar el select antes de agregar las nuevas opciones
    selectElement.innerHTML = "";

    // Agregar la opción por defecto "Seleccionar cliente"
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccionar cliente";
    selectElement.appendChild(defaultOption);

    // Filtrar solo los clientes activos (ajusta el campo según tu estructura de datos)
    const clientesActivos = clientes.filter((cliente) => cliente.Estado == 1);

    // Iterar sobre los clientes activos obtenidos para llenar el select
    clientesActivos.forEach((cliente) => {
      const option = document.createElement("option");
      option.value = cliente.idCliente; // Ajustar el campo de ID del cliente
      option.textContent = cliente.Nombre; // Ajustar el campo de nombre del cliente
      selectElement.appendChild(option);
    });

    // Agregar el evento change para autocompletar la dirección
  } catch (error) {
    console.error("Error al hacer fetch:", error);
  }
}

function cargarPedidoAmodificar(idPedido) {
  // Obtener los datos del pedido desde el servidor
  fetch(`http://localhost:3000/pedidos/especifico/${idPedido}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los detalles del pedido");
      }
      return response.json();
    })
    .then((pedido) => {
      console.log("detalle", pedido);
      // Llamar a la función para mostrar el modal con los datos del pedido
      cargarClientesModificar();
      setTimeout(() => {
        mostrarModalModificarPedido(pedido[0]);
      }, 200);
    })
    .catch((error) => {
      console.error("Error al obtener los detalles del pedido:", error);
    });
}

let idPedidoSeleccionado;
let modalC;
// Función para mostrar el modal y autocompletar con los datos del pedido
const mostrarModalModificarPedido = (pedido) => {
  console.log("datos", pedido);
  idPedidoSeleccionado = pedido.idPedido;
  // Rellenar los campos del modal con los datos del pedido
  document.getElementById("modificarClienteSelect").value =
    pedido.idCliente || "";
  document.getElementById("modificarDireccion").value = pedido.direccion || "";
  document.getElementById("modificarFechaPedido").value =
    pedido.FechaPedido || "";
  document.getElementById("modificarEstadoPedido").value =
    pedido.EstadoPedido || "";

  // obtengo el detalle del pedido
  let detallesPedido;
  fetch(`http://localhost:3000/pedidos/${pedido.idPedido}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los detalles del pedido");
      }
      return response.json();
    })
    .then((detalles) => {
      detallePedido = detalles;
    })
    .catch((error) => {
      console.error("Error al obtener los detalles del pedido:", error);
    });
  setTimeout(() => {
    // Limpiar y agregar los productos seleccionados
    const productoSelect = document.getElementById("modificarProductoSelect");
    productoSelect.innerHTML = ""; // Limpiar opciones actuales
    console.log("llego aca", detallePedido);
    detallePedido.forEach((producto) => {
      console.log("producto", producto);
      const option = document.createElement("option");
      option.value = producto.idProducto;
      option.textContent = `${producto.Nombre} (${producto.cantidad})`;
      option.selected = true; // Marcar como seleccionado
      productoSelect.appendChild(option);
    });

    const montoTotal = detallePedido.reduce(
      (total, producto) => total + producto.precioUnitario * producto.cantidad,
      0
    );
    document.getElementById(
      "modificarMontoTotal"
    ).textContent = `Monto Total: $${montoTotal.toFixed(2)}`;

    // Mostrar el modal
    const modal = new bootstrap.Modal(
      document.getElementById("modalModificarPedido")
    );
    modal.show();
    modalC = modal;
  }, 300);
};

// funcion para modificar datos del pedido ( cliente, total, fecha, direccion, estadoPedido)
function guardarCambiosPedido() {
  console.log("llamo aca");
  const idPedido = idPedidoSeleccionado;
  const idCliente = document.getElementById("modificarClienteSelect").value;
  const direccion = document.getElementById("modificarDireccion").value;
  const fechaPedido = document.getElementById("modificarFechaPedido").value;
  const total = detallePedido.reduce(
    (total, producto) => total + producto.precioUnitario * producto.cantidad,
    0
  );
  const estadoPedido = document.getElementById("modificarEstadoPedido").value;

  console.log("datos", estadoPedido);

  const pedidoModificado = {
    idCliente: idCliente,
    direccion: direccion,
    FechaPedido: fechaPedido,
    Total: total,
    EstadoPedido: Number(estadoPedido),
  };

  fetch(`http://localhost:3000/pedidos/modificar/${idPedido}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pedidoModificado),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al modificar el pedido");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Pedido modificado con éxito:", data);
      setTimeout(() => {
        modalC.hide();
        cargarPedidos();
      }, 500);
      // Aquí puedes realizar acciones adicionales después de modificar el pedido
    })
    .catch((error) => {
      console.error("Error al hacer fetch:", error);
    });
}

// funcion para modificar el detalle de un pedido
function updateDetallePedido() {}



/// FILTROS ///////
 // Función para filtrar pedidos por fecha
 let pedidosFiltradosClon = [];
 function filtrarPedidos() {
  const fechaDesde = document.getElementById("fechaDesde").value;
  const fechaHasta = document.getElementById("fechaHasta").value;

  // Asegurarse de que las fechas desde y hasta no estén vacías
  const fechaDesdeParsed = fechaDesde ? new Date(fechaDesde).getTime() : null;
  const fechaHastaParsed = fechaHasta ? new Date(fechaHasta).getTime() : null;

  // Filtrar los pedidos usando el clon de los pedidos
  pedidosFiltradosClon = pedidosFiltrar.filter((pedido) => {
    const fechaPedidoParsed = new Date(pedido.FechaPedido).getTime(); // Convertir la fecha del pedido

    let estaEnRango = true;

    // Verificar si la fecha del pedido está dentro del rango
    if (fechaDesdeParsed && fechaPedidoParsed < fechaDesdeParsed) {
      estaEnRango = false;
    }
    if (fechaHastaParsed && fechaPedidoParsed > fechaHastaParsed) {
      estaEnRango = false;
    }

    return estaEnRango;
  });

  // Mostrar los pedidos filtrados
  mostrarPedidosFiltrados();
}

function mostrarPedidosFiltrados() {
  const tablaPedidos = document.querySelector("#tablaPedidos tbody");
  tablaPedidos.innerHTML = ""; // Limpiar tabla

  if (pedidosFiltradosClon.length > 0) {
    pedidosFiltradosClon.forEach((pedido) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${pedido.Nombre}</td>
          <td>${pedido.direccion || "N/A"}</td>
          <td>${pedido.FechaPedido}</td>
          <td>$${pedido.total}</td>
          <td>${
            pedido.EstadoPedido == 1
              ? "Pendiente"
              : pedido.EstadoPedido == 2
              ? "Entregado"
              : pedido.EstadoPedido == 3
              ? "Cancelado"
              : "Desconocido"
          }</td>
          <td>
            <button class="btn btn-success" onclick="verDetallePedido(${pedido.idPedido})">Ver Detalle</button>
            <button class="btn btn-warning" onclick="cargarPedidoAmodificar(${pedido.idPedido})">Modificar</button>
          </td>
        `;
      tablaPedidos.appendChild(row);
    });
  } else {
    tablaPedidos.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">No se encontraron pedidos en este rango de fechas.</td>
      </tr>
    `;
  }
}

// FUNCION PARA FILTRAR TODOS LOS PEDIDOS DE UN CLIENTE 
// Función para filtrar y mostrar los pedidos por cliente
// Función para cargar los pedidos de un cliente en la tabla
function cargarPedidosPorCliente(nombreCliente) {
  const tablaPedidos = document.querySelector("#tablaPedidos tbody");
  tablaPedidos.innerHTML = ""; // Limpiar la tabla antes de cargar los pedidos

  // Filtrar los pedidos que coincidan con el nombre del cliente
  const pedidosFiltrados = pedidosFiltrar.filter(pedido => 
    pedido.Nombre.toLowerCase().includes(nombreCliente.toLowerCase()) // Filtrado por nombre de cliente
  );

  // Si no se encuentran pedidos, mostrar un mensaje en la tabla
  if (pedidosFiltrados.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="6" class="text-center">No se encontraron pedidos para este cliente.</td>`;
    tablaPedidos.appendChild(row);
    return;
  }

  // Cargar los pedidos filtrados en la tabla
  pedidosFiltrados.forEach(pedido => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${pedido.Nombre}</td>
      <td>${pedido.direccion || "N/A"}</td>
      <td>${pedido.FechaPedido}</td>
      <td>$${pedido.total}</td>
      <td>${pedido.EstadoPedido === 1 ? "Pendiente" : pedido.EstadoPedido === 2 ? "Entregado" : "Cancelado"}</td>
      <td>
        <button class="btn btn-success" onclick="verDetallePedido(${pedido.idPedido})">Ver Detalle</button>
        <button class="btn btn-warning" onclick="cargarPedidoAmodificar(${pedido.idPedido})">Modificar</button>
      </td>
    `;
    tablaPedidos.appendChild(row);
  });
}

// Función para manejar el evento de buscar por cliente
document.getElementById("myInput").addEventListener("keyup", function() {
  const filter = this.value; // Obtener el valor que el usuario escribe
  cargarPedidosPorCliente(filter); // Llamar a la función para cargar los pedidos filtrados
});

// Función para cargar los pedidos filtrados por estado
function cargarPedidosPorEstado(estado) {
  const tablaPedidos = document.querySelector("#tablaPedidos tbody");
  tablaPedidos.innerHTML = ""; // Limpiar la tabla antes de cargar los pedidos

  // Filtrar los pedidos según el estado
  const pedidosFiltrados = pedidosFiltrar.filter(pedido => 
    estado ? pedido.EstadoPedido === parseInt(estado) : true // Filtrar por estado si hay un valor seleccionado
  );

  // Si no se encuentran pedidos, mostrar un mensaje en la tabla
  if (pedidosFiltrados.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="6" class="text-center">No se encontraron pedidos para este estado.</td>`;
    tablaPedidos.appendChild(row);
    return;
  }

  // Cargar los pedidos filtrados en la tabla
  pedidosFiltrados.forEach(pedido => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${pedido.Nombre}</td>
      <td>${pedido.direccion || "N/A"}</td>
      <td>${pedido.FechaPedido}</td>
      <td>$${pedido.total}</td>
      <td>${pedido.EstadoPedido === 1 ? "Pendiente" : pedido.EstadoPedido === 2 ? "Entregado" : "Cancelado"}</td>
      <td>
        <button class="btn btn-success" onclick="verDetallePedido(${pedido.idPedido})">Ver Detalle</button>
        <button class="btn btn-warning" onclick="cargarPedidoAmodificar(${pedido.idPedido})">Modificar</button>
      </td>
    `;
    tablaPedidos.appendChild(row);
  });
}

// Función para manejar el evento de filtrar por estado del pedido
document.getElementById("estadoPedido").addEventListener("change", function() {
  const estado = this.value; // Obtener el valor del estado seleccionado
  cargarPedidosPorEstado(estado); // Llamar a la función para cargar los pedidos filtrados por estado
});

