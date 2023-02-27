//変数s
const express=require("express"),app = express(), ytdl = require("ytdl-core"),cors = require('cors'),{Buffer}=require("buffer"),fs=require("fs")
app.use(cors())
app.use(express.raw({type:"*/*"}))

//エラーハンドリング
process.on("uncaughtException", function(err) {
    console.log(err);
});

app.get("/",(req,res)=>{
    res.send('<a href="/youtube/">youtube proxyはこちら</a>')
})
app.get("/youtube", (req, res) => {
    res.send(`<h1>YouTube Proxy</h1><form method="POST" autocomplete="off">
    <p>URL：<input type="text" name="url"></p>
    <p><input type="submit" value="GO"></p>
  </form>`)
})
app.post("/youtube",async(req,res)=>{
    
        
    console.log(Buffer.from(req.body).toString())
    res.redirect(`/youtube/${ytdl.getURLVideoID(decodeURIComponent(Buffer.from(req.body).toString()).split(";")[0].replace("url=",""))}`)
})
app.get("/youtube/:id", async(req, res) => {
    var r = { id: req.params.id }
    var stream = await ytdl.getBasicInfo(req.params.id);
  fs.writeFile("log",JSON.stringify(stream,null,"  "),()=>{})
      var title=stream.videoDetails.title
        r.title = title
        res.render("../views/video.ejs",r)
        
  
})
app.get("/yt/v/:id", (req, res) => {
    var URL = req.params.id;
    var stream = ytdl(URL);
    stream.on('info', (info) => {
        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        ytdl(URL, {
            format: 'mp4'
        }).pipe(res);
    });
});
app.listen(3000)