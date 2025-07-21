 const express = require('express');
 const axios = require('axios'); 
const cors = require('cors'); 
const mongoose = require('mongoose');
const PeliculasRouter = require('./routers/Peliculas');
require('dotenv').config(); 




const app = express(); 

app.use(cors()); 
app.use(express.json()); 
// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅Conectado a MongoDB Atlas'))
    .catch(err => console.error('❌Error al conectar a MongoDB:', err));

// Usar la ruta de películas
app.use('/api/peliculas', PeliculasRouter);

// ruta de /api/recomendaciones


const PORT = 4000; 
app.post('/api/recomendaciones', async (req, res) => {
 const { prompt } = req.body;
 try {
 const response = await axios.post(
 'https://openrouter.ai/api/v1/chat/completions',
 {
 model: 'mistralai/mistral-7b-instruct',
 messages: [{ role: 'user', content: prompt }],
 },
 {
 headers: {
 Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
 'Content-Type': 'application/json',
 },
 }
 );
 const recomendacion = response.data.choices[0].message.content;
 res.json({ recomendacion });
 } catch (error) {
 console.error('Error en la API:', error.response?.data || error.message);
 res.status(500).json({ error: 'Error en el servidor proxy' });
 }
 });

 
 
 
 
 app.get('/api/test-mongo', async (req, res) => {
  try {
    const peliculas = await PeliculasRouter.find(); // Suponiendo que usas un modelo llamado Pelicula
    res.json(peliculas);
  } catch (error) {
    console.error('Error al consultar MongoDB:', error);
    res.status(500).json({ error: 'No se pudo obtener datos de MongoDB' });
  }
});

//app.listen(4000, () => console.log('Servidor corriendo en http://localhost:4000'));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
