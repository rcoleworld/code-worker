import http from 'http';
import { v4 as uuidv4 } from 'uuid';

import { generateBuildDirectory, generateSrcFile, removeBuildDirectory } from '../tools/buildUtils';
import { ContainerStatusCode } from '../ts/types';

export default abstract class CodeContainer {
  public code: string;
  public codeType: string;

  protected image: string;
  protected uuid: string;
  protected containerId: string; // Container retrived from dockerd.

  private status: ContainerStatusCode;
  private output: Buffer;

  constructor(code: string) {
    this.uuid = uuidv4(); // Generates a uuid4 for the container to be reference in file system.
    this.status = ContainerStatusCode.Pending;
    this.code = code;
  }

  public abstract async initialize(): Promise<void>;

  public getUuid(): string {
    return this.uuid;
  }

  public getStatus(): ContainerStatusCode {
    return this.status;
  }

  public getOutput(): string {
    return this.output.toString();
  }

  public getContainerId(): string {
    return this.containerId;
  }

  protected abstract async createContainer(): Promise<void>;

  protected async startContainer(): Promise<void> {
    await this.createContainer();

    let requestOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      path: `/v1.40/containers/${this.containerId}/start`,
      socketPath: '/var/run/docker.sock',
    };
    console.log('Starting Container...');

    this.status = ContainerStatusCode.Running;

    await this.dockerEngineRequest(requestOptions);

    requestOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      path: `/v1.40/containers/${this.containerId}/wait`,
      socketPath: '/var/run/docker.sock',
    };
    console.log('Waiting on Container...');

    this.status = ContainerStatusCode.Stopped;

    await this.dockerEngineRequest(requestOptions);
  }

  protected async retrieveOutputFromContainer(): Promise<Buffer> {
    await this.startContainer();

    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
      path: `/v1.40/containers/${this.containerId}/logs?stdout=1?stderr=1`,
      socketPath: '/var/run/docker.sock',
    };
    console.log('Retrieving Output...');
    const response = await this.dockerEngineRequest(requestOptions);
    this.output = response;

    await this.destroyContainer();
    return response;
  }

  protected async destroyContainer(): Promise<void> {
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      path: `/v1.40/containers/${this.containerId}?v=1`,
      socketPath: '/var/run/docker.sock',
    };
    console.log('Destroying Container...');

    await this.dockerEngineRequest(requestOptions);
    this.status = ContainerStatusCode.Destroyed;
  }

  // Sends a request to the docker engine api.
  protected async dockerEngineRequest(options: object, postData?: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        const chunks = []; // Chunks to store response data.

        res.setEncoding('utf-8');
        res.on('data', (chunk) => {
          console.log(chunk);
          chunks.push(Buffer.from(chunk, 'utf-8'));
        });

        res.on('end', () => {
          try {
            const responseBody = Buffer.concat(chunks);
            resolve(responseBody);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (postData) {
        req.write(postData);
      }
      req.end();
    });
  }

  protected async pullImage(): Promise<void> {
    this.status = ContainerStatusCode.Pending;
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      path: `/v1.40/images/create?fromImage=${this.image}`,
      socketPath: '/var/run/docker.sock',
    };

    console.log('Pulling image...');
    await this.dockerEngineRequest(requestOptions);
  }

  // Creates environment on file system for container to be run off of.
  protected createEnvironment(): void {
    generateBuildDirectory(this.uuid, this.codeType);
    generateSrcFile(this.uuid, this.codeType, this.code);
  }

  protected cleanEnvironment(): void {
    removeBuildDirectory(this.uuid, this.codeType);
  }
}
