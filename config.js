// exemple config.js file

var config = {};
 var exec = require('child_process').exec;
config.potraceCmd = "potrace";
config.publicFolder = "public/folder";
config.publicUrl = "public/url";
config.port = 3080;


 var buildRequest = function(svgStr,path,viewBox){
   return {
     host : "host",
     port : 80,
     path : '/path',
     method : 'POST',
     data : {svg : svgStr}
   };
 };

 config.cbSvg = function(svgUrl,path,viewBox){
  var opts = buildRequest(svgUrl,path,viewBox);
  var cmd = "curl --data 'requests="+JSON.stringify(opts.data.requests)+"&mod_url="+opts.data.mod_url+"' http://"+opts.host+":"+opts.port+opts.path;
  exec(cmd,function(error,stdout,stderr){
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      console.log("stdout : ",stdout,cmd);
    }
  });
 };

module.exports = config;
