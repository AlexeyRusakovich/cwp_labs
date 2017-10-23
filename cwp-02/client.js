const net = require('net');
const mix = require('./mixArray');
const qa = require("./qa");
const port = 10124;

const client = new net.Socket();

client.setEncoding('utf8');

let questions = mix.mixArray(qa.questions);

let currentQuestion;

client.connect(port, function() {
  console.log('Connected');
  client.write(qa.qa);
  client.once("data", data => {
    interview();
  })
});

let interview = () => {
    console.log(questions);
	currentQuestion = questions.pop();

	client.write(currentQuestion.question);
	client.once("data", answer => {
		console.log(
			answer === currentQuestion.answer ? "Right answer" : "Wrong answer"
		);
		console.log(`Question is ${currentQuestion.question}`);
		console.log(`Right answer is ${currentQuestion.answer}`);
		console.log(`Server answer is ${answer}\n\n`);
		questions.length !== 0 ? interview.call() : client.destroy();
	});
};

client.on('close', () => {
  console.log('Connection closed');
});
