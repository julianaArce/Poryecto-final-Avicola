const { request, response } = require("express")
const usuarios = require('../models/usuarios');
const slug = require('slug');
const enviarEmail = require('../handlers/email');

exports.BarraLateral = async (request, response) =>{
    
    response.render('Barralateral', {
        nombrePagina: 'Barra',
        
    });
};

exports.iniciarSesion = async (request, response) =>{
    const { error }= response.locals.mensajes;
    response.render('Login', {
        nombrePagina: 'Iniciar Sesion',
        error
    });
};
exports.ProyectosHome = async (request, response) =>{
    
    response.render('index', {
        nombrePagina: 'Avicola SMIK',
        
    });
};
exports.Registro = (request, response) => {

    response.render('UsuariosNuevos',{
        nombrePagina:'Usuarios Nuevos'
    });

    
}


exports.UsuariosNuevos = async (request, response) =>{
    
    console.log(request.body);
    

    const {nombreUsuario}= request.body;
    const {apellidoUsuario}= request.body;
    const {identificacionUsuario}= request.body;
    const {direccionUsuario}= request.body;
    const {passwordUsuario}= request.body;
    const {emailUsuario}= request.body;
    const {contactoUsuario}= request.body;
    try{
            const registro = await usuarios.create({ 
            nombre:  nombreUsuario,
            apellido: apellidoUsuario,
            identificacion: identificacionUsuario,
            direccion: direccionUsuario,
            contraseña: passwordUsuario,
            email: emailUsuario,
            telefono: contactoUsuario
            });
            const confirmarUrl =`http://${request.headers.host}/confirmar/${emailUsuario}`;
            const usuario = await usuarios.findOne({where:{email:emailUsuario}});
            await enviarEmail.enviar({
                usuario,
                subject: 'Confirma tu Cuenta de Proyectos',
                confirmarUrl,
                archivo: 'confirmar-cuenta'
            });
            request.flash('correcto','enviamos un correo confirma tu cuenta');
            response.redirect('/Login');
        }catch(error){
            request.flash('error', error.errors.map(error => error.message));
            response.render('UsuariosNuevos',{
                nombrePagina:'Usuarios Nuevos',
                mensajes: request.flash(),
                nombreUsuario,
                apellidoUsuario,
                identificacionUsuario,
                direccionUsuario,
                passwordUsuario,
                emailUsuario,
                contactoUsuario
            })
            //console.log(error);
        }
};





exports.Cuenta = async (request, response) =>{

    const usuariosConsulta = await usuarios.findAll();
    response.render('mostrarDatos', {
        nombrePagina: 'Mostrar Datos',
        usuariosConsulta

    });
};

exports.MiCuenta = async (request, response)=> {
    const url = response.locals.user.url

    const clientesPromise = usuarios.findAll();

    const clientePromise = usuarios.findOne(
       {
           where:{
               url:url
           }
       }
   );

   const[clientes, cliente] = await Promise.all([clientesPromise,clientePromise]);

  
   //console.log(hola);

  // console.log('Listo');

   //response.send(proyecto);
    
    response.render('perfil', {
        nombrePagina: 'Mi perfil',
        cliente,
        clientes
       
    })
}

exports.datosPerfil = async (request, response) => {
    const url = response.locals.user.url

    const clientesPromise = usuarios.findAll();

    const clientePromise = usuarios.findOne(
       {
           where:{
               url:url
           }
       }
   );

   const[clientes, cliente] = await Promise.all([clientesPromise,clientePromise]);
   response.render('perfilUsuario', {
       nombrePagina: 'Listado de los clientes',
       cliente,
       clientes
   })
}

exports.DatosPersonales = async (request, response) => {
    const  usuarioInicio = await usuarios.findAll();
    response.render('perfil',{
        nombrePagina:'Perfil',
        usuarioInicio
    });
}


exports.clienteporUrl= async (request, response, next)=>{
    const clientesPromise = usuarios.findAll();

   const clientePromise = usuarios.findOne(
       {
           where:{
               url:request.params.url
           }
       }
   );

   const[clientes, cliente] = await Promise.all([clientesPromise,clientePromise]);

   

  // console.log('Listo');

   //response.send(proyecto);

   response.render('perfilUsuario', {
       nombrePagina: 'Listado de los clientes',
       cliente, //findOne -url
       clientes
        // findAll
   })

}
exports.listadoClientes = async (request, response) => {
    const  ListaCliente = await usuarios.findAll(
    );
    response.render('ListaClientes',{
        nombrePagina:'Lista Clientes',
        ListaCliente
    });
}
exports.clienteEditar = async(request,response)=>{
    
    const cliente = usuarios.findAll();
   

   const { nombreUsuario } = request.body;
   const { apellidoUsuario } = request.body;
   const { identificacionUsuario } = request.body;
   const { direccionUsuario } = request.body;
   const { emailUsuario } = request.body;
   const { contactoUsuario } = request.body;

    let errores = [];

    if(!nombreUsuario){
        errores.push({'texto':'Agrega un Nombre'})
    }
    if(!apellidoUsuario){
        errores.push({'texto':'Agrega un apellido'})
    }
    if(!identificacionUsuario){
        errores.push({'texto':'Agrega una cedula'})
    }
    if(!direccionUsuario){
        errores.push({'texto':'Agrega una direccion'})
    }
    if(!emailUsuario){
        errores.push({'texto':'Agrega un e-mail'})
    }
    if(!contactoUsuario){
        errores.push({'texto':'Agrega un Telefono'})
    }

    

    if(errores.length>0){
        response.render('perfilUsuario',{
            nombrePagina:'Perfil Usuario',
            errores,
            
        })
    }else{
        
       //console.log(slug(nombre));
    

       await usuarios.update(
           { 

            nombre: nombreUsuario,
            apellido: apellidoUsuario,
            identificacion: identificacionUsuario,
            direccion: direccionUsuario,
            email: emailUsuario,
            telefono: contactoUsuario
           },
           {
               where:{url:request.params.url}
           });
           
       response.redirect(`/perfilUsuarios/ActualizarUsuario/${request.params.url}`);

       
        
    }

   
}
exports.eliminarCliente = async(request, response, next)=>{
    console.log('HOLIS')
    const {urlCliente} = request.query;

    console.log(urlCliente);
    
    const resultado = await usuarios.destroy({where:{url:urlCliente}});

    if(!resultado){
        return next();
    }

    response.status(200).send('Proyecto Eliminado Correctamente!');

}

exports.formRestablecerPassword=(request,response)=>{
    const { error }= response.locals.mensajes;
    response.render('restablecer',{
        nombrePagina:'recuperar',
        error
    });
}

exports.confirmarCuenta =async (request, response)=>{
    //response.json(request.params.correo);
 
    const usuario = await usuarios.findOne({
       where:{
          email:request.params.correo
       }
    });
    if(!usuario){
       request.flash('error', 'No existe la cuenta');
       response.redirect('/UsuariosNuevos');
    }
 
    usuario.activo =1;
 
    await usuario.save();
 
    request.flash('correcto','Cuenta Activa Correctamente');
    response.redirect('/Login');
}

