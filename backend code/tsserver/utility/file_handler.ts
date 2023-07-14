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
                resolve(JSON.parse(data.toString()));
            }
        });
    });
};

async function writeFile<T>(fileName:string,json:T): Promise<void> {
    let data = JSON.stringify(json);
    await fsPromises.writeFile(`./data/${fileName}.json`, data);
};

function removeFile(filePath:string) {
    fs.unlink(`./data/${filePath}.json`, () => {})
}

export {readFile , writeFile,removeFile}
