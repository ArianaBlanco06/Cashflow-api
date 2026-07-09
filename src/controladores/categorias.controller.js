const pool = require('../db');

exports.listarCategorias = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias ORDER BY nombre_categoria');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al listar categorías' });
  }
};

exports.crearCategoria = async (req, res) => {
  const { nombre_categoria } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categorias (nombre_categoria) VALUES ($1) RETURNING *',
      [nombre_categoria]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear categoría' });
  }
};

exports.eliminarCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM categorias WHERE id_categoria = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar categoría' });
  }
};