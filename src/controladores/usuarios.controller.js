const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { usuario, clave } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = $1',
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario o clave incorrectos' });
    }

    const user = result.rows[0];
    const coincide = await bcrypt.compare(clave, user.clave);

    if (!coincide) {
      return res.status(401).json({ mensaje: 'Usuario o clave incorrectos' });
    }

    const token = jwt.sign(
      { id: user.id_usuario, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id: user.id_usuario,
        nombre: user.nombre,
        usuario: user.usuario,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

exports.registro = async (req, res) => {
  const { nombre, usuario, clave } = req.body;
  try {
    const existe = await pool.query('SELECT id_usuario FROM usuarios WHERE usuario = $1', [usuario]);
    if (existe.rows.length > 0) {
      return res.status(409).json({ mensaje: 'Este usuario ya existe' });
    }

    const hash = await bcrypt.hash(clave, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, usuario, clave, rol, estado)
       VALUES ($1, $2, $3, 'usuario', 'activo') RETURNING id_usuario, nombre, usuario, rol, estado`,
      [nombre, usuario, hash]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_usuario, nombre, usuario, correo, rol, estado, ultimo_acceso FROM usuarios ORDER BY nombre'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al listar usuarios' });
  }
};

exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, rol, estado } = req.body;
  try {
    const result = await pool.query(
      `UPDATE usuarios SET nombre=$1, correo=$2, rol=$3, estado=$4
       WHERE id_usuario=$5 RETURNING id_usuario, nombre, usuario, correo, rol, estado, ultimo_acceso`,
      [nombre, correo, rol, estado, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
};

exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
};