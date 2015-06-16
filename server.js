var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");

var port = process.env.PORT || 3000;

var mimeTypes = {
    'html': 'text/html',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpg',
    'png': 'image/png',
    'js': 'text/javascript',
    'css': 'text/css'
};

http.createServer(function(req, res){
   var uri = url.parse(req.url).pathname;
   var filename = path.join(process.cwd(),unescape(uri));
   console.log('loading ' + uri);
   var stats;
   
   try{
       stats = fs.lstatSync(filename);
   } catch(e) { 
       res.writeHead(404, {'Content-type': 'text/plain'});
       res.write('404 not found');
       res.end();
       return;
   }
   
   if(stats.isFile()){
       var mimType = mimeTypes[path.extname(filename).split('.').reverse()[0]];
       res.writeHead(200, {'Content-type': mimType});
       var fileStream = fs.createReadStream(filename);
       fileStream.pipe(res);
   } else if(stats.isDirectory()) {
       res.writeHead(302, {
           'Location': 'index.html'
       });
       res.end();
   } else {
       res.writeHead(500, {'Content-type': 'text/plain'});
       res.write('500 Internal Error');
       res.end();
   }
   
}).listen(process.env.PORT);