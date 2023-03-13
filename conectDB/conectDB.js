const mongoose = require('mongoose')

const conectDB = async () => {
    try {
        await mongoose.connect( process.env.MONGO_CONN_STR, {
            serverSelectionTimeoutMS: 60 * 1000,
        })
        console.log('Base de datos conectada');
    } catch (error) {
        console.log('Error en la conexion a la base de datos' + error);
    }
}

module.exports = {
    conectDB
}