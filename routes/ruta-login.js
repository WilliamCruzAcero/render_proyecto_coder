const {Router} = require('express');
const { login } = require('../controllers/ruta-login');


const routes = Router();

    routes.post('/login', login )
    
    
    
module.exports = routes;