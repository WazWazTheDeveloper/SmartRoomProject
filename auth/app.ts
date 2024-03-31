import express = require('express');
import https from "https";
const cookieParser = require('cookie-parser')
import bodyParser = require('body-parser');
import { routerv1 } from './src/routes/v1/router';
import { connectToDatabase } from './src/services/mongoDBService';
import fs from 'fs';
import { httpRequestLogger } from './src/middleware/requestLogger';
import { addRequestID } from './src/middleware/addRequestID';

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


async function startServer(): Promise<void> {
    await connectToDatabase()
    startListeningToReqests()
}

function startListeningToReqests(): void {
    let server = https.createServer(options, app);
    server.listen(process.env.SERVER_PORT, () => {
        // TODO: log this:
        console.log(`listening on port ${process.env.SERVER_PORT}`)
    })

}

startServer();