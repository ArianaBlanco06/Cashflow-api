const router = require('express').Router();
const ctrl = require('../controladores/categorias.controller');

router.get('/', ctrl.listarCategorias);
router.post('/', ctrl.crearCategoria);
router.delete('/:id', ctrl.eliminarCategoria);

module.exports = router;