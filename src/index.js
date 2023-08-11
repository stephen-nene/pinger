const fetch = require('isomorphic-fetch');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');

const siteUrl = 'https://mnetimall.onrender.com/'; // Replace with your site's URL
const pingInterval = 5 * 60 * 1000; // 10 minutes in milliseconds

const logFilePath = path.join(__dirname, 'log', 'ping_log.txt');
const errorLogFilePath = path.join(__dirname, 'log', 'error_log.txt');

// Get the current time in the 'Africa/Nairobi' timezone (East African Time)
function getCurrentTime() {
  const now = new Date();
  const timeZone = 'Africa/Nairobi';
  const zonedTime = utcToZonedTime(now, timeZone);
  return zonedTime;
}

// Function to ping the site
console.log(`Pinging site ${siteUrl} at ${getCurrentTime()}...`);
async function pingSite() {
  try {
    const currentTime = getCurrentTime();

    const startTime = Date.now();
    const response = await fetch(siteUrl);
    const endTime = Date.now();

    const responseTime = endTime - startTime;

    const log = `Site pinged at ${format(currentTime, 'EEEE dd/MM/yy')} at ${format(currentTime, 'HH:mm:ss')} and response took ${responseTime}ms\n`;
    fs.appendFileSync(logFilePath, log);

    console.log(`Site pinged successfully at ${format(currentTime, 'HH:mm:ss')}. Response time: ${responseTime}ms`);
  } catch (error) {
    console.error('Error pinging site:', error);

    const currentTime = getCurrentTime();
    const errorLog = `Error pinging site at ${format(currentTime, 'dd/MM/yy')} at ${format(currentTime, 'HH:mm:ss')}: ${error}\n`;
    fs.appendFileSync(errorLogFilePath, errorLog);

    // Run the pinger again immediately in case of an error
    pingSite();
  }
}

// Create an HTTP server that responds to requests
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const indexPath = path.join(__dirname,'html', 'index.html');
    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.end(data);
      }
    });
  }else if (req.url === '/logs') {
    const logFilePath = path.join(__dirname, 'log', 'ping_log.txt');
    serveFile(res, logFilePath);
  } else if (req.url === '/errors') {
    const errorLogFilePath = path.join(__dirname, 'log', 'error_log.txt');
    serveFile(res, errorLogFilePath);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

function serveFile(res, filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    }
  });
}

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Ping the site initially and then set up the interval for periodic pinging
pingSite();
setInterval(pingSite, pingInterval);
