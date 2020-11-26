const { request, response } = require('express');
const passport = require('passport');
const usuariosU=require('../models/usuarios');
const crypto=require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const enviarEmail = require('../handlers/email');
const bcrypt = require('bcrypt-nodejs');

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/perfil',
    failureRedirect:'/Login',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos Son Obligatorios!'
});

exports.usuarioAutenticado = (request, response, next)=>{
    if(request.isAuthenticated()){
        return next();
    }

    return response.redirect('/Login');
}

exports.cerrarSesion = (request, response)=>{ 
   request.session.destroy(()=>{
        response.redirect('/');
    });
 
}
exports.enviarToken=async(request,response)=>{

  
    const usuario=await usuariosU.findOne({where:{email:request.body.emailUsuario}});

    if(!usuario){
        request.flash('error', 'No existe la cuenta');
        /*response.render('restablecer',{
            nombrePagina:'Recuperar password',
            mensajes:request.flash()
        })*/
        response.redirect('/restablecer');
    }

    usuario.token=crypto.randomBytes(20).toString('hex');

    usuario.expiracion= Date.now()+3600000;

    await usuario.save();

    const resetUrl= `http://${request.headers.host}/restablecer/${usuario.token}`;

    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecer-password'
    });

    request.flash('correcto','Se ha enviado un Mensaje a tu correo');
    response.redirect('/Login');

}

exports.resetPassword = async(request, response)=>{

   // response.json(request.params.token);
    const usuario = await usuariosU.findOne({
        where:{token:request.params.token}
    });

    //console.log(usuario);

    if(!usuario){
        request.flash('error','No es Válido el Token');
        response.redirect('/restablecer');
    }

    response.render('resetPassword',{
        nombrePagina: 'Restablecer Password!'
    });

}

exports.actualizarPassword = async(request, response)=>{
    //console.log(request.params.token);
    const usuario = await usuariosU.findOne({
        where:{
            token:request.params.token,
            expiracion:{
                [Op.gte]:Date.now()
            }
        }

    });
    if(!usuario){
        request.flash('error','No válido.. Excedió la Fecha y Hora');
        response.redirect('/restablecer');
    }

    usuario.contraseña = bcrypt.hashSync(request.body.passwordUsuario, bcrypt.genSaltSync(10));

    usuario.token = null;

    usuario.expiracion = null;

    await usuario.save();

    request.flash('correcto','Haz cambiado tu Password');

    response.redirect('/Login');
}

