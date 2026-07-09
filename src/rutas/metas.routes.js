const router = require('express').Router();
const ctrl = require('../controladores/metas.controller');

router.get('/', ctrl.listarMetas);
router.post('/', ctrl.crearMeta);
router.put('/:id', ctrl.actualizarMeta);
router.delete('/:id', ctrl.eliminarMeta);

module.exports = router;