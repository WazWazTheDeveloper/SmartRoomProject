import express = require('express');
const cookieParser = require('cookie-parser')
import bodyParser = require('body-parser');
import { loggerDB } from './src/services/loggerService';
import { createNewUser } from './src/services/userService';
import { connectToDatabase } from './src/services/mongoDBService';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

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
        createNewUser("admin","admin")
    // },2000)
}

startServer();