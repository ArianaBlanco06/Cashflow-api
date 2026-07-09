const pool = require('../db');

exports.listarFacturas = async (req, res) => {
  const { id_usuario } = req.query;
  try {
    const result = await pool.query(
      `SELECT f.*, c.nombre_cliente, cat.nombre_categoria
       FROM facturas f
       LEFT JOIN clientes c ON f.id_cliente = c.id_cliente
       LEFT JOIN categorias cat ON f.id_categoria = cat.id_categoria
       WHERE f.id_usuario = $1
       ORDER BY f.fecha DESC`,
      [id_usuario]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al listar facturas' });
  }
};

exports.crearFactura = async (req, res) => {
  const {
    numero, descripcion, subtotal, igv, total, estado, fecha,
    id_usuario, id_categoria, id_cliente
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO facturas
        (numero, descripcion, subtotal, igv, total, estado, fecha, id_usuario, id_categoria, id_cliente)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [numero, descripcion, subtotal, igv, total, estado, fecha, id_usuario, id_categoria, id_cliente]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear factura' });
  }
};

exports.actualizarFactura = async (req, res) => {
  const { id } = req.params;
  const {
    numero, descripcion, subtotal, igv, total, estado, fecha, id_categoria, id_cliente
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE facturas SET
        numero=$1, descripcion=$2, subtotal=$3, igv=$4, total=$5,
        estado=$6, fecha=$7, id_categoria=$8, id_cliente=$9
       WHERE id_factura=$10 RETURNING *`,
      [numero, descripcion, subtotal, igv, total, estado, fecha, id_categoria, id_cliente, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Factura no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar factura' });
  }
};

exports.eliminarFactura = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM facturas WHERE id_factura = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar factura' });
  }
};