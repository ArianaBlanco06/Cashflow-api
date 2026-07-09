const router = require('express').Router();
const ctrl = require('../controladores/facturas.controller');

router.get('/', ctrl.listarFacturas);
router.post('/', ctrl.crearFactura);
router.put('/:id', ctrl.actualizarFactura);
router.delete('/:id', ctrl.eliminarFactura);

module.exports = router;