const {request, response} = require('express');

const vistaRegistro = (req , res = response) => {
    res.render('formulario-registrar-usuario');
};

module.exports = {
    vistaRegistro
}