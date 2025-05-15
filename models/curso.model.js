import mongoose from "mongoose";

const cursoSchema = new mongoose.Schema({
    titulo: {
        type:String,
        required: true
    },
    descripcion: {
        type:String,
        required:false
    },    
    estado: {
        type: Boolean,
        default: true
    },
    imagen: {
        type: String,
        required: false        
    },
    alumnos: {
        type: Number,
        default: 0
    },
    califica: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('Curso', cursoSchema);