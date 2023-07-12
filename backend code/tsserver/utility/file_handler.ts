import fs from "fs";

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

function writeFile<T>(fileName:string,json:T) {
    let data = JSON.stringify(json);
    fs.writeFileSync(`./data/${fileName}.json`, data);
};

export {readFile , writeFile}
