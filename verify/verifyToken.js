const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

const secret = process.env.SECRET;

function verifyToken(req, res, next) {
    const token = req.headers.authorization ?? req.query.token;
    

    if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).send('No se proporcionó un token de autenticación');
        return;
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.secret = decoded;
        next();
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).send('Token de autenticación no válido');
    }

}

module.exports = {
    verifyToken
}