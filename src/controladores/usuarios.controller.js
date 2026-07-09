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