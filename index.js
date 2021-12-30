/*
Copyright © Fog Network
Made by Nebelung
MIT license: https://opensource.org/licenses/MIT
*/

const express = require("express")
const app = express()
const basicAuth = require("express-basic-auth");
const config = require("./config.json")
const port = process.env.PORT || config.port
const Corrosion = require("./lib/server")
const PalladiumProxy = require("./palladium/server")
const auth = config.auth
const username = config.username
const password = config.password
const users = {}
users[username] = password
const mist = require("./mist");

const proxy = new Corrosion({
    prefix: "/corrosion/",
    codec: "xor",
    title: "Tsunami",
    forceHttps: true,
    requestMiddleware: [
        Corrosion.middleware.blacklist([
            "accounts.google.com",
        ], "Page is blocked"),
    ]
});

proxy.bundleScripts();

const palladium = new PalladiumProxy({
  encode: "xor",
  ssl: "false",
  prefix: "/palladium/",
  title: "Tsunami"
})

palladium.clientScript();

if (auth == "true") { 
app.use(basicAuth({
    users,
    challenge: true,
    unauthorizedResponse: autherror
}));
}

function autherror(req) {
    return req.auth
        ? ("Credentials " + req.auth.user + ":" + req.auth.password + " rejected")
        : "Error"
}

app.use(express.static("./public", {
    extensions: ["html"]
}));

app.get("/", function(req, res){
    res.sendFile("index.html", {root: "./public"});
});

app.use(function (req, res) {
    if (req.url.startsWith("/watch")) {
      mist.watch(req, res)
    } else if (req.url.startsWith("/video")) {
      mist.video(req, res)
    } else if (req.url.startsWith(proxy.prefix)) {
      proxy.request(req,res);
    } else if (req.url.startsWith(palladium.prefix)) {
      return palladium.request(req, res)
    } else {
      res.status(404).sendFile("404.html", {root: "./public"});
    }
})

app.listen(port, () => {
  console.log(`Tsunami is running at localhost:${port}`)
})