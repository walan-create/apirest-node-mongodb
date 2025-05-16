import jwt from 'jsonwebtoken';
import config from 'config';

// Middleware para verificar el token JWT desde el header Authorization
function verificarToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, config.get('configToken.SEED'), (err, decoded) => {
            if (err) return res.status(401).json({ err });
            req.usuario = decoded;
            next();
        });
    } else {
        res.status(403).json({ error: "Token no proporcionado" });
    }
}

export default verificarToken;