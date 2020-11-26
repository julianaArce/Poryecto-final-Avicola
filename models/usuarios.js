const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid');
const bcrypt = require('bcrypt-nodejs');


const usuarios = db.define('usuarios',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nombre:{
        type:Sequelize.STRING(60),
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Llene el campo de Nombre'
            }
        }

    },
    apellido:{
        type:Sequelize.STRING(20),
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Llene el campo de apellido'
            }
        }
    },
    identificacion:{
        type:Sequelize.INTEGER,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Llene el campo de cedula'
            }
        }
    },
    direccion:{
        type:Sequelize.STRING(45),
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Llene el campo de dirección'
            }
        }
    },
    contraseña:{
        type:Sequelize.STRING(60),
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Llene el campo de contraseña'
            }
        }
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            isEmail:{
                msg:'Agrega un Email Válido' 
            },
            notEmpty:{
             msg:'El Email no puede ir vacío'
            }
         },
         unique:{
             args: true,
             msg:'Usuario ya Registrado!'
         }
    },
    telefono:{
        type:Sequelize.INTEGER,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Llene el campo de telefono'
            }
        }
    },
    activo:{
        type:Sequelize.INTEGER,
        defaultValue: 0
    },
    url: Sequelize.STRING,
    token:Sequelize.STRING,
    expiracion:Sequelize.DATE
},{
    hooks:{
        beforeCreate(usuarios){
            const url=slug(usuarios.nombre).toLocaleLowerCase();
            usuarios.url= `${url}-${shortid.generate()}`;
            usuarios.contraseña = bcrypt.hashSync(usuarios.contraseña, bcrypt.genSaltSync(10));
            console.log(usuarios);
        }
    }
}
);
usuarios.prototype.verificarPassword = function(contraseña){
    return bcrypt.compareSync(contraseña, this.contraseña);
}


module.exports = usuarios;