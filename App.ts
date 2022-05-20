import express, { Express, Request, Response } from 'express';
import cors from 'cors';
const app: Express = express();
app.use(cors())

//config Env
import dotenv from 'dotenv';
dotenv.config();

//Importing Routes File Here
import auth from './routes/auth';
import user from './routes/user';

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Hellow there from express</h1><br/><a href="http://localhost:4000/v1/auth/authTest">http://localhost:4000/v1/auth/authTest</a>');
});

//Routes Defined Here
app.use('/v1/auth', auth)
app.use('/v1/user', user)


//Handling 404 Page Not Found
app.use((req, res, next) => {
    res.status(404).send(
        "<h1>Page not found on the server</h1>")
})
 
app.listen(4000);