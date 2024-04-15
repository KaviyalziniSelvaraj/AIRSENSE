// Your Node.js script

const express = require('express');
const { spawn } = require('child_process');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // Check if the required properties exist in the request body
        if (!req.body.SO2 || !req.body.NO2 || !req.body.O3 || !req.body.PM2_5) {
            return res.status(400).send('Invalid input: missing required properties');
        }

        // Parse request body values to float
        const SO2 = parseFloat(req.body.SO2);
        const NO2 = parseFloat(req.body.NO2);
        const O3 = parseFloat(req.body.O3);
        const PM2_5 = parseFloat(req.body.PM2_5);

        // Check if any of the values are NaN (not a number)
        if (isNaN(SO2) || isNaN(NO2) || isNaN(O3) || isNaN(PM2_5)) {
            return res.status(400).send('Invalid input: all input values must be numbers');
        }

        const pythonProcess = spawn('python', ['model/trainedmodel.py', NO2, SO2, O3, PM2_5]);

        let outputData = '';

        // Listen for stdout data
        pythonProcess.stdout.on('data', (data) => {
            // Append the data to outputData
            outputData += data.toString();
        });

        // Listen for errors
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error from Python script: ${data}`);
        });

        // Listen for process exit
        pythonProcess.on('close', (code) => {
            console.log(`Python script exited with code ${code}`);
            console.log('output data original:', outputData);
            // Parse the string representation of the Python list
            // Send the parsed output as the response
            res.send(outputData);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
