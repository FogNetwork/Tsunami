/*
Copyright © Fog Network
Made by Nebelung
MIT license: https://opensource.org/licenses/MIT
*/

const express = require('express')
const app = express()
const basicAuth = require('express-basic-auth');
const config = require('./config.json')
const port = process.env.PORT || config.port
const auth = config.auth
const username = config.username
const password = config.password
const users = {};
users[username] = password;

if (auth == "true") { 
app.use(basicAuth({
    users,
    challenge: true,
    unauthorizedResponse: autherror
}));
}

function autherror(req) {
    return req.auth
        ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
        : 'Error'
}

app.use(express.static('./public', {
    extensions: ['html', 'htm']
}));

app.get('/', function(req, res){
    res.sendFile('index.html', {root: './public'});
}); 

app.use(function (req, res) {
    res.status(404).sendFile('404.html', {root: './public'});
});

app.listen(port, () => {
  console.log(`Tsunami is running at localhost:${port}`)
})