import express, { Express, Request, Response } from 'express';
import cors from 'cors';
//config env
import dotenv from 'dotenv';
dotenv.config();
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
import StripeController from './Controllers/StripeController';
import { StripeServices } from './Services/StripeServices';

// Testing route
app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello welcome to arrium api collection :)</h1>');
});

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

// Handling 404 Page Not Found
app.use((req, res, next) => {
  res.status(404).send('<h1>Page not found on the server</h1>');
});

// StripeController.createCustomerStripe('ans4asif2@gmail.com', 'Ans4Asif')
//   .then((res: any) => {
//     console.log({ x: res?.id });
//     //subscription
//     StripeServices.subscribeToPlan(res?.id, '333', true)
//       .then()
//       .catch((err) => console.log({ err }));
//   })
//   .catch((err) => console.log({ err }));

// StripeServices.getSubscription()
//   .then()
//   .catch((err) => console.log({ err }));
app.listen(9000);
