import http from 'node:http';
import * as dotenv from 'dotenv';
import url from 'node:url';

dotenv.config();
const bdArray = new Array();

http
    .createServer((request, response) =>{
      const reqUrl = url.parse(request.url).pathname.replace(/\/$/g,'');
      switch (true) {
        case reqUrl===process.env.URL_API && request.method===process.env.GET_METHOD && reqUrl.length===process.env.URL_API.length:
            {
                response.statusCode=200
                response.write(JSON.stringify(bdArray));
                response.end();
                break;
            }
        case reqUrl===process.env.URL_API && request.method===process.env.POST_METHOD:
            {
                let body = [];
                request.on('data', (chunk) => {
                    body.push(chunk);
                }).on('end', () => {
                    console.log(body.join())
                    response.end();
                });
                // response.statusCode=200
                // response.write(JSON.stringify(bdArray));
                // response.end();
                break;
            }
      }
    })
    .listen(process.env['PORT'], ()=>console.log(`Server started!`));
