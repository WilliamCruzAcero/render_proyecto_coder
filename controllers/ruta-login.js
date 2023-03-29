require('dotenv').config();
const {request, response} = require('express');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserModel } = require('../models/modelUsuario');
const WebError = require('../models/webError');

const login = async (req = request, res = response) => {

        const secret = process.env.SECRET;
        const UsuarioModel = getUserModel

        const { username, password } = req.body;
        let user;

        try {
            if (!username) {
                throw new WebError('El nombre de usuario es requerido', StatusCodes.BAD_REQUEST)
            }

            if (!password) {
                throw new WebError('La contraseña es requerida', StatusCodes.BAD_REQUEST)
            }

            user = await UsuarioModel.findOne({ username });

            if (!user?.username) {
                throw new WebError('El usuario no esta registrado', StatusCodes.UNAUTHORIZED);
            }

            const hashedPassword = user.password;
            const isCorrectPassword = await bcrypt.compare(password, hashedPassword)

            if (!isCorrectPassword) {
                throw new WebError('El nombre de usuario o contraseña es incorrecta',  StatusCodes.UNAUTHORIZED);
            }

        } catch (error) {
            return res.status(error.status).json({
                error: error.message
            })           
        }

        const tokenBody = {
            username: user.username,
            name: user.name            
        }

        const token = jwt.sign(tokenBody, secret, { expiresIn: '1h' });

        res.json({ token });

    };

module.exports = {
    login
}