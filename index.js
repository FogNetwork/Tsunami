const express = require('express')
const app = express()
const config = require('./config.json')
const port = process.env.PORT || config.port

app.use(express.static('./public', {
    extensions: ['html', 'htm'],
}));

app.get('/', function(req, res){
    res.sendFile('index.html', {root: './public'});
}); 

app.listen(port, () => {
  console.log(`Server running at localhost:${port}`)
})
