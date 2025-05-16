// ---------------------- Imports ----------------------
import express from "express";
import Usuario from "../models/usuario.model.js";
import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from 'config';


// ---------------------- Router -----------------------
const ruta = express.Router();

ruta.post("/", (req, res) => {
    Usuario.findOne({ email: req.body.email })
        .then((datos) => {
            if (datos) {
                const passwordValido = bcrypt.compareSync(
                    req.body.password,
                    datos.password
                ); //Si la contraseña es correcta devuelve true
                if (!passwordValido)
                    return res.status(400).json({
                        err: "Ok",
                        msg: "Contraseña incorrecta",
                    });
                const token = jwt.sign(
                    {
                        _id: datos._id,
                        nombre: datos.nombre,
                        email: datos.email,
                    },
                    config.get('configToken.SEED'),
                    { expiresIn: config.get('configToken.expiresIn') },
                );
                res.json({
                    usuario : {
                        _id: datos._id,
                        nombre: datos.nombre,
                        email: datos.email,
                    },
                    token: token
                }); // Si la contra es valida returnamos datos en un token
            } else {
                res.status(400).json({
                    error: "Ok",
                    msj: "usuario o contraseña incorrecta.",
                });
            }
        })
        .catch((err) => {
            res.status(400).json({
                error: "Ok",
                msj: "Error en el servidor" + err,
            });
        });
});

export default ruta;
