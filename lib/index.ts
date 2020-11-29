// import dotenv from 'dotenv';
// import App from './server/app';

// import InfoController from './server/controllers/InfoController';

// dotenv.config();

// const PORT: number = Number(process.env.PORT) || 5000;
// const HOST: string = process.env.HOST || '127.0.0.1';
// const info = new InfoController();
// const controllers = [info];

// const app = new App(controllers, PORT, HOST);
// app.listen();

import CodeContainerFactory from './codeexecution/CodeContainerFactory';
const containerFactory = new CodeContainerFactory();
const code = 'for i in range(100):\n\tprint(i, end=" ")';
const pythonContainer = containerFactory.getCodeContainer('python', code);

async function init() {
  await pythonContainer.initialize();
  console.log(pythonContainer.getOutput().toString());
  console.log(pythonContainer.getStatus());
  console.log(pythonContainer.getUuid());
  console.log(pythonContainer.getContainerId());
}

init();
