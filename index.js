const fetch = require('isomorphic-fetch');
const http = require('http');
const fs = require('fs');
const { format } = require('date-fns');

const siteUrl = 'https://mnetimall.onrender.com/'; // Replace with your site's URL
const pingInterval = 10 * 60 * 1000; // 10 minutes in milliseconds

const logFilePath = 'log/ping_log.txt';
const errorLogFilePath = 'error_log.txt'; // New error log file

async function pingSite() {
  try {
    console.log(`Pinging site ${siteUrl}...`);
    const startTime = Date.now();
    const response = await fetch(siteUrl);
    const endTime = Date.now();

    const responseTime = endTime - startTime;

    const now = new Date();
    const log = `Site pinged at ${format(now, 'dd/MM/yy')} at ${format(now, 'HH:mm:ss')} and response took ${responseTime}ms\n`;
    fs.appendFileSync(logFilePath, log);

    console.log(`Site pinged successfully. Response time: ${responseTime}ms`);
  } catch (error) {
    console.error('Error pinging site:', error);

    // Log the error to the error log file
    const now = new Date();
    const errorLog = `Error pinging site at ${format(now, 'dd/MM/yy')} at ${format(now, 'HH:mm:ss')}: ${error}\n`;
    fs.appendFileSync(errorLogFilePath, errorLog);

    // Run the pinger again immediately in case of an error
    pingSite();
  }
}

// Create an HTTP server that responds to requests
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is running and pinging the site every 10 minutes.');
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Ping the site initially and then set up the interval for periodic pinging
pingSite();
setInterval(pingSite, pingInterval);
