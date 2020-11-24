import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import IController from './interfaces/IController';

export default class App {
  private app: express.Application;
  private port: number;
  private host: string;

  constructor(controllers: IController[], port: number, host: string) {
    this.app = express();
    this.port = port;
    this.host = host;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  public listen(): void {
    this.app.listen(this.port, this.host);
    console.log(`Listening on ${this.host}:${this.port}`);
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: IController[]): void {
    controllers.forEach((controller: IController): void => {
      this.app.use('/', controller.router);
    });
  }
}
