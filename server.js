require('dotenv').config();
const http = require('http');
const fs = require('fs');
const host = 'localhost';
const port = 8000;
const headers = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
	'Access-Control-Max-Age': 2592000,
	'Access-Control-Allow-Headers': 'Content-Type'
};
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.MAIL_ADDR,
		pass: process.env.MAIL_PASS
	}
});

let data;
fs.readFile(__dirname + "/datos.json", 'utf8', (err, contents) => {
	if (err) {
		console.log(`Error reading the file: ${err}`);
		return
	}
	data = contents;
	server.listen(port, host, () => {
    	console.log(`Server is running on http://${host}:${port}`);
	});
});
	
const requestListener = (req, res) => {
	res.setHeader("Content-Type", "application/json");
	if (req.method === 'OPTIONS') {
		res.writeHead(204, headers);
		res.end();
		return;
	}
	if (req.method === 'GET') {
		console.log('data fetched')
		res.writeHead(200, headers);
		res.end(data);
		return;
	}
	if (req.method === 'POST' && req.url === '/') {
		let body = [];
		req.on('data', d =>{
			body.push(d);
		}).on('end', () => {
			body = Buffer.concat(body).toString();
			fs.writeFile(__dirname + '/datos.json', body, err => {
				err ? console.log(err) : console.log('Writing on file successfull');
			});
			res.end();
		});
	}
	if (req.method === 'POST' && req.url === '/send') {
		let sendOpt = [];
		req.on('data', d => {
			sendOpt.push(d);
		}).on('end', () => {
			sendOpt = Buffer.concat(sendOpt).toString();
			sendOpt = JSON.parse(sendOpt);
			console.log('oiii', typeof sendOpt.html);
			let mailOptions = {
				from: process.env.MAIL_ADDR,
				to: sendOpt.to,
				subject: process.env.MAIL_SUBJ,
				html: process.env.MAIL_HEADER + sendOpt.html
			};
			transporter.sendMail(mailOptions, (err, info) => {
				if (err) {
					console.log(err);
				} else {
					console.log(`Email sent: ${info.response}`);
				}
			});
			res.end();
		});
	}
	res.writeHead(405, headers);
	res.end(`${req.method} is not allowed for the request.`);
};

const server = http.createServer(requestListener);