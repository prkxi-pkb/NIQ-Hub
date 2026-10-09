import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const files = {'/':'index.html','/src/app.js':'src/app.js','/src/model.js':'src/model.js','/src/style.css':'src/style.css'};
const types = {html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8'};
const root = fileURLToPath(new URL('.',import.meta.url));
http.createServer(async(req,res)=>{
 const path = files[new URL(req.url,'http://localhost').pathname];
 if(!path){res.writeHead(404);res.end('Not found');return;}
 try{const body=await readFile(root+path);res.writeHead(200,{'Content-Type':types[path.split('.').pop()],'X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'"});res.end(body);}
 catch{res.writeHead(500);res.end('Unable to load application');}
}).listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('NIQ Resource Hub listening on port '+(process.env.PORT||3000)));
