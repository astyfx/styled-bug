const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('static'));

app.get('/', (req, res) => {
  return res.render('index.html');
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
