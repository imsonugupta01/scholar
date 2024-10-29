// server.js

const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint to accept a string
app.post('/print', (req, res) => {
  const inputString = req.body.string;

  if (typeof inputString === 'string') {
    console.log('Received string:', inputString);
    res.status(200).json({ message: 'String received successfully!', inputString });
  } else {
    res.status(400).json({ error: 'Invalid input. Please provide a valid string.' });
  }
});

// Start the server on the specified port, listening on all network interfaces
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
