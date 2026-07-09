const router = require('express').Router();
const ctrl = require('../controladores/recordatorios.controller');

router.get('/', ctrl.listarRecordatorios);
router.post('/', ctrl.crearRecordatorio);
router.put('/:id', ctrl.actualizarRecordatorio);
router.delete('/:id', ctrl.eliminarRecordatorio);

module.exports = router;