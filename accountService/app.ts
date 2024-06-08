import express, { Request, Response, NextFunction } from "express"
import cookieParser from 'cookie-parser';
import bodyParser = require('body-parser');
import { createNewUser } from './src/services/userService';
import { connectToDatabase } from './src/services/mongoDBService';
import { addRequestID } from './src/middleware/requestID';
import { httpRequestLogger } from './src/middleware/requestLogger';
import { routerv1 } from './src/routes/v1/router';
import { loggerGeneral } from './src/services/loggerService';
import { response500 } from './src/modules/errors/500';
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(addRequestID)
app.use(httpRequestLogger)

app.use('/api/v1', routerv1);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    response500(req, res);
})
app.use((req: Request, res: Response, next: NextFunction) => {
    response500(req, res);
})

async function startServer(): Promise<void> {
    await connectToDatabase()
    startListeningToReqests()
}

function startListeningToReqests(): void {
    let server = app.listen(process.env.SERVER_PORT, () => {
        loggerGeneral.info(`listening on port ${process.env.SERVER_PORT}`, { uuid: "server-startup" })
    })
    createNewUser("admin", "admin", true);
}

startServer();