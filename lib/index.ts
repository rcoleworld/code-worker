import dotenv from 'dotenv';
import App from './server/app';

import CodeController from './server/controllers/CodeController';

dotenv.config();

const PORT: number = Number(process.env.PORT) || 5000;
const HOST: string = process.env.HOST || '127.0.0.1';

const code = new CodeController();

const controllers = [code];

const app = new App(controllers, PORT, HOST);
app.listen();
