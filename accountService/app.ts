import express = require('express');
const cookieParser = require('cookie-parser')
import bodyParser = require('body-parser');
import { createNewUser } from './src/services/userService';
import { connectToDatabase } from './src/services/mongoDBService';
import { addRequestID } from './src/middleware/requestID';
import { httpRequestLogger } from './src/middleware/requestLogger';
import { routerv1 } from './src/routes/v1/router';
const app = express();

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
    let server = app.listen(process.env.SERVER_PORT, () => {
        // TODO: log this:
        console.log(`listening on port ${process.env.SERVER_PORT}`)
    })
    // setInterval(()=>{
    // console.log('test')
    createNewUser("admin","admin");
    // },2000)
}

startServer();