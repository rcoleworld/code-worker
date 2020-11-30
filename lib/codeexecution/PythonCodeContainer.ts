import path from 'path';

import CodeContainer from './CodeContainer';

export default class PythonCodeContainer extends CodeContainer {
  public code;

  constructor(code: string) {
    super(code);
    this.image = 'python:3.7';
    this.codeType = 'python';
  }

  // Does container operations.
  public async initialize(): Promise<void> {
    this.createEnvironment();
    await this.retrieveOutputFromContainer();
    this.cleanEnvironment();
  }

  protected async createContainer(): Promise<void> {
    await this.pullImage();

    const directory = path.join(process.cwd(), `./engine/python/${this.uuid}`);
    const containerData = JSON.stringify({
      AttachStdout: true,
      Binds: [`${directory}:/usr/src/app/python/${this.uuid}`],
      Cmd: [`${this.uuid}.py`],
      EntryPoint: ['python3'],
      Image: this.image,
      NetworkDisabled: true,
      WorkingDir: `/usr/src/app/python/${this.uuid}`,
    });

    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      path: `/v1.37/containers/create`,
      socketPath: '/var/run/docker.sock',
    };

    console.log('Creating Container...');

    const containerResponseInfo = JSON.parse(await (await this.dockerEngineRequest(requestOptions, containerData)).toString());

    this.containerId = containerResponseInfo.Id;
  }
}
