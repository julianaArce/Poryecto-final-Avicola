const { request, response } = require("express")
const usuarios = require('../models/usuarios');
const pedidos = require('../models/misPedidos');

exports.Pedidos = async (request, response) => {
    
    const clientesPromise = usuarios.findAll();

   const clientePromise = usuarios.findOne(
       {
           where:{
               url:request.params.url
           }
       }
   );

   const[clientes, cliente] = await Promise.all([clientesPromise,clientePromise]);
    

    response.render('Registrarpedido',{
        nombrePagina:'Registro de Pedidos',
        clientes,
        cliente
    });

}

exports.RegistrarPedidos = async (request, response) =>{

    const clientePedido =await usuarios.findOne(
        {
            where:{
                url:request.params.url
            }
        }
    );
    
    const {cantidad} = request.body;
    const {descripcion} = request.body;
    const {Fecha} = request.body;

    

    const usuarioid = clientePedido.id;
    

    let errores = [];
    if(!cantidad){
        errores.push({'texto':'Agrega una cantidad'})
    }
    if(!descripcion){
        errores.push({'texto':'Agrega una Descripción'})
    }
    if(!Fecha){
        errores.push({'texto':'Agrega una Fecha'})
    }

    if(errores.length>0){
        response.render('Registrarpedido',{
            nombrePagina:'Registro de Pedidos',
        
        });
    }else{

        //console.log(slug(nombreUsuario));

        const resultadoPedido = await pedidos.create({ 
            cantidad: cantidad,
            Descripcion: descripcion,
            Fecha: Fecha,
            Estado: 0,
            usuarioId:usuarioid

        }).catch(e => { console.error(e)});
            response.redirect(`/PerfilUsuarios/ActualizarUsuario/${request.params.url}`);
    }
};
exports.ListarPedidos = async (request, response) => {
    
    const clientesPromise = usuarios.findAll();

   const clientePromise = usuarios.findOne(
       {
           where:{
               url:request.params.url
           }
       }
   );

   const[clientes, cliente] = await Promise.all([clientesPromise,clientePromise]);
    
   const MiPedido = await pedidos.findAll({

        where:{
            usuarioId:cliente.id
        }
   });

    response.render('ListaPedidos',{
        nombrePagina:'Lista de Pedidos',
        clientes,
        cliente,
        MiPedido
    });

}

exports.cambiarEstadoPedido = async (request, response)=>{
    //Viene del click frontend
    
    const { id }=request.params;
    //viene de la base de datos
    const pedido = await pedidos.findOne({where:{id}});

    let estado = 0;

    if(pedido.Estado === estado){
        estado =1;
    }
    pedido.Estado = estado;

    const resultado = await pedido.save();

    if(!resultado) return next();

    response.status(200).send('Actualizado..');
}
exports.eliminarPedido = async(request, response)=>{
    const { id }= request.params;
    //Eliminar
    const resultado = await pedidos.destroy({where:{id}});

    if(!resultado) return next();

    response.status(200).send("Tarea Eliminada Correctamente");

    
}