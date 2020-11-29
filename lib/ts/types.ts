import express from 'express';

export interface IController {
  router: express.Router;
  path: string;
  initalizeRoutes(): void;
}

export enum ContainerStatusCode {
  Pending = 0, // Container is being built or image is being pulled.
  Running = 1, // Container is being ran. Container start has been run.
  Stopped = 2, // Container is finished running.
  Destroyed = 3 // Container is killed.
}
