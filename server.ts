import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import bodyParser from "body-parser";
import { connect } from "./connection/connection";
import routeManager from './routes/router.manager'
import swaggerDocument from './common/swagger/swagger';


const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.json());

const serverPort = process.env.PORT || 5000;

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
