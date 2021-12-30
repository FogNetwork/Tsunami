const ytdl = require('ytdl-core');
const fs = require("fs");

function watch(req, res) {
  if (req.query.v) {
  ytdl("https://www.youtube.com/watch?v=" + req.query.v)
  .on('info', (info) => {
  var watch = fs.readFileSync(__dirname + "/watch.html", "utf8")
  if (req.query.audio == "true") watch = watch.replace('<video src="%SRC%" poster="%POSTER%" class="video" width="70%" controls></video>', '<audio src="%SRC%" poster="%POSTER%" class="video" width="70%" controls></audio>')
  if (req.query.audio == "true") watch = watch.replace("margin-top: auto", "margin-top: 50px")
  watch = watch.replace("%SRC%", "/video?v=" + req.query.v)
  watch = watch.replace("%POSTER%", info.videoDetails.thumbnails[4].url)
  watch = watch.replace("%TITLE%", info.videoDetails.title)
  watch = watch.replace("%TITLE%", info.videoDetails.title)
  watch = watch.replace("%CHANNEL%", info.videoDetails.author.name)
  watch = watch.replace("%DESCRIPTION%", info.videoDetails.description)
  res.send(watch)
  })
  } else {
  res.sendFile(__dirname + "/index.html")
  }
}

function video(req, res) {
  const url = "https://www.youtube.com/watch?v=" + req.query.v
  if (req.query.audio !== "true") {
  ytdl(url).on("response", response => {
  res.setHeader("content-length", response.headers["content-length"])
  }).pipe(res)
  } else {
  ytdl(url, {filter: "audioonly"}).on("response", response => {
  res.setHeader("content-length", response.headers["content-length"])
  }).pipe(res)
  }
}

module.exports.watch = watch
module.exports.video = video