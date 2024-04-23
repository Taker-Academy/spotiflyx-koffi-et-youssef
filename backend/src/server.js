const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8080;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log('Hello');
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
