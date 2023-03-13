const { StatusCodes } = require('http-status-codes')

function verificarCampoRequerido(valor, mensaje) {
    if (!valor) {
        throw new WebError(mensaje, StatusCodes.BAD_REQUEST)
    }
}

module.exports = {
    verificarCampoRequerido
}