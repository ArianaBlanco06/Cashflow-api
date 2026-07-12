const pool = require('../db');

exports.listarMetas = async (req, res) => {
  const { id_usuario } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM metas_mensuales WHERE id_usuario = $1 ORDER BY anio DESC, mes DESC',
      [id_usuario]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al listar metas' });
  }
};

exports.crearMeta = async (req, res) => {
  const { monto_meta, mes, anio, id_usuario } = req.body;
  try {
    // Si ya existe una meta para ese usuario/mes/año, actualizarla
    const existente = await pool.query(
      'SELECT * FROM metas_mensuales WHERE id_usuario = $1 AND mes = $2 AND anio = $3',
      [id_usuario, mes, anio]
    );

    if (existente.rows.length > 0) {
      const result = await pool.query(
        'UPDATE metas_mensuales SET monto_meta = $1 WHERE id_meta = $2 RETURNING *',
        [monto_meta, existente.rows[0].id_meta]
      );
      return res.json(result.rows[0]);
    }

    const result = await pool.query(
      `INSERT INTO metas_mensuales (monto_meta, mes, anio, id_usuario)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [monto_meta, mes, anio, id_usuario]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear meta' });
  }
};

exports.actualizarMeta = async (req, res) => {
  const { id } = req.params;
  const { monto_meta, mes, anio } = req.body;
  try {
    const result = await pool.query(
      `UPDATE metas_mensuales SET monto_meta=$1, mes=$2, anio=$3
       WHERE id_meta=$4 RETURNING *`,
      [monto_meta, mes, anio, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Meta no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar meta' });
  }
};

exports.eliminarMeta = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM metas_mensuales WHERE id_meta = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar meta' });
  }
};