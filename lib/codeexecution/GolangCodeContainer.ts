import path from 'path';

import CodeContainer from './CodeContainer';

export default class GolangCodeContainer extends CodeContainer {
  public code: string;

  constructor(code: string) {
    super(code);
    this.image = 'golang:alpine';
    this.codeType = 'golang';
  }

  // Does container operations.
  public async initialize(): Promise<void> {
    this.createEnvironment();
    await this.retrieveOutputFromContainer();
    this.cleanEnvironment();
  }

  protected async createContainer(): Promise<void> {
    await this.pullImage();

    const directory = path.join(process.cwd(), `./engine/golang/${this.uuid}`);
    const containerData = JSON.stringify({
      AttachStdout: true,
      Binds: [`${directory}:/usr/src/app/golang/${this.uuid}`],
      Cmd: [`go`, `run`, `${this.uuid}.go`],
      // EntryPoint: [`./${this.uuid}`], // Maybe use later if faster
      Image: this.image,
      NetworkDisabled: true,
      WorkingDir: `/usr/src/app/golang/${this.uuid}`,
    });

    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      path: `/v1.37/containers/create`,
      socketPath: '/var/run/docker.sock',
    };

    console.log(`Creating Container... ID: ${this.uuid}`);

    const containerResponseInfo = JSON.parse(await (await this.dockerEngineRequest(requestOptions, containerData)).toString());

    this.containerId = containerResponseInfo.Id;
  }
}
