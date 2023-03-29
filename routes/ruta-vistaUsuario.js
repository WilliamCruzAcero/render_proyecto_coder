const {Router} = require('express');
const {vistaInicio} = require('../controllers/ruta-vistaUsuario');

const routes = Router();

    routes.get('/', vistaInicio)
    
    
    
module.exports = routes;