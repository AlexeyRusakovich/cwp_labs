const net = require('net');
const fs = require("fs");

const mix = require('./mixArray');
const qa = require("./qa");
const port = 10124;

let sockets = [];

if (!fs.existsSync("./qa.json")) {
	console.log("no json");
	return;
}

const server = net.createServer(client => {
    let questions = mix.mixArray(qa.questions);
    client.id = Date.now();

    console.log(`Client id = ${client.id} connected`);

    sockets.push(client);
    client.setEncoding('utf8');

    client.once("data", data => {
      if(data === qa.qa){
        writeToConsoleAndLog(
          client.id,
          `Client with id = ${client.id} gave right greeting!`
        );
        client.write(qa.ask, "UTF-8", () => answerOnInterview(client, questions));
      }
      else{
        writeToConsoleAndLog(
          client.id,
          `Client with id = ${client.id} gave wrong greeting!`
        );
        client.write(qa.dec);
        client.destroy();
      }
      });
      
      client.on("end", () => {
        sockets = sockets.filter(socket => socket.id !== client.id);
        writeToConsoleAndLog(client.id, `Client with id = ${client.id} disconnected`);
      });
    });
    
    const answerOnInterview = (client, questions) => {
      client.on("data", question => {
        let currentAnswer = questions.pop();
        writeToConsoleAndLog(client.id, `Client question: ${question}`);
        writeToConsoleAndLog(client.id, `Server answer: ${currentAnswer.answer}`);
        client.write(currentAnswer.answer);
      });
    };

    const writeToConsoleAndLog = (clientId, msg) => {
      msg = msg + "\n";
      if (!fs.existsSync("./Logs")) fs.mkdirSync("./Logs");
      let filePath = `./Logs/${clientId}.log`;
      console.log(msg);
      fs.existsSync(filePath)
        ? fs.appendFileSync(filePath, msg)
        : fs.writeFileSync(filePath, msg);
    };

    server.listen(port, () => {
      console.log(`Server listening on localhost:${port}`);
    });