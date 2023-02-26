//変数s
const express=require("express"),app = express(), ytdl = require("ytdl-core"),cors = require('cors'),{Buffer}=require("buffer")
app.use(cors())
app.use(express.raw({type:"*/*"}))

app.get("/",(req,res)=>{
    res.send('<a href="/youtube/">youtube proxyはこちら</a>')
})
app.get("/youtube", (req, res) => {
    res.send(`<h1>YouTube Proxy</h1><form method="POST">
    <p>URL：<input type="text" name="url"></p>
    <p><input type="submit" value="GO"></p>
  </form>`)
})
app.post("/youtube",(req,res)=>{
    function get(){
        var obj={}
        decodeURIComponent(Buffer.from(req.body).toString()).split(";").forEach(elem => {
            const arr = elem.split("=");
            obj[arr[0]] = decodeURIComponent(arr[1]);
        });
        return obj
    }
    console.log(Buffer.from(req.body).toString())
    res.redirect(`/youtube/${ytdl.getURLVideoID(get().url)}`)
})
app.get("/youtube/:id", (req, res) => {
    var r = { id: req.params.id }
    var stream = ytdl(req.params.id);
    stream.on('info', (info) => {
        r.title = info.title
        console.log(r)
        res.render("../views/video.ejs",r)
        stream.destroy()
    })
})
app.get("/yt/v/:id", (req, res) => {
    var URL = req.params.id;
    console.log("url", URL);
    var stream = ytdl(URL);
    stream.on('info', (info) => {
        console.log(info.title);
        console.log(info.video_id);
        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        ytdl(URL, {
            format: 'mp4'
        }).pipe(res);
    });
});
app.listen(3000)