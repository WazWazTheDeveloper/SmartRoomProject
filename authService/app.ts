import express, { Request, Response, NextFunction } from "express"
import https from "https";
const cookieParser = require('cookie-parser')
import bodyParser = require('body-parser');
import { routerv1 } from './src/routes/v1/router';
import { connectToDatabase } from './src/services/mongoDBService';
import fs from 'fs';
import { httpRequestLogger } from './src/middleware/requestLogger';
import { addRequestID } from './src/middleware/requestID';
import { loggerGeneral } from './src/services/loggerService';
import { response500 } from "./src/modules/errors/500";
import cors from "cors";

const app = express();
var key = fs.readFileSync('./certs/selfsigned.key');
var cert = fs.readFileSync('./certs/selfsigned.crt');
var options = {
    key: key,
    cert: cert
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(addRequestID)
app.use(httpRequestLogger)

app.use('/api/v1', routerv1);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    response500(req, res);
})
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("yeet")
    response500(req, res);
})
async function startServer(): Promise<void> {
    await connectToDatabase()
    startListeningToReqests()
}

function startListeningToReqests(): void {
    let server = https.createServer(options, app);
    server.listen(process.env.SERVER_PORT, () => {
        loggerGeneral.info(`listening on port ${process.env.SERVER_PORT}`, { uuid: "server-startup" })
    })

}

startServer();