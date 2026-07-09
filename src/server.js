const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de Gestor de Gastos funcionando 🚀');
});

app.use('/api/gastos', require('./rutas/gastos.routes'));
app.use('/api/categorias', require('./rutas/categorias.routes'));
app.use('/api/recordatorios', require('./rutas/recordatorios.routes'));
app.use('/api/metas', require('./rutas/metas.routes'));
app.use('/api/usuarios', require('./rutas/usuarios.routes'));

app.listen(process.env.PORT, () => {
  console.log(`API corriendo en puerto ${process.env.PORT}`);
});