const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())

require('dotenv').config();

require('./server/routes/routesList')(app);

app.listen(port, () => console.log(`Listening on port ${port}`));