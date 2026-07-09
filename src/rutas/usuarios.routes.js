const router = require('express').Router();
const ctrl = require('../controladores/usuarios.controller');

router.post('/login', ctrl.login);
router.post('/registro', ctrl.registro);
router.get('/', ctrl.listarUsuarios);


module.exports = router;