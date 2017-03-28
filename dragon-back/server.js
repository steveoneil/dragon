const express = require('express');
const bodyParser = require('body-parser');
// const io = require('./iofunctions');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
// app.use(express.static(__dirname + './../dragon/build'));
app.use(express.static(__dirname + '/'));

const club_routes = require('./routes/club');
const member_routes = require('./routes/member');

app.use('/api/club', club_routes);
app.use('/api/member', member_routes);

app.listen(PORT, () => {
    console.log('Server running. Listening on Port:%s', PORT)
    console.log('Stop with Ctrl+C')
})
