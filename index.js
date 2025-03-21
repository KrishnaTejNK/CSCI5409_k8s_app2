const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');

const app = express();
app.use(express.json());

const PV_DIR = '/krishna_PV_dir'; // Adjust if your first name differs

app.post('/calculate', (req, res) => {
    const { file, product } = req.body;
    console.log('Testing CI/CD');
    console.log('Testing CI/CD');
    if (!file || !product) {
        return res.status(400).json({ file: file || null, error: 'Invalid JSON input.' });
    }

    const filePath = `${PV_DIR}/${file}`;

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ file, error: 'File not found.' });
    }

    let sum = 0;
    let validCsv = true;

    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
            if (!row.product || !row.amount || isNaN(row.amount)) {
                validCsv = false;
            }
            if (row.product === product) {
                sum += parseInt(row.amount, 10);
            }
        })
        .on('end', () => {
            if (!validCsv) {
                return res.status(400).json({ file, error: 'Input file not in CSV format.' });
            }
            return res.status(200).json({ file, sum });
        })
        .on('error', (err) => {
            console.error(`Error reading file: ${err.message}`);
            return res.status(400).json({ file, error: 'Input file not in CSV format.' });
        });
});

app.listen(5000, () => {
    console.log('Container 2 is running on port 5000');
});