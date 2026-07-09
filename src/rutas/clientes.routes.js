const router = require('express').Router();
const ctrl = require('../controladores/clientes.controller');

router.get('/', ctrl.listarClientes);
router.post('/', ctrl.crearCliente);
router.delete('/:id', ctrl.eliminarCliente);

module.exports = router;