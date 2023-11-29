import express, { Request, Response, Application, NextFunction } from 'express';
import cors from 'cors';
import { validateUser } from './database.js';

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


//https.createServer(options, app).listen(8443);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
