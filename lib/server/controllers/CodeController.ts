import express from 'express';

import CodeContainerFactory from '../../codeexecution/CodeContainerFactory';
import { IController } from '../../ts/types';

export default class CodeController implements IController {
  public path = '/code';
  public router = express.Router();

  constructor() {
    this.initalizeRoutes();
  }

  public initalizeRoutes(): void {
    this.router.post(this.path, this.runCode);
  }

  private async runCode(request: express.Request, response: express.Response): Promise<void> {
    try {
      const language = request.query.lang;
      const code = request.body.code;
      const codeContainer = CodeContainerFactory.getCodeContainer(language.toString(), code);

      await codeContainer.initialize();
      const output = codeContainer.getOutput();
      response.json({output});
    } catch (error) {
      response.sendStatus(500);
      throw error;
    }
  }
}
