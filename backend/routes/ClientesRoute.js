const express = require('express');
const router = express.Router();
const Database = require ('../db');


//OBTENER LOCALIDADES
router.get("/localidades", async (req, res) => {
  const conexion = await Database.obtenerConexion();
  const [resultado] = await conexion.query(`SELECT * FROM localidades`);
  console.log(resultado);
  res.json(resultado);
});

//TRAER LISTA COMPLETA
router.get("/", async (req, res) => {
  const conexion = await Database.obtenerConexion();
  const [resultado] = await conexion.query(`SELECT c.idCliente,c.Nombre,c.Direccion,c.Localidad,l.nombreLocalidad, c.Estado
                                            FROM clientes c
                                            LEFT JOIN localidad l
                                             ON c.Localidad = l.idLocalidad
                                            ORDER BY c.idCliente;`);
  console.log(resultado);
  res.json(resultado);
});

// TRAER CLIENTE ESPECÍFICO
router.get("/:id", async (req, res) => {
  let idCliente = req.params.id
  const conexion = await Database.obtenerConexion();
  const [resultado] = await conexion.query(`SELECT c.idCliente,c.Nombre,c.Direccion,c.Localidad,l.nombreLocalidad 
                                            FROM clientes c
                                            LEFT JOIN localidad l
                                            ON c.Localidad = l.idLocalidad WHERE idCliente = ?`, [idCliente]);
  console.log(resultado);
  res.json(resultado);
});

// AGREGAR UN NUEVO CLIENTE
router.post("/", async(req,res)=>{
 let cliente = req.body; 
 console.log(req.body);
 const conexion = await Database.obtenerConexion();
 const [resultado] = await conexion.query(`INSERT INTO clientes (Nombre, Direccion, Localidad, Estado)
                                            VALUES (?, ?, ?,1)`,[cliente.nombre,cliente.direccion,cliente.localidad]);
  console.log(resultado);
  res.json(resultado);

})

//MOSTRAR LOS CLIENTES PARA EL SELECT DINAMICO
// Ruta para obtener la lista de clientes
router.get('/clientes', (req, res) => {
  const query = "SELECT id, nombre FROM clientes"; // Selecciona los campos que necesitas
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los clientes para el select:', err);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results); // Enviar los datos de clientes como respuesta JSON
    }
  });
});

// TRAER CLIENTES ACTIVOS
router.get("/clientes/activos", async (req, res) => {
  try {
    const conexion = await Database.obtenerConexion();
    console.log("Conexión obtenida exitosamente.");
    const [resultado] = await conexion.query(`SELECT c.idCliente, c.Nombre, c.Direccion, c.Localidad, l.nombreLocalidad, c.Estado
                                             FROM clientes c
                                             LEFT JOIN localidad l ON c.Localidad = l.idLocalidad
                                             WHERE c.Estado = 1;`);
    console.log("Resultado de la consulta:", resultado);
    if (resultado.length === 0) {
      console.log("No se encontraron clientes activos.");
    }
    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener clientes activos:", error);
    res.status(500).json({ error: "Error al obtener clientes activos" });
  }
});

///ENDPOINT PARA MODIFICAR CLIENTE
router.put("/:id", async (req, res) => {
  let idCliente = req.params.id;
  let cliente = req.body;
  const conexion = await Database.obtenerConexion();
  const [resultado] = await conexion.query(
    `UPDATE clientes SET Nombre = ?, Direccion = ?, Localidad = ? WHERE idCliente = ?`,
    [cliente.nombre, cliente.direccion, cliente.localidad, idCliente]
  );
  console.log(resultado);
  res.json(resultado);
});

///ENDPOINT PARA CAMBIAR ESTADO CLIENTE
router.put("/estado/:id", async (req, res) => {
  let idCliente = req.params.id;
  console.log("tipo",typeof(idCliente));
  let estado = req.body;
  console.log("estado",estado.estado);
  const conexion = await Database.obtenerConexion();
  const [resultado] = await conexion.query(
    `UPDATE clientes SET Estado = ? WHERE idCliente = ?;`,
    [estado.estado,Number(idCliente)]
  );
  console.log(resultado);
  res.json(resultado);
});

module.exports=router;