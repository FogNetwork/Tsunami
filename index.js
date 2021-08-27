const express = require('express')
const app = express()
const corrosion = require('corrosion'),
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
        if (req.url.startsWith("/corrosion/")) return proxy.request(req, res);
    res.status(404).sendFile('404.html', {root: './public'});
});

const proxy = new corrosion({
    prefix: '/corrosion/',
    title: 'Tsunami',
    ws: true,
    codec: 'xor',
    requestMiddleware: [
        corrosion.middleware.blacklist([
            'accounts.google.com',
        ], 'Page is blocked'),
    ],
});
