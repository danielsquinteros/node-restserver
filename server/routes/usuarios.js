const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role  } = require('../middlewares/autenticacion')
const app = express();

app.get('/usuario', verificaToken , (req, res)  => {
/*
    return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
    })
*/

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec( (err, usuarios) => {
                if( err ){
                    return res.status(400).json({
                        ok: false,
                        err: err
                    });
                } else {
                    Usuario.countDocuments({ estado: true }, (err, conteo) => {

                        res.json({
                            ok: true,
                            usuarios: usuarios,
                            cuantos: conteo
                        });

                    })
                }
            });
  });
  
app.post('/usuario', [verificaToken,verificaAdmin_Role] , function (req, res) {
    
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save( (err) =>{
        if( err ){
            return res.status(400).json({
                ok: false,
                err: err
            })
        } else {

           // usuario.password = null;

            res.json({
                ok: true,
                usuario
            })
        }
    });

})

app.put('/usuario/:id', [ verificaToken , verificaAdmin_Role ], function (req, res) {
    
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','img','role','estado']);



    Usuario.findByIdAndUpdate( id, body, { new: true , useFindAndModify:false, runValidators:true, context:'query' } , (err, usuario) => {

            if( err ){
                return res.status(400).json({
                    ok: false,
                    err: err
                })
            } else {

            res.json({
                ok: true,
                usuario: usuario
            });
        } 
    })
})

app.delete('/usuario/:id', [ verificaToken , verificaAdmin_Role ] ,  function (req, res) {
    
    let id = req.params.id;

   // Usuario.findByIdAndRemove(id, { useFindAndModify: false} , (err, usuarioBorrado) => {
    
    let cambioEstado = {
        estado: false
    }
    Usuario.findOneAndUpdate(id, cambioEstado, { new: true } , (err, usuarioBorrado) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                err: err
            })
        }  

        if ( !usuarioBorrado ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                } 
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    
    })
})

module.exports = app;