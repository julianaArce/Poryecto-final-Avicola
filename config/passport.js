const passport = require('passport');
const LocalStrategy = require('passport-local');

const Usuarios = require('../models/usuarios');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'emailUsuario',
            passwordField: 'passwordUsuario'
        },

        async(email, contraseña, done)=>{

            try {
                const usuario = await Usuarios.findOne(
                    {
                        where:{email:email,
                            activo:1
                        }
                    }
                );
                if(!usuario.verificarPassword(contraseña)){
                    return done(null, false,{
                        message: 'Password Incorrecto!'
                    });
                }
               return done(null, usuario); 
            } catch (error) {
                console.log(error);
                return done(null, false,{
                    message: 'cuenta no existe!'
                })
            }

        }
    )
)

passport.serializeUser((usuario, callback) =>{
    callback(null, usuario);
});

passport.deserializeUser((usuario, callback) =>{
    callback(null, usuario);
});

module.exports= passport;