var config = require('./config'),
    app = require("express").createServer(),
    util  = require('util'),
    exec = require('child_process').exec,
    md5 = require('MD5'),
    fs = require("fs"); // the second arg is the command 
                                          // options

app.get("/",function(req, res){
  var imgUrl = req.query["img"],
      imgName = md5(imgUrl)+".svg",
      child = exec('wget -qO- '+imgUrl+' | djpeg -bmp | '+config.potraceCmd+' -s',
    function(error, stdout, stderr){
      if (error !== null) {
        console.log('exec error: ' + error);
        res.send({
          error : error
        });
      } else {
        fs.writeFile(config.publicFolder+"/"+imgName,stdout,function(err){
          //res.writeHead(200, ['Content-Type', 'json/plain']);
          if(err){
            console.log(err);
            res.send({
              error : err
            });
          } else {
            console.log("SVG Successfuly created "+imgName);
            res.send({
              url : config.publicUrl+"/"+imgName
            });
          }
        });
      }
  })
  
});
app.listen(config.port);
console.log("Server Started");