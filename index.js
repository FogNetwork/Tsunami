const express = require('express')
const app = express()
const config = require('./config.json')
const port = config.port

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(‘index.html’, {root: ‘./public’})
}); 

app.listen(port, () => {
  console.log(`Server running at localhost:${port}`)
})
