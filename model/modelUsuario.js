const mongoose = require('mongoose')

const getUserModel = () => {

    const usuarioSchema = new mongoose.Schema({

        username: String,
        password: String,
        name: String,
        productos: [{
            nombre: String,
            precio: Number,
            imagen: String,
            cantidad: Number
        }]
    });

    return mongoose.model('usuarios', usuarioSchema);

}

module.exports = {
    getUserModel
}