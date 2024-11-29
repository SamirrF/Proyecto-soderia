const mysql = require('mysql2/promise');

const conexion = mysql.createPool({
    host: 'localhost',
    database: 'DBsoderia',
    user: 'root',
    password: 'samir123',
    port:'3306'
})

const obtenerConexion = ()=> {
    return conexion};
module.exports = {
    obtenerConexion
}