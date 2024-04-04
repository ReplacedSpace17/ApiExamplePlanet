const express = require('express');
const app = express();
const PORT =  3000; // Puerto en el que se ejecutará el servidor

const { Pool } = require('pg');

// Datos de los planetas (puedes usar el JSON proporcionado o cargarlos desde un archivo)
const planetas = require('./planetas.json');


// Configuración de la conexión a la base de datos
const database = new Pool({
  user: 'rs17',
  host: 'apps-posgrado-database.postgres.database.azure.com',
  database: 'glucontroldb',
  password: 'Javier117',
  port: 5432, // Puerto por defecto de PostgreSQL
  ssl: true
});



// Ruta para obtener todos los planetas
app.get('/planetas', (req, res) => {
  res.json(planetas);
});
app.get('/hola', (req, res) => {
  res.send('Hola mundo');
  
});




// Ruta para obtener datos de la base de datos
app.get('/usuarios', async (req, res) => {
  try {
    const client = await database.connect();
    const result = await client.query('SELECT * FROM users'); // Query de ejemplo
    const results = { 'results': (result) ? result.rows : null };
    res.json(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});








/*
const { Login } = require('./Module2/Module2Function');
//////- login
app.post('/api/Module2/Login', async (req, res) => {
  //Método para registrar al usuario
  const formData = req.body;
  const UID = await Login(req, res, formData);
  UID_Session.setGlobalUid(UID);
  //console.log(UID_Session.getGlobalUid());
});

*/





// Iniciar el servidor
const os = require('os');

// Obtener la dirección IP local del servidor
const interfaces = os.networkInterfaces();
let localIpAddress = '';
Object.keys(interfaces).forEach((iface) => {
  interfaces[iface].forEach((details) => {
    if (details.family === 'IPv4' && !details.internal) {
      localIpAddress = details.address;
    }
  });
});

// Iniciar el servidor
const server = app.listen(PORT, localIpAddress, () => {
  console.log(`Servidor corriendo en http://${localIpAddress}:${PORT}`);
});
