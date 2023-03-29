const { response, request } = require('express');
const { StatusCodes } = require('http-status-codes')
const { conectDB } = require('../conectDB/conectDB')
const bcrypt = require('bcrypt')

const getUserModel = require('../models/modelUsuario');
 

const registroPost= async (req = request, res = response) => {

    await conectDB();
    const UsuarioModel = getUserModel();

    const { username, password, name } = req.body;
  
    if (!username) {
        return res.status(StatusCodes.BAD_REQUEST).json( {
            error: `El nombre de usuario es requerido`
        });
    }

    var isEmailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!isEmailRegExp.test(username)) {
        return res.status(StatusCodes.BAD_REQUEST).json( {
            error: 'El nombre de usuario debe ser un correo electrónico'
        });
    }

    if (!password) {
        return res.status(StatusCodes.BAD_REQUEST).json( {
            error: 'La contraseña es requerida'
        });
    }

    if (!name) {
        return res.status(StatusCodes.BAD_REQUEST).json( {
            error: 'El nombre es requerido'
        });
    }

    const usuarioExistente = await UsuarioModel.findOne({ username });

    if (usuarioExistente?.username) {
        return res.status(StatusCodes.BAD_REQUEST).json( {
            error: 'El nombre de usuario no está disponible'
        });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const nuevoUsuario = new UsuarioModel({
        username,
        password: hashedPassword,
        name,
        productos: []
    })

    await nuevoUsuario.save();

    res.json({
        message: `Usuario ${username} registrado con exito` 
    })
}

module.exports = registroPost