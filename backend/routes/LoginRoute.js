const express = require('express');
const router = express.Router();
const Database = require('../db');

// Ruta para el login
router.post('/', async (req, res) => {
    const { Email, password } = req.body;

    // Validar que los campos no estén vacíos
    if (!Email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    try {
        // Consulta a la base de datos
        const query = 'SELECT * FROM usuario WHERE Email = ? AND password = ?';
        const [results] = await Database.obtenerConexion().execute(query, [Email, password]);

        if (results.length > 0) {
            // Si las credenciales son correctas
            return res.status(200).json({ 
                message: 'Login exitoso', 
                redirect: './interfazUsuario.html' 
            });
        } else {
            // Credenciales incorrectas
            return res.status(401).json({ error: 'Usuario o contraseña incorrecta' });
        }
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
