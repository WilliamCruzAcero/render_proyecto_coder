// importar dependencias
require('dotenv').config();
const {fork} = require('child_process');
const mongoose = require('mongoose')
const express = require('express')
const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const compression = require('compression');

const WebError = require('./models/webError')
const { conectDB } = require('./conectDB/conectDB')
const { getUserModel } = require('./models/modelUsuario')
const { verificarCampoRequerido } = require('./verify/verifyCampo')
const { verifyToken } = require('./verify/verifyToken');

const secret = process.env.SECRET;

class Server {

    constructor (port) {
        this.app = express();
        this.port = port;
        this.vistaInicio = '/'
        this.vistaRegistro = '/'
        // this.login = '/'
        
    }

    async start() {
        
        await conectDB();
        const UsuarioModel = getUserModel();
        const gzip = compression();
        
        this.app.use(express.urlencoded({ extended: true}));
        this.app.use(express.json())
        
        this.app.use('/javascript', express.static(path.join(__dirname, 'public', 'javascript')))
        
        this.app.set('views', './views');
        this.app.set('view engine', 'ejs');
    
        this.app.use(this.vistaInicio, require('./routes/ruta-vistaUsuario'))
        this.app.use(this.vistaRegistro, require('./routes/ruta-vistaRegistro'))
        // this.app.use(this.login, require('./routes/ruta-login'))
      
        this.app.get('/info', (req, res) => {
    
            
                const serverInfo = 
            {
                path: process.cwd(),
                plataforma: process.platform,
                pid: process.pid,
                version: process.version,
                carpeta: process.title,
                memoria: process.memoryUsage.rss()
            }
    
            const dataNucleos = fork('./child/cpus.js')
            dataNucleos.send('start');
            dataNucleos.on('message', numNucleos => {
                res.render('mostrar-info', {
                    info: serverInfo,
                    numNucleos
                });
                
            })
        })  

        this.app.get('/infogzip', gzip, (req, res) => {
    
            
                const serverInfo = 
            {
                path: process.cwd(),
                plataforma: process.platform,
                pid: process.pid,
                version: process.version,
                carpeta: process.title,
                memoria: process.memoryUsage.rss()
            }
            
            const dataNucleos = fork('./child/cpus.js')
            dataNucleos.send('start');
            dataNucleos.on('message', numNucleos => {                              
                res.render('mostrar-info', {
                    info: serverInfo,
                    numNucleos
                });
                
            })
        })

        this.app.get('/api/random', (req, res) =>{
            
            const dataRandom = fork('./child/random.js')
            dataRandom.send('start');
            dataRandom.on('message', msg => {
                
                    let random = msg
                    res.render('mostrar-random', {
                    random
                
                    });
                
            })
        })        
        
        this.app.post('/user', async (req, res) => {
    
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
        });
        
        this.app.post('/login', async (req, res) => {
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
    
        });
    
        this.app.post('/logout', verifyToken , (req, res) => {
    
            const { name } = req.secret
    
            res.render('mensaje', { mensaje: `¡Hasta luego ${name}!` })
        
        });
    
        this.app.get('/productos', verifyToken, async (req, res) => {
    
            const { username, name } = req.secret
    
            const user = await UsuarioModel.findOne({ username });
    
            res.render('formulario-productos', {
                productos: user.productos,
                usuario: {
                    nombre: name,
                    username
                }
            });
        });
    
        this.app.post('/productos', verifyToken, async (req, res) => {
            const { username } = req.secret;
            const { nombre, precio, imagen, cantidad } = req.body;
    
            let err = 'Los siguientes campos son requeridos:'
            const camposFaltantes = []
    
            try {
                verificarCampoRequerido(nombre, `${err} Nombre`);
            } catch (error) {
                return res.status(error.status).json({error: error.message})
            }
    
            const user = await UsuarioModel.findOne({ username });
            const productoExistente = user.productos.find(producto => producto.nombre === nombre);
    
            if (productoExistente) {
    
                const posicionDelProducto = user.productos.indexOf(productoExistente);
    
                if (precio) productoExistente.precio = precio
                if (imagen) productoExistente.imagen = imagen
                if (cantidad) productoExistente.cantidad = cantidad
    
                user.productos[posicionDelProducto] = productoExistente;
    
            } else {
    
                try {
                    verificarCampoRequerido(precio);
                } catch (error) {
                    camposFaltantes.push('Precio')
                }
    
                try {
                    verificarCampoRequerido(imagen);
                } catch (error) {
                    camposFaltantes.push('Imagen')
                }
    
                try {
                    verificarCampoRequerido(cantidad);
                } catch (error) {
                    camposFaltantes.push('Cantidad')
                }
    
                if (camposFaltantes.length) {
                    err = err + ' ' + camposFaltantes.join(', ');
                    return res.status(StatusCodes.BAD_REQUEST).json({error: err})
                }
    
                user.productos.push({
                    nombre,
                    precio,
                    imagen,
                    cantidad
                })
            }
    
            await user.save()
    
            res.json({}); 
    
        })
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor ejecutandose en el puerto ${this.port}`);
        })
    }
}

module.exports = Server;
