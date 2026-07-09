const router = require('express').Router();
const ctrl = require('../controladores/gastos.controller');

router.get('/', ctrl.listarGastos);
router.post('/', ctrl.crearGasto);
router.put('/:id', ctrl.actualizarGasto);
router.delete('/:id', ctrl.eliminarGasto);

module.exports = router;