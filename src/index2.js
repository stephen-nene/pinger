const express = require('express');
const app = express();
const port = 3000;

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the root route!' });
});

app.get('/logs', (req, res) => {
  res.json({ message: 'This is the logs route.' });
});

app.get('/errors', (req, res) => {
  res.status(500).json({ error: 'An error occurred.' });
});

// Middleware to handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found.' });
});

// Middleware to handle server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
