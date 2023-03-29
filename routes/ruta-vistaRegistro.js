const {Router} = require('express');
const { vistaRegistro } = require('../controllers/ruta-vistaregistro');


const routes = Router();

    routes.get('/user', vistaRegistro)
    
    
    
module.exports = routes;