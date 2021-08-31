/*
  ______            _   _      _                      _    
 |  ____|          | \ | |    | |                    | |   
 | |__ ___   __ _  |  \| | ___| |___      _____  _ __| | __
 |  __/ _ \ / _` | | . ` |/ _ \ __\ \ /\ / / _ \| '__| |/ /
 | | | (_) | (_| | | |\  |  __/ |_ \ V  V / (_) | |  |   < 
 |_|  \___/ \__, | |_| \_|\___|\__| \_/\_/ \___/|_|  |_|\_\
             __/ |                                         
            |___/    
Made by Nebelung
MIT license: http://opensource.org/licenses/MIT
*/

const express = require('express')
const app = express()
const config = require('./config.json')
const port = process.env.PORT || config.port

app.use(express.static('./public', {
    extensions: ['html', 'htm']
}));

app.get('/', function(req, res){
    res.sendFile('index.html', {root: './public'});
}); 

app.listen(port, () => {
  console.log(`Server running at localhost:${port}`)
})

app.use(function (req, res) {
    res.status(404).sendFile('404.html', {root: './public'});
});
