const pool = require('../db');

exports.listarGastos = async (req, res) => {
  const { id_usuario } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM gastos WHERE id_usuario = $1 ORDER BY fecha DESC',
      [id_usuario]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al listar gastos' });
  }
};

exports.crearGasto = async (req, res) => {
  const { descripcion, monto, fecha, estado, id_usuario, id_categoria } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO gastos (descripcion, monto, fecha, estado, id_usuario, id_categoria)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [descripcion, monto, fecha, estado, id_usuario, id_categoria]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear gasto' });
  }
};

exports.actualizarGasto = async (req, res) => {
  const { id } = req.params;
  const { descripcion, monto, fecha, estado, id_categoria } = req.body;
  try {
    const result = await pool.query(
      `UPDATE gastos SET descripcion=$1, monto=$2, fecha=$3, estado=$4, id_categoria=$5
       WHERE id_gasto=$6 RETURNING *`,
      [descripcion, monto, fecha, estado, id_categoria, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Gasto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar gasto' });
  }
};

exports.eliminarGasto = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM gastos WHERE id_gasto = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar gasto' });
  }
};