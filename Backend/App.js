const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');
var predictRouter = require('./routes/predict')

const app = express();
const port = 3000;

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
console.log("inside App.js");
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cors());
app.use('/', predictRouter);





app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
