import fs from "fs";
import fsPromises = require("fs/promises")

function readFile<T>(fileName:string):Promise<T> {
    return new Promise<T>((resolve, reject) => {
        fs.readFile(`./data/${fileName}.json`, function (err, data) {
            if (err) {
                console.log("File read failed:", err);
                reject(err);
            }
            else {
                console.log(`reading ${fileName}`)
                resolve(JSON.parse(data.toString()));
            }
        });
    });
};

async function writeFile<T>(fileName:string,json:T): Promise<void> {
    // check if the folders exist and if not create them
    let dir = "./data/" + fileName.substring(0,fileName.lastIndexOf('/'))
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    
    let data = JSON.stringify(json);
                console.log(`writing ${fileName}`)
                await fsPromises.writeFile(`./data/${fileName}.json`, data);
};

function removeFile(filePath:string) {
    console.log(`removing ${filePath}`)
    fs.unlink(`./data/${filePath}.json`, () => {})
}

export {readFile , writeFile,removeFile}
