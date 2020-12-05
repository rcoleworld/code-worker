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
const code = 'package main\n\nimport "fmt"\nfunc main() {\n\tfmt.Println("Hello")\n}';
const goContainer = containerFactory.getCodeContainer('golang', code);

async function init() {
  await goContainer.initialize();
  console.log(goContainer.getOutput());
}

init();
