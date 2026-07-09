const pool = require('../db');

exports.listarRecordatorios = async (req, res) => {
  const { id_usuario } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM recordatorios WHERE id_usuario = $1 ORDER BY fecha_limite',
      [id_usuario]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al listar recordatorios' });
  }
};

exports.crearRecordatorio = async (req, res) => {
  const { descripcion, fecha_limite, completado, id_usuario, id_categoria } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO recordatorios (descripcion, fecha_limite, completado, id_usuario, id_categoria)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [descripcion, fecha_limite, completado ?? 0, id_usuario, id_categoria]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear recordatorio' });
  }
};

exports.actualizarRecordatorio = async (req, res) => {
  const { id } = req.params;
  const { descripcion, fecha_limite, completado, id_categoria } = req.body;
  try {
    const result = await pool.query(
      `UPDATE recordatorios SET descripcion=$1, fecha_limite=$2, completado=$3, id_categoria=$4
       WHERE id_recordatorio=$5 RETURNING *`,
      [descripcion, fecha_limite, completado, id_categoria, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Recordatorio no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar recordatorio' });
  }
};

exports.eliminarRecordatorio = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM recordatorios WHERE id_recordatorio = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar recordatorio' });
  }
};