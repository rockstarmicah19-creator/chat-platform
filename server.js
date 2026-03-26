const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Tell the server to look into the 'public' folder for your HTML/CSS/JS
app.use(express.static(path.join(__dirname, 'public')));

// If someone goes to the main URL, send them index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});