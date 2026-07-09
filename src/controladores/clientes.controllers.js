const pool = require('../db');

exports.listarClientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY nombre_cliente');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al listar clientes' });
  }
};

exports.crearCliente = async (req, res) => {
  const { ruc, nombre_cliente } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO clientes (ruc, nombre_cliente) VALUES ($1, $2) RETURNING *',
      [ruc, nombre_cliente]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear cliente' });
  }
};

exports.eliminarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM clientes WHERE id_cliente = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar cliente' });
  }
};