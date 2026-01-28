import App from './app';

const app = new App(process.env.PORT ? parseInt(process.env.PORT) : 4001);

app.listen();