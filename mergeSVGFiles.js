var fs = require("fs"),
    libxmljs = require("libxmljs"), d = true;

module.exports = function(files,colors,cb){
  var n = colors.length;
  var paths = {},gs={};
  
  var mergeGroups = function(gs,w,h){
    d&&console.log("bf merge");
    
    var doc = new libxmljs.Document("1.0", "UTF-8");
    var svg = doc.node("svg");
        svg.attr({
          version:'1.0',
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox:"0 0 "+w+" "+h
        });

    for(var i in gs) if(gs.hasOwnProperty(i)){
      svg.addChild(gs[i]);      
    }
    cb(null,doc);
  }
  var maxx, minx,maxy,miny;
  d&&console.log("files",files); 
  for(var i = 0; i < files.length; i++){
    fs.readFile(files[i],"UTF-8",function(){
    
      var c = colors[i];
      return function(err,data){
        if(err) return cb(err);
        
        d&&console.log("data toString()",data.toString(),data,files[i]);
        var xmlDoc = libxmljs.parseXmlString(data);
        
        d&&console.log("c",c);
        
        // after potrace the group is the third childNodes
        var g = xmlDoc.childNodes()[3];
        var w = xmlDoc.root().attr("width").value(),
            h = xmlDoc.root().attr("height").value();
        
        // child og g are path or text
        for(var p = 0; p < g.childNodes().length; p++){
          var pa = g.childNodes()[p];
          if(pa.name()!== "text"){
            console.log(pa.attrs());
            pa.attr({
              fill : c
            });
            
          }
        }
        (w>maxw)&& (maxw=w);
        (h>maxh)&& (maxh=h);
        g&&(gs[c] = g); 
        (!--n)&&mergeGroups(gs,maxh,maxw);
      };
      
    }());
  }
}
