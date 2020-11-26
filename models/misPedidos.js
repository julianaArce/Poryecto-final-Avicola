const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid');
const usuarios = require('../models/usuarios');

const Pedidos = db.define('Pedidos',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    cantidad:{
        type:Sequelize.INTEGER(40),
        allowNull:false

    },
    Descripcion:{
        type:Sequelize.STRING(20),
        allowNull:false
    },
    Fecha:{
        type:Sequelize.STRING(25),
        allowNull:false
    },
    Estado:{
        type:Sequelize.INTEGER(1),
        allowNull:false
    }
    
    
},{
    
}
);
Pedidos.belongsTo(usuarios);
module.exports = Pedidos;