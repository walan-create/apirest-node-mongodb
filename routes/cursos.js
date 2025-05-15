// ---------------------- Imports ----------------------
import express from "express";
import Curso from "../models/curso.model.js";

// ---------------------- Router -----------------------
const ruta = express.Router();

// -----------------------------------------------------
// ------------------- Rutas Controller ----------------
// -----------------------------------------------------

// GET ALL 
ruta.get('/', (req, res) => {
    let resultado = listarCursosActivos();
    resultado
        .then(cursos => {
            res.json(cursos);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

// POST
ruta.post('/', (req, res) => {
    let resultado = crearCurso(req.body);
    resultado
        .then(curso => {
            res.json({ curso });
        })
        .catch(err => {
            res.status(400).json({ err });
        });
});

// PUT
ruta.put('/:id', (req, res) => {
    let resultado = actualizarCurso(req.params.id, req.body);
    resultado
        .then(curso => {
            res.json(curso);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

/**
 * DELETE /:id
 * Desactiva un curso por su ID (estado = false)
 */
ruta.delete('/:id', (req, res) => {
    let resultado = desactivarCurso(req.params.id);
    resultado
        .then(curso => {
            res.json(curso);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

// -----------------------------------------------------
// ----------------- Métodos Service -------------------
// -----------------------------------------------------

/**
 * Lista todos los cursos activos (estado: true)
 */
async function listarCursosActivos() {
    let cursos = await Curso.find({ "estado": true });
    return cursos;
}

/**
 * Crea un curso en la base de datos
 * @param {Object} body - Datos del curso
 */
async function crearCurso(body) {
    let curso = new Curso({
        titulo: body.titulo,
        descripcion: body.desc
    });
    return await curso.save();
}

/**
 * Actualiza un curso por ID
 * @param {string} id - ID del curso a actualizar
 * @param {Object} body - Nuevos datos del curso
 */
async function actualizarCurso(id, body) {
    let curso = await Curso.findByIdAndUpdate(
        id,
        {
            $set: {
                titulo: body.titulo,
                descripcion: body.desc
            }
        },
        { new: true }
    );
    return curso;
}

/**
 * Desactiva un curso por ID (estado: false)
 * @param {string} id - ID del curso a desactivar
 */
async function desactivarCurso(id) {
    let curso = await Curso.findByIdAndUpdate(
        id,
        { $set: { estado: false } },
        { new: true }
    );
    return curso;
}

// ---------------------- Export -----------------------
export default ruta;