const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies and handle CORS
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose schema and model for storing strings with timestamps enabled
const StringSchema = new mongoose.Schema({
    inputString: { type: String, required: true }
}, { timestamps: true }); // Enable timestamps for createdAt and updatedAt

const StringModel = mongoose.model('String', StringSchema);

// POST endpoint to accept a string and save it to MongoDB
app.post('/print', async (req, res) => {
    const inputString = req.body.string;

    if (typeof inputString === 'string') {
        try {
            // Create a new document and save it to MongoDB
            const newString = new StringModel({ inputString });
            await newString.save();

            console.log('Received and saved string:', inputString);
            res.status(200).json({ message: 'String received and saved successfully!', inputString });
        } catch (error) {
            console.error('Error saving to MongoDB:', error);
            res.status(500).json({ error: 'Failed to save string to database.' });
        }
    } else {
        res.status(400).json({ error: 'Invalid input. Please provide a valid string.' });
    }
});

// GET endpoint to fetch the last saved string
app.get('/last-message', async (req, res) => {
    try {
        // Find the latest document by sorting in descending order of createdAt
        const lastMessage = await StringModel.findOne().sort({ createdAt: -1 });

        if (lastMessage) {
            res.status(200).json({ lastMessage: lastMessage.inputString });
        } else {
            res.status(404).json({ message: 'No messages found in the database.' });
        }
    } catch (error) {
        console.error('Error fetching last message:', error);
        res.status(500).json({ error: 'Failed to retrieve the last message from the database.' });
    }
});

// Start the server on the specified port, listening on all network interfaces
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
