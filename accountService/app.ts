import express = require('express');
const cookieParser = require('cookie-parser')
import bodyParser = require('body-parser');
import { loggerDB } from './src/services/loggerService';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

async function startServer(): Promise<void> {
    startListeningToReqests()
}

function startListeningToReqests(): void {
    let server = app.listen(process.env.SERVER_PORT, () => {
        // TODO: log this:
        console.log(`listening on port ${process.env.SERVER_PORT}`)
    })

    loggerDB.log({
        level: "info",
        message: "test2s"
    })

    
    loggerDB.log({
        level: "info",
        message: "test2s"
    })
}

startServer();