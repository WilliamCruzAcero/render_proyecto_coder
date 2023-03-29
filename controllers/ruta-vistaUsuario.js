const {request, response} = require('express');

const vistaInicio = (req , res = response) => {
    res.render('formulario-inicio-sesion');
};

module.exports = {
    vistaInicio,
}