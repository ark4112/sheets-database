const express = require('express');
const GoogleSpreadsheet = require('google-spreadsheet');

const app = express();
const port = process.env.PORT || 3000;

const doc = new GoogleSpreadsheet('13Jn0lE0uGa6m8EWPE8jr2CesrwxrTJbZlkfEyCgBL6k');

app.use(express.static('public'));
app.use(express.json());

app.post('/submit', async (req, res) => {
    try {
        await doc.useServiceAccountAuth(require('./credentials.json')); 
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];
        await sheet.addRow(req.body);

        res.sendStatus(200);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error submitting data.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});