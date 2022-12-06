require('dotenv').config();
const http = require('http');
const fs = require('fs');
const host = '192.168.1.131';
const port = 80;
const headers = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
	'Access-Control-Max-Age': 2592000,
	'Access-Control-Allow-Headers': 'Content-Type, Ayudante'
};
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.MAIL_ADDR,
		pass: process.env.MAIL_PASS
	}
});
const puppeteer = require('puppeteer');
const userAgent = require('user-agents');

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
	} else if (!req.headers.ayudante || req.headers.ayudante !== 'True') {
		res.writeHead(403, headers);
		res.end()
		return;
	} else if (req.method === 'GET') {
		console.log('data fetched')
		res.writeHead(200, headers);
		res.end(data);
		return;
	} else if (req.method === 'POST' && req.url === '/') {
		// TODO: write an err handling like on '/send'
		res.writeHead(200, headers);
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
	} else if (req.method === 'POST' && req.url === '/send') {
		res.writeHead(200, headers);
		let sendOpt = [];
		req.on('data', d => {
			sendOpt.push(d);
		}).on('end', () => {
			sendOpt = Buffer.concat(sendOpt).toString();
			sendOpt = JSON.parse(sendOpt);
			let mailOptions = {
				from: process.env.MAIL_ADDR,
				to: sendOpt.to,
				cc: process.env.MAIL_ADDR,
				subject: process.env.MAIL_SUBJ,
				html: process.env.MAIL_HEADER + sendOpt.html
			};
			transporter.sendMail(mailOptions, (err, info) => {
				if (err) {
					res.end(JSON.stringify({serverResponse: err, error: true}));
				} else {
					res.end(JSON.stringify({serverResponse: info, error: false}));
				}
			});
		});
	} else if (req.method === 'POST' && req.url === '/compare') {
		res.writeHead(200, headers);
		let body = [];
		req.on('data', d => {
			body.push(d);
		}).on('end', () => {
			body = Buffer.concat(body).toString();
			body = JSON.parse(body);
			console.log('heyyyyy', body, body.product);
			(async () => {
				const browser = await puppeteer.launch({headless: false});
				const page = await browser.newPage();
				await page.setDefaultNavigationTimeout(0);
				await page.setViewport({ width: 1280, height: 800 });
				await page.setUserAgent(userAgent.random().toString());
				await page.goto('https://www.soriana.com/');
				await page.waitForSelector('body');
				//const test2 = await page.$eval('body', el => el.outerHTML);
				//console.log('uiiiiii', test2);

				let searchBox = '#searchBtnTrack',
					searchBtn = '.search-submit-cta',
					prd = '.product';
				await page.waitForSelector(searchBox);
				const test4 = await page.$eval(searchBox, el => el.outerHTML);
				console.log('test 444444', test4);
				await page.type(searchBox, 'Aceite');
				const test5 = await page.$eval(searchBtn, el => el.outerHTML);
				console.log('test 555555', test5);
				/*const [response] = await Promise.all([
					page.waitForNavigation(),
					page.click(searchBtn),
				]);*/
				await page.click(searchBtn);
				await page.waitForSelector(prd);
				const test6 = await page.$eval(prd, el => el.outerHTML);
				console.log('test 666666', test6);
				//await page.type(searchBox, 'Aceite');
				//await page.click(searchBtn);
				//await page.waitForSelector(prd);
				//const test3 = await page.$eval(prd, el => el.outerHTML);
				//console.log('testttt3', test3);

				await browser.close();
				//console.log('oiiiiiii', page);
				/*let searchBox = 'input #searchBtnTrack',
					searchBtn = 'button .d-flex .align-items-center .search-submit-cta',
					prd = '.product';
				await page.waitForSelector('input');
				await page.type('input', 'Aceite');
				await page.click(searchBtn);
				
				await page.waitForSelector(prd);
				const test1 = await page.evaluate(prd => {
					let x1 = document.querySelector(prd);
					console.log('uuuuuuuuy', x1);
					return x1;
				}, prd);
				console.log('finallll', test1);*/
			})();
		})
	} else {
		res.writeHead(405, headers);
		res.end(`${req.method} is not allowed for the request.`);
	}
};

const server = http.createServer(requestListener);