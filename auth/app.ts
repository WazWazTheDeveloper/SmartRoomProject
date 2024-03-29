import express = require('express');
const cookieParser = require('cookie-parser')
import bodyParser = require('body-parser');
import { routerv1 } from './src/routes/v1/router';
import { connectToDatabase } from './src/services/mongoDBService';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use('/api/v1', routerv1);

async function startServer(): Promise<void> {
    await connectToDatabase()
    startListeningToReqests()
}

function startListeningToReqests(): void {
    let server = app.listen(process.env.SERVER_PORT, () => {
        // TODO: log this:
        console.log(`listening on port ${process.env.SERVER_PORT}`)
    })

}

startServer();