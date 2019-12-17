const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//
//Mostrar todas las categorias
//

app.get('/categoria', verificaToken ,(req, res) =>{

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) =>{
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            } else {
                res.json({
                    ok: true,
                    categorias: categorias
                })
            }
        })
});


//
//Mostar una categoria por ID
//
app.get('/categoria/:id', (req, res) =>{
    //.findByID
    let id = req.params.id;

    Categoria.findById(id, (err,categoriaDB)=>{
        if( err ){
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if( !categoriaDB ){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }
        res.json({
            ok:true,
            categoria: categoriaDB
        })
    })
});


//
//Crear una nueva categoria
//

app.post('/categoria', verificaToken, (req, res) => {
    // regresa una nueva categoria
    // req.usuario._id la persona que esta creando la categoria
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });
});

//
//Actualizar descripcion categoria 
//

app.put('/categoria/:id', verificaToken, (req,res)=>{

    let id = req.params.id;
    let body = req.body;

    let desCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, desCategoria, { new: true , useFindAndModify:false, runValidators:true }, (err, categoriaDB) =>{
        
        if( err ){
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });
});


//
// Borrar descripcion categoria 
//

app.delete('/categoria/:id', [ verificaToken, verificaAdmin_Role ], (req,res)=>{
// Solo una admnistrador puede borrar categroia
// ID administrador
// categoria.findbyIdAndRemove

    let id = req.params.id;

    Categoria.findOneAndRemove( id, (err, categoriaDB) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })
    })
});


module.exports= app;