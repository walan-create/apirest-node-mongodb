import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    imagen: {
        type: String,
        required: false,
    },
});

// Exportar el modelo usando ES Modules
export default mongoose.model('Usuario', usuarioSchema);