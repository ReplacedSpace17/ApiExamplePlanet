const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Puerto en el que se ejecutará el servidor

// Datos de los planetas (puedes usar el JSON proporcionado o cargarlos desde un archivo)
const planetas = require('./planetas.json');

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

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
