import express from "express";
import mongoose from "mongoose";
import usuarios from "./routes/usuarios.js";
import cursos from "./routes/cursos.js";
import auth from './auth/auth.js';
import config from 'config';

// ---------- DB Connection ----------
async function conectarDB() {
    try {
        mongoose.set('strictQuery', false); // O true, según prefieras
        await mongoose.connect(config.get("configDB.HOST"));
        console.log("Conectado a MongoDB");
    } catch (err) {
        console.error("Error al conectar con MongoDB:", err);
        process.exit(1);
    }
}
conectarDB();

// ---------- API Expose ----------
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/usuarios', usuarios);
app.use('/api/cursos', cursos);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("API RESFULL OK y ejecutandose...");
});
