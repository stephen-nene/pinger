# pinger
pings a set site at a set interval

# Pinger README

This repository contains a simple pinger script written in Node.js that periodically sends requests to a specified URL and logs the results.

## Installation

1. Clone this repository to your local machine.

```sh
   git clone https://github.com/stephen-nene/pinger
```


2. Navigate to the project directory.

```sh
cd your-pinger-repo
```

3. Install the required dependencies.

```sh
npm install
```

## Usage
1. Open the `index.js` file and replace `siteUrl` with the URL you want to ping.

2. You can adjust the `pingInterval` to change the time interval between pings (in milliseconds).

3. Run the pinger script using the following command:

```sh
npm run ping
```

- The pinger will start sending requests to the specified URL at the set interval.

# Error Handling
If the pinger encounters an error while sending a request, it will log the error to the `error_log.txt `file and immediately attempt to ping the site again.

## Logs
The pinger logs the response times of successful pings to the log/ping_log.txt file. Any errors encountered during pinging are logged to the error_log.txt file.

## License
This project is licensed under the MIT License.