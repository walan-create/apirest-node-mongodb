// ---------------------- Imports ----------------------
import express from "express";
import Usuario from "../models/usuario.model.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from 'config';
import verificarToken from "../middlewares/auth.middleware.js";


// ---------------------- Router -----------------------
const ruta = express.Router();

// ---------------------------------------------------
// ----------- Validación de campos con Joi -----------
// ---------------------------------------------------

// Esquema de validación con Joi para los datos del usuario
const usuarioSchemaJoi = Joi.object({
    email: Joi.string().email().required(),
    nombre: Joi.string().min(3).max(100).required(),
    password: Joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$"))
        .required()
        .messages({
            "string.pattern.base":
                "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.",
        }),
    estado: Joi.boolean(),
    imagen: Joi.string().uri().optional().allow("", null),
});

// ---------------------------------------------------
// ----------------- Rutas Controller ----------------
// ---------------------------------------------------

// GET: Listar todos los usuarios activos
ruta.get("/",verificarToken, (req, res) => {
    let resultado = listarUsuariosActivos();
    resultado
        .then((usuarios) => {
            res.json({
                usuarios: usuarios,
            });
        })
        .catch((err) => {
            res.status(400).json({
                error: err,
            });
        });
});

// POST: Crear un nuevo usuario
ruta.post("/", async (req, res) => {
    let body = req.body;

    // Validar con Joi primero
    const { error } = usuarioSchemaJoi.validate(body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const user = await Usuario.findOne({ email: body.email });
    if (user) {
        return res.status(400).json({ msj: "El usuario ya existe" });
    }

    // Crear usuario si no existe
    try {
        let usuario = await crearUsuario(body);
        res.json({
            Creado: {
                nombre: usuario.nombre,
                email: usuario.email,
            },
        });
    } catch (err) {
        res.status(400).json({ err });
    }
});

// PUT: Actualizar usuario por email
ruta.put("/:email",  verificarToken,(req, res) => {
    const { error } = usuarioSchemaJoi.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    let resultado = actualizarUsuario(req.params.email, req.body);
    resultado
        .then((valor) => {
            res.json({
                valor: valor,
            });
        })
        .catch((err) => {
            res.status(400).json({
                error: err,
            });
        });
});

// DELETE: Eliminar usuario físicamente por ID
ruta.delete("/:id",  verificarToken,(req, res) => {
    let resultado = eliminarUsuario(req.params.id);
    resultado
        .then((usuario) => {
            res.json({
                eliminado: usuario,
            });
        })
        .catch((err) => {
            res.status(400).json({
                error: err,
            });
        });
});

// DELETE: Desactivar usuario (estado=false) por email
ruta.delete("/desactivar/:email",  verificarToken,(req, res) => {
    let resultado = desactivarUsuario(req.params.email);
    resultado
        .then((usuario) => {
            res.json({
                desactivado: {
                    nombre: usuario.nombre,
                    email: usuario.email,
                },
            });
        })
        .catch((err) => {
            res.status(400).json({
                error: err,
            });
        });
});

// ---------------------------------------------------
// ----------------- Métodos Service -----------------
// ---------------------------------------------------

// Servicio para listar usuarios activos
async function listarUsuariosActivos() {
    return await Usuario.find({ estado: true }).select({ nombre: 1, email: 1 });
}

// Servicio para crear un usuario en la base de datos
async function crearUsuario(body) {
    let usuario = new Usuario({
        email: body.email,
        nombre: body.nombre,
        password: bcrypt.hashSync(body.password, 10), // Encriptamos contraseña
    });
    return await usuario.save();
}

// Servicio para actualizar un usuario por email
async function actualizarUsuario(email, body) {
    let usuario = await Usuario.findOneAndUpdate(
        { email: email },
        {
            $set: {
                nombre: body.nombre,
                password: body.password,
            },
        },
        { new: true }
    );
    return usuario;
}

// Servicio para eliminar un usuario físicamente por ID
async function eliminarUsuario(id) {
    return await Usuario.findByIdAndDelete(id);
}

// Servicio para desactivar un usuario por email (estado = false)
async function desactivarUsuario(email) {
    return await Usuario.findOneAndUpdate(
        { email: email },
        { $set: { estado: false } },
        { new: true }
    );
}

export default ruta;
