const express = require('express')
const app = express()
const config = require('./config.json')
const port = process.env.PORT || config.port

app.use(express.static('./public', {
    extensions: ['html', 'htm'],
    res.status(404).send('404');
}));

app.get('/', function(req, res){
    res.sendFile('index.html', {root: './public'});
}); 

app.listen(port, () => {
  console.log(`Server running at localhost:${port}`)
})
