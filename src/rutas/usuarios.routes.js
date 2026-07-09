const router = require('express').Router();
const ctrl = require('../controladores/usuarios.controller');

router.post('/login', ctrl.login);

module.exports = router;