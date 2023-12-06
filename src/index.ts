import express, { Request, Response, Application, NextFunction } from 'express';
import cors from 'cors';
import { validateUser, validateUserWithToken } from './database.js';
import 'dotenv/config'
import jwt, { JwtPayload } from 'jsonwebtoken';


const app: Application = express();
const port = process.env["PORT"] || 3001;
const authToken = 'miTokenSecreto';

app.use(cors());
app.use(express.json());

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token || token !== `Bearer ${authToken}`) {
        return res.status(401).json({ message: 'Acceso no autorizado' });
    }
    next();
    return;
};

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Bienvenido a express' });
    console.log(req.headers);
});

// Endpoint GET
app.get('/api/get_endpoint', authenticate, (req: Request, res: Response) => {
    res.json({ message: 'Este es un endpoint GET protegido.' });
    console.log(req.headers);
});

// Endpoint POST
app.post('/api/post_endpoint', authenticate, (req: Request, res: Response) => {
    const data = req.body;
    res.json({ message: 'Este es un endpoint POST protegido.', receivedData: data });
});

// Endpoint PUT
app.put('/api/put_endpoint', authenticate, (req: Request, res: Response) => {
    const data = req.body;
    res.json({ message: 'Este es un endpoint PUT protegido.', receivedData: data });
});

// Endpoint DELETE
app.delete('/api/delete_endpoint', authenticate, (_req: Request, res: Response) => {
    res.json({ message: 'Este es un endpoint DELETE protegido.' });
});

// Endpoint POST
app.post('/login', (req: Request, res: Response) => {
    const json = req.body;
    console.log(json);
    let validation = validateUser(json.username, json.password);

    if (validation.isAuthenticated) {
        return res.json({ message: 'Usuario autenticado con exito', metadata: validation });
    } else {
        return res.status(401).json({ message: 'Acceso no autorizado' });
    }
});

/* Endpoints utilizando jwt */

export interface JwtRequest extends Request {
    token: string | JwtPayload;
}

const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '')

    // token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBzeXN0ZW0uY29tIiwicm9sZSI6WyJhZG1pbiIsInVzZXIiXSwiaWF0IjoxNzAxODE2MjQ1LCJleHAiOjE3MDE5MDI2NDV9.6pMtxYlvMGh-bBXjuIB8QT9ts6mmI4ZEyhIRbePkqh4

    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY ?? '');
        (req as JwtRequest).token = decoded;
        next();
        return;
    } catch (err) {
        res.status(401).send({ status: 401, success: false, message: 'Por favor autenticate' })
    }
};

app.get('/secure/hello', authenticateJwt, (_req: Request, res: Response) => {
    res.json({ message: 'Bienvenido a express' });
});

app.post('/auth/login', (req: Request, res: Response) => {

    const json = req.body;
    /*
    {
        username: "admin",
        password: "admin123"
    }
    
    */
    let validation = validateUserWithToken(json.username, json.password);

    if (validation.isAuthenticated) {
        return res.json({
            status: 200,
            success: true,
            message: "Autenticacion correcta",
            token: validation.token,
        });
    } else {
        return res.status(401).json({
            status: 401,
            success: false,
            message: "Usuario no encontrado o contraseña incorrecta",
        });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
