const express = require("express");
const router = express.Router();
const Database = require("../db");

//ENDPOINT PARA OBTENER LOS PEDIDOS
router.get("/", async (req, res) => {
  try {
    const conexion = await Database.obtenerConexion();
    const [pedidos] = await conexion.query(`SELECT p.idPedido, c.idCliente, c.Nombre, p.FechaPedido, p.total, p.EstadoPedido, p.direccion
     FROM pedidos p
      LEFT JOIN clientes c
        on c.idCliente = p.idCliente
      `);
    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    res.status(500).json({ error: "Error al obtener los pedidos" });
  }
});

//ENDPOINT PARA OBTENER LOS PEDIDOS
router.get("/especifico/:idPedido", async (req, res) => {
  const {idPedido} = req.params
  try {
    const conexion = await Database.obtenerConexion();
    const [pedidos] = await conexion.query(`SELECT p.idPedido, c.idCliente, c.Nombre, p.FechaPedido, p.total, p.EstadoPedido, p.direccion
     FROM pedidos p
      LEFT JOIN clientes c
        on c.idCliente = p.idCliente
       where p.idPedido = ?`, [idPedido]);
    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    res.status(500).json({ error: "Error al obtener los pedidos" });
  }
});

// ENDPOINT PARA REGISTRAR UN PEDIDO
router.post("/registrar", async (req, res) => {
  let conexion;
  try {
    const {
      idCliente,
      direccion,
      FechaPedido,
      Total,
      EstadoPedido,
      productosSeleccionados,
    } = req.body;

    // Abre la conexión a la base de datos
    conexion = await Database.obtenerConexion();

    // Inserta el nuevo pedido en la tabla 'pedidos'
    const pedidoQuery = `
            INSERT INTO pedidos (idCliente, direccion, FechaPedido, Total, EstadoPedido)
            VALUES (?, ?, ?, ?, ?)
        `;
    const [pedidoResult] = await conexion.execute(pedidoQuery, [
      idCliente,
      direccion,
      FechaPedido,
      Total,
      EstadoPedido
    ]);
console.log(productosSeleccionados)
    // ID del pedido recién insertado
    const idPedido = pedidoResult.insertId;

    // Inserta cada producto del pedido en la tabla de detalle (por ejemplo, 'detalle_pedido')
    const detalleQuery = `
            INSERT INTO detallepedido (idPedido, idProducto, cantidad, precioUnitario, subtotal)
            VALUES (?, ?, ?, ?, ?)
        `;

    // Recorrer los productos seleccionados y agregar cada uno al detalle del pedido
    for (const producto of productosSeleccionados) {
      
      await conexion.execute(detalleQuery, [
        idPedido,
        producto.idProducto,
        producto.cantidad,
        producto.precio,
        producto.precio * producto.cantidad,
        
      ]);
    }

    res
      .status(201)
      .json({ message: "Pedido registrado exitosamente", idPedido });
  } catch (error) {
    console.error("Error al registrar el pedido:", error);
    res
      .status(500)
      .json({
        message: "Hubo un error al registrar el pedido",
        error: error.message,
      });
  } finally {
    // Asegúrate de cerrar la conexión si se abrió
    // if (conexion) {
    //   await conexion.end();
    // }
  }
});

// ENDPOINT PARA OBTENER LOS DETALLES DE UN PEDIDO
router.get("/:idPedido", async (req, res) => {
  const { idPedido } = req.params;
  try {
    const conexion = await Database.obtenerConexion();
    const [detalles] = await conexion.query(
      `SELECT dp.idDetallePedido, dp.idPedido, p.idProducto, p.Nombre, dp.cantidad, dp.precioUnitario, dp.subtotal 
        FROM DetallePedido dp 
        left join productos p
          on dp.idProducto = p.idProducto
        WHERE dp.idPedido = ?`,
      [idPedido]
    );
    
    res.json(detalles);
  } catch (error) {
    console.error("Error al obtener los detalles del pedido:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los detalles del pedido" });
  }
});

router.put('/modificar/:idPedido',(req,res)=>{
  const {idPedido} = req.params;
  const {idCliente, direccion, FechaPedido, Total, EstadoPedido} = req.body;

  const conexion = Database.obtenerConexion();
  console.log("entro a modificar", idCliente, direccion, FechaPedido, Total, EstadoPedido)

    const detalleActlizacion = conexion.query('UPDATE pedidos SET idCliente = ?, direccion = ?, FechaPedido = ?, Total = ?, EstadoPedido = ? WHERE idPedido = ?',
    [idCliente, direccion, FechaPedido, Total, EstadoPedido, idPedido])

    if(!detalleActlizacion){
      console.error('Error al modificar el pedido:', error);
      res.status(500).json({error: 'Error al modificar el pedido'});
    }else{
      res.status(200).json({message: 'Pedido modificado con exito'});
    }
  
  
})

router.put('/modificarDetalle/:idPedido',(req,res)=>{
  const {idPedido} = req.params;
  const {idProducto, cantidad, precioUnitario, subtotal} = req.body
  const conexion = Database.obtenerConexion();

  try {
    conexion.query('UPDATE detallepedido SET idProducto = ?, cantidad = ?, precioUnitario = ?, subtotal = ? WHERE idPedido = ?',
    [idProducto, cantidad, precioUnitario, subtotal, idPedido],
    (error, result)=>{
      if(error){
        console.error('Error al modificar el detalle:', error);
        res.status(500).json({error: 'Error al modificar el detalle'});
      }else{
        res.status(200).json({message: 'Detalle modificado con exito'});
      }
    })
  } catch (error) {
    console.error("error al modificar detalle", error)
  }
})

// ENDPOINT PARA FILTRAR LOS PEDIDOS POR NOMBRE DEL CLIENTE
router.get("/filtrar/:nombreCliente", async (req, res) => {
  const { nombreCliente } = req.params;
  try {
    const conexion = await Database.obtenerConexion();
    const [pedidos] = await conexion.query(
      `SELECT p.idPedido, c.idCliente, c.Nombre, p.FechaPedido, p.total, p.EstadoPedido, p.direccion
       FROM pedidos p
        LEFT JOIN clientes c
          ON c.idCliente = p.idCliente
        WHERE c.Nombre LIKE ?`,
      [`%${nombreCliente}%`]
    );

    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    res.status(500).json({ error: "Error al obtener los pedidos" });
  }
});



module.exports = router;
