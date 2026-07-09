const router = require('express').Router();
const ctrl = require('../controladores/usuarios.controller');

router.post('/login', ctrl.login);
router.post('/registro', ctrl.registro);
router.get('/', ctrl.listarUsuarios);
router.put('/:id', ctrl.actualizarUsuario);
router.delete('/:id', ctrl.eliminarUsuario);

module.exports = router;