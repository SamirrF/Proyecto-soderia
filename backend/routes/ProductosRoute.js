const express = require('express');
const router = express.Router();
const Database = require ('../db');

//ENDPOINT PARA PRODUCTOS
router.get("/disponibles", async (req, res) => {
    try {
        const conexion = await Database.obtenerConexion();  // Obtener la conexión de la base de datos
        const [productos] = await conexion.query(`
                                                    SELECT idProducto, nombre, Estado, precio
                                                    FROM productos 
                                                    WHERE estado = 1;
                                                `);

        console.log('Productos disponibles:', productos);  // Agrega esto para depuración

        // Verificar si hay productos y devolverlos en la respuesta
        if (productos.length > 0) {
            res.json(productos);  // Enviar los productos como respuesta JSON
        } else {
            res.status(404).json({ message: 'No hay productos disponibles' });
        }

    } catch (error) {
        console.error('Error al obtener los productos:', error);  // Mostrar el error
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
});




module.exports = router;