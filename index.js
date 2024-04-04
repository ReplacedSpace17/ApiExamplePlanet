const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
// Enable CORS for all routes
app.use(cors());
// Configurar bodyParser para analizar el cuerpo de las solicitudes POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




const PORT =  7000; // Puerto en el que se ejecutará el servidor


const { Pool } = require('pg');







// Datos de los planetas (puedes usar el JSON proporcionado o cargarlos desde un archivo)
const planetas = require('./planetas.json');

const UID_Session = require('./variablesGlobales');
const { Login } = require('./Module2/Module2Function');
//////- login
app.post('/api/Module2/Login', async (req, res) => {
  //Método para registrar al usuario
  const formData = req.body;
  const UID = await Login(req, res, formData);
  UID_Session.setGlobalUid(UID);
  //console.log(UID_Session.getGlobalUid());
});





// Ruta para obtener todos los planetas
app.get('/planetas', (req, res) => {
  res.json(planetas);
});
app.get('/hola', (req, res) => {
  res.send('Hola mundo');
  
});

// Ruta para obtener un planeta por su nombre
app.get('/planetas/:nombre', (req, res) => {
  const nombre = req.params.nombre;
  const planeta = planetas.find(planeta => planeta.nombre.toLowerCase() === nombre.toLowerCase());

  if (!planeta) {
    return res.status(404).json({ mensaje: 'Planeta no encontrado' });
  }
  console.log(planeta);
  console.log(nombre);
  res.json(planeta);
});





// Configuración de la conexión a la base de datos
const pool = new Pool({
  user: 'rs17',
  host: 'apps-posgrado-database.postgres.database.azure.com',
  database: 'glucontroldb',
  password: 'Javier117',
  port: 5432, // Puerto por defecto de PostgreSQL
  ssl: true

});

//
// Ruta para obtener datos de la base de datos
app.get('/usuarios', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users'); // Query de ejemplo
    const results = { 'results': (result) ? result.rows : null };
    res.json(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});









// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
