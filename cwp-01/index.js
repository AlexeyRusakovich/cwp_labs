const directoryName = process.argv[2];
let fs = require('fs');
let path_ = require('path');
let copyrightLine = '(c) Alexey Rusakovich. 2017. Microsoft.';


getAllFiles(directoryName);
createJsonFile(directoryName);
createNewDir(directoryName);
getAllTxtFiles(directoryName);
watchAllFiles(directoryName);


function getAllFiles(path, files) {
        files = files || [];

    fs.writeFile("summary.js", "", () => {});

    try {

        fs.readdir(path, (err, files_) =>{

            if(err)
                throw err;

            if(files_.length !== 0)

                files_.forEach(function (file) {

                    fs.stat(path + '/' + file, (err,stats) =>{

                        if(err)
                            throw err;

                        if(stats.isDirectory())
                            getAllFiles(path + '/' + file, files);
                        else {
                            path = path.replace("\\", "/");
                            fs.appendFile("summary.js", "console.log(" +  "\"" + path + '/' + file + "\"" + ");" + "\n", () => {} );
                        }
                    })
                });
        });

    } catch(ex) {
        console.log(ex.message);
    }
}
function createJsonFile(path) {
    fs.writeFile(path + "/config.json", "", () => {})
    fs.appendFile(path + "/config.json", `{"copyright":\"${copyrightLine}"}`);
}
function createNewDir(path){
    try {

        fs.exists(path + '/newDirectory', (isExist) => {
            console.log(isExist);
            if(!isExist)
                fs.mkdir(path + "/newDirectory", function (err) {
                    if(err)
                        throw err;
                })
        })

    } catch(ex) {
        console.log(ex.message);
    }
}
function getAllTxtFiles(path) {

    try {

        fs.readdir(path, (err, files_) =>{

            if(err)
                throw err;

            if(files_.length !== 0)

                files_.forEach(function (file) {

                    if(file !== 'newDirectory')
                    {
                        fs.stat(path + '/' + file, (err, stats) =>{

                            if(err)
                                throw err;

                            if(stats.isDirectory())
                                getAllTxtFiles(path + '/' + file);

                            if(path_.extname(path + '/' + file) === '.txt')

                                fs.readFile(path + '/' + file,  (err, data) => {
                                    if (err)
                                        throw err;

                                    let copyrightLine_;

                                    fs.readFile(directoryName + '/config.json', (err, data_) => {
                                        if(err)
                                            throw err;

                                        copyrightLine_ = JSON.parse(data_).copyright;

                                        fs.writeFile (directoryName + '/newDirectory/' + file, copyrightLine_, () => {});
                                        fs.appendFile(directoryName + '/newDirectory/' + file, data ,() => {});
                                        fs.appendFile(directoryName + '/newDirectory/' + file, copyrightLine_, () => {});
                                    })
                                })
                        })
                    }
                });
        });

    } catch(ex) {
        console.log(ex.message);
    }
}
function watchAllFiles(path){
    fs.watch(path, (eventType, filename) => {
        console.log(`${eventType} - ${filename}`);
    })
}
