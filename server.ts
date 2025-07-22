import * as dotenv from "dotenv";
dotenv.config();
import express, { Request,Response, NextFunction } from "express";
import helmet from "helmet";
import swaggerUi from 'swagger-ui-express';
import bodyParser from "body-parser";
import { connect } from "./connection/connection";
import routeManager from './routes/router.manager'
import swaggerDocument from './Common/swagger/swagger';
// import logger from "./common/logger/logger";


const app = express();

app.use(helmet());
app.use(bodyParser.json());

const serverPort = process.env.SERVER_PORT || 3000;

connect().then(() => {
  try {
    app.listen(serverPort, () => {
      console.info(`Server is running on serverPort ${serverPort}`);
    });
  } catch (error) {
    console.error('Cannot connect to the app', error);
  }
}).catch(error => console.error("Invalid database connection...!", error));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', routeManager)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.statusCode || 500;

  const message =
    err.message ||
    "There was an error while processing your request, please try again";
  res.status(status).send({ status, message });
});

export default app;
