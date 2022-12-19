import express, { Express, Request, Response } from 'express';
import cors from 'cors';
// socket io
const http = require('http');
const socketio = require('socket.io');
//config env
import dotenv from 'dotenv';
dotenv.config();
require('./Utils/crons');
// initialize app
const app: Express = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//Import Routes File
import signup from './routes/signup';
import signin from './routes/signin';
import forgot from './routes/forgot';
import user from './routes/user';
import block from './routes/block';
import modelVersions from './routes/modelVersions';
import preference from './routes/preference';
import location from './routes/location';
import automationTool from './routes/automationTool';
import stripe from './routes/stripe';
import referral from './routes/referral';
import timezone from './routes/timezone';
import sesTemplates from './routes/sesTemplates';

// Testing route
app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello welcome to arrium api collection :)</h1>');
});
// stripe webhook
app.use(
  '/v1/stripe/webhooks',
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.json());

//Routes Defined Here
app.use('/v1/signin', signin);
app.use('/v1/signup', signup);
app.use('/v1/forgot-password', forgot);
app.use('/v1/user', user);
app.use('/v1/block', block);
app.use('/v1/preference', preference);
app.use('/v1/model-versions', modelVersions);
app.use('/v1/location', location);
app.use('/v1/automation-tool', automationTool);
app.use('/v1/stripe', stripe);
app.use('/v1/referral', referral);
app.use('/v1/timezone', timezone);
app.use('/v1/templates', sesTemplates);

// Handling 404 Page Not Found
app.use((req, res, next) => {
  res.status(404).send('<h1>Page not found on the server</h1>');
});

// Create server
const httpServer = http.createServer(app);
// socket io testing
export const server = new socketio.Server(httpServer, {
  cors: {
    origin: '*',
  },
});
//check client connection
server.on('connection', (socket: any) => {
  //Socket is a Link to the Client
  console.log('New Client is Connected!');
  app.set('socketService', socket);
});

httpServer.listen(9000);
