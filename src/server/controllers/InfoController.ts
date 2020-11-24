import express from 'express';

import IController from '../interfaces/IController';

export default class InfoController implements IController {
  public path = '/';
  public router = express.Router();

  constructor() {
    this.initalizeRoutes();
  }

  public initalizeRoutes(): void {
    this.router.get(this.path, this.sayHello);
  }

  private sayHello(request: express.Request, response: express.Response): void {
    response.send('<h1>Test</h1>');
  }
}
