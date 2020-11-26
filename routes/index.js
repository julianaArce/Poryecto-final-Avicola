const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ProyectosController = require('../controllers/ProyectosController');
const PedidosController = require('../controllers/ControllerPedidos');
const authController =require('../controllers/authController');

module.exports = function () {
    router.get('/', ProyectosController.ProyectosHome);
    router.get('/UsuariosNuevos', ProyectosController.Registro);
    router.post('/UsuariosNuevos', 
    body('nombreUsuario').not().isEmpty().trim().escape(),
    ProyectosController.UsuariosNuevos);
    router.get('/mostrarDatos', ProyectosController.Cuenta);
    //router.get('/cuenta', ProyectosController.MiCuenta);
    router.get('/perfil', ProyectosController.MiCuenta);
    router.get('/datosPerfil/:url', ProyectosController.datosPerfil);
    router.get('/ListaClientes', ProyectosController.listadoClientes);
    router.get('/perfilUsuarios/ActualizarUsuario/:url',authController.usuarioAutenticado, ProyectosController.clienteporUrl);
    router.post('/perfilUsuarios/ActualizarUsuario/:url',authController.usuarioAutenticado, ProyectosController.clienteEditar);
    


    router.delete('/perfilUsuario/ActualizarUsuario/:url',authController.usuarioAutenticado, ProyectosController.eliminarCliente);

    router.get('/Registrarpedido/:url', authController.usuarioAutenticado, PedidosController.Pedidos);
    router.post('/Registrarpedido/:url',authController.usuarioAutenticado, PedidosController.RegistrarPedidos );

    router.get('/ListaPedidos/:url',authController.usuarioAutenticado, PedidosController.ListarPedidos);

    router.get('/Barra', ProyectosController.BarraLateral);

    router.patch('/ListaPedidos/:id',authController.usuarioAutenticado, PedidosController.cambiarEstadoPedido);
    router.delete('/ListaPedidos/:id',authController.usuarioAutenticado, PedidosController.eliminarPedido);

    router.get('/Login', ProyectosController.iniciarSesion);
    router.post('/Login', authController.autenticarUsuario);

    router.get('/restablecer', ProyectosController.formRestablecerPassword);
    router.post('/restablecer', authController.enviarToken);
    router.get('/restablecer/:token', authController.resetPassword);
    
    router.get('/cerrar-sesion', authController.cerrarSesion);
    router.post('/restablecer/:token', authController.actualizarPassword);
    router.get('/confirmar/:correo', ProyectosController.confirmarCuenta);

    return router;
}